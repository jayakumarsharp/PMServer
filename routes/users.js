const express = require("express");
const userRouter = express.Router();
const { ensureCorrectUser } = require("../middleware/auth");
require("../expressError");
const User = require("../model/user");
import { SECRET_KEY } from '../config';


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
  // ensureCorrectUser,
  async function (req, res, next) {
    try {
      const user = await User.getComplete(req.params.username);
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
  "/:username/watchlist/:symbol",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      await User.addToWatchlist(req.params.username, req.params.symbol);
      return res.json({ watched: req.params.symbol });
    } catch (err) {
      return next(err);
    }
  }
);



export default userRouter;
