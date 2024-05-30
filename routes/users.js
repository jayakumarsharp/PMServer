const jsonschema = require("jsonschema");
const express = require("express");
const router = express.Router();
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../model/user");
// const userUpdateSchema = require("../schemas/userUpdate.json");


/** GET /[username] => { user }
 *
 * Returns { username, email, watchlist }
 *   where watchlist is [...symbols]
 *
 * Authorization required: same user-as-:username
 **/
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });


/** GET /[username]/complete => { user }
 *
 * Returns { username, email, watchlist, portfolios }
 *   where watchlist is [...symbols]
 *   where portfolios is [{ id, name, cash, notes, username, holdings }, ...]
 *   where holdings is [{ id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }, ...]
 *
 * Authorization required: same user-as-:username
 **/

  router.get("/:username/complete", ensureCorrectUser, async function(req,res,next){
try{
const user=await User.getComplete(req.params.username);return res.json({ user });
} catch (err) {
  return next(err);
}
});


