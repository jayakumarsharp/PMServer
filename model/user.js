import mongoose from "mongoose";

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


export {
  User
  };
