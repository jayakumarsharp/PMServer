import mongoose from "mongoose";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const Portfolio = require("./portfolio");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  watchlist: [{ type: String }], // Assuming watchlist is an array of symbols
});

const User = mongoose.model("User", userSchema);

// Define the get function to fetch user data including watchlist
async function get(username) {
  try {
    const user = await User.findOne({ username })
      .select("username,email,watchlist")
      .lean();
    if (!user) {
      throw new NotFoundError(`No user: ${username}`);
    }
    return user;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching user: ${error.message}`);
  }
}

// Define the getComplete function to fetch user data including watchlist and portfolios
async function getComplete(username) {
  try {
    const user = await User.findOne({ username })
      .select("username,email,watchlist")
      .lean();
    // const watchlist = User.watchlist;
    const portfolios = await Portfolio.find({ _id: { $in: user.portfolios } });
    // Add the watchlist and portfolios to the user object
    // user.watchlist = watchlist;
    user.portfolios = portfolios;
    return user;
  } catch (error) {
    throw new Error(`Error while fetching complete user data: ${error.message}`);
  }
}


/// getUserPortfolioIds method directly as an instance method (methods) on the userSchema means that this
// method will be available to each individual instance of the User model.
userSchema.methods.getUserPortfolioIds = async function () {
  //Portfolio.find({ username: this.username }): This part of the code performs a query on the Portfolio collection to find documents where the
  //username field matches the username property of the current user instance (this.username).
  const portfolios = await Portfolio.find({ username: this.username }).select(
    "_id"
  );

  // Extract the IDs from the portfolios and return them as an array
  const portfolioIds = portfolios.map((portfolio) => portfolio._id);
  return portfolioIds;
};

export { User, get,getComplete };
