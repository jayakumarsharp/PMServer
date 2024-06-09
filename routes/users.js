const express = require("express");
const userRouter = express.Router();
const { ensureCorrectUser } = require("../middleware/auth");
require("../expressError");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { createToken } = require("../helpers/tokens");

const jsonschema = require("jsonschema");




/**
 * POST /register
 *
 * Registers a new user.
 *
 * Request body should contain:
 * {
 *    "username": "example",
 *    "password": "password123",
 *    "email": "example@example.com"
 * }
 *
 * Returns:
 * {
 *    "username": "example",
 *    "email": "example@example.com"
 * }
 */
userRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    console.log(req.body);
    var user={username, password, email};
    const newUser = await User.register(user);
    res.json({ username: newUser.username, email: newUser.email });
  } catch (err) {
    next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, email, watchlist }
 *   where watchlist is [...symbols]
 *
 * Authorization required: same user-as-:username
 **/
userRouter.get(
  "/:username",
  // ensureCorrectUser,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/complete => { user }
 *
 * Returns { username, email, watchlist, portfolios }
 *   where watchlist is [...symbols]
 *   where portfolios is [{ id, name, cash, notes, username, holdings }, ...]
 *   where holdings is [{ id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }, ...]
 *
 * Authorization required: same user-as-:username
 **/

userRouter.get(
  "/:username/complete",
  //  ensureCorrectUser,
  async function (req, res, next) {
    try {
      console.log('called compkete')
      const user = await User.getComplete(req.params.username);
      debugger;
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/watchlist/[symbol] { state } => { watchlist }
 *
 * Returns {"watched": symbol}
 *
 * Authorization required: same-user-as:username
 */

userRouter.post(
  "/watchlist",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const { username, symbol } = req.body;
    var user={username, symbol};//obj
      debugger;
      const watchlistAdded = await User.addToWatchlist(user);
      res.json({ watched: watchlistAdded });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/watchlist/[symbol] { state } => { watchlist } 
 * 
 * Returns {"unwatched": symbol}
 * 
 * Authorization required: same-user-as:username
*/

userRouter.delete(
  "/removeWatchlist",
  // ensureCorrectUser,
  async function (req, res, next) {
    
    try {
      const { username, symbol } = req.body;
    var user={username, symbol};//obj
      debugger;
      const watchlistRemoved = await User.removeFromWatchlist(user);
      res.json({ unwatched: watchlistRemoved });
    } catch (err) {
      return next(err);
    }
  }
);


userRouter.post('/token', async (req, res, next) => {
  try {
    // const { username } = req.body;
    // const token = jwt.sign({ username }, SECRET_KEY);
    // res.json({ token });
    console.log('login called')
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    next(err);
  }
});



export default userRouter;
