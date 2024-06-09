import mongoose from "mongoose";
import Portfolio from "./portfolio";
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError } = require("../expressError");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  watchlist: [{ type: String }], // Assuming watchlist is an array of symbols
});

const User = mongoose.model("User", userSchema);

/** Register user with data.
 *
 * Returns { username, email }
 *
 * Throws BadRequestError on duplicates.
 * It seems like there's an error in your code because the identifier username is being declared twice,
 * function parameter renamed to avoid the collision:
 **/
async function register(Obj) {
  console.log(
    "Register function called with:",
    Obj.username,
    Obj.password,
    Obj.email
  );

  const duplicateUser = await User.findOne({ username: Obj.username });
  console.log("Duplicate user:", duplicateUser);

  if (duplicateUser)
    throw new BadRequestError(`Duplicate Username: ${Obj.username}`);
  const hashedPassword = await bcrypt.hash(Obj.password, 10);
  console.log("Hashed password:", hashedPassword);

  const result = await User.create({
    username: Obj.username,
    password: hashedPassword,
    email: Obj.email,
  });
  console.log("Inserted user result:", result);

  return { username: result.username, email: result.email };
}

async function authenticate(username, password) {
  // try to find the user first
  console.log(username);
  const result = await User.findOne({ username: username });
  if (result) {
    // compare hashed password to a new hash from password
    const isValid = await bcrypt.compare(password, result.password);
    if (isValid === true) {
      delete result.password;
      return result;
    }
  }

  throw new UnauthorizedError("Invalid username/password");
}

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
    debugger;
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
    throw new Error(
      `Error while fetching complete user data: ${error.message}`
    );
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

/**
 * Add stock to watchlist: update db, returns undefined.
 *
 * @param {string} username - username watching stock
 * @param {string} symbol - stock symbol
 */
async function addToWatchlist(Obj) {
  console.log("Register function called with:", Obj.username, Obj.symbol);
  const user = await User.findOne({ username: Obj.username });
  if (!user) throw new NotFoundError(`No username: ${Obj.username}`);
  console.log("User is found:", Obj.username, Obj.symbol);
  //This line queries the MongoDB collection users to find a document where the username matches the provided
  //username and where within the watchlist array there is an object with a symbol property matching the provided symbol.
  // const duplicateCheck = await User.findOne({
  //   username: Obj.username,
  //   "watchlist.symbol": symbol,
  // });
  const duplicateCheck = await User.findOne({
    username: Obj.username,
    watchlist: { $in: [Obj.symbol] },
  });

  if (duplicateCheck) {
    throw new BadRequestError(
      `Symbol ${Obj.symbol} already watched by user ${Obj.username}`
    );
  }
  // Add the symbol to the user's watchlist
  const result = await User.updateOne(
    { username: Obj.username },
    { $push: { watchlist: Obj.symbol } }
  );
  return { watchlist: Obj.symbol };
}

/** Remove stock from watchlist: update db, returns undefined.
 *
 * - username: username watching stock
 * - symbol: stock symbol
 */
async function removeFromWatchlist(Obj) {
  console.log("Remove function called with:", Obj.username, Obj.symbol);
  const user = await User.findOne({ username: Obj.username });
  if (!user) throw new NotFoundError(`No username: ${Obj.username}`);
  console.log("User is found:", Obj.username, Obj.symbol);

  const symbolExists = await User.findOne({
    username: Obj.username,
    watchlist: { $in: [Obj.symbol] },
  });

  if (!symbolExists) {
    throw new BadRequestError(
      `Symbol ${Obj.symbol} not found in watchlist of user ${Obj.username}`
    );
  }

  const result = await User.updateOne(
    { username: Obj.username },
    { $pull: { watchlist: Obj.symbol } }
  );
  return { watchlist: Obj.symbol };
}

export {
  User,
  get,
  getComplete,
  addToWatchlist,
  register,
  removeFromWatchlist,
  authenticate,
};
