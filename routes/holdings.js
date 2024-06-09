const express = require("express");
const holdingRouter = express.Router();
const holding = require("../model/holding");
const jsonschema = require("jsonschema");


/** POST / { holding } => { holding } 
 * 
 * holding should be { symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }
 * 
 * Returns { id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }
 * 
 * Authorization required: logged in user
*/

holdingRouter.post("/createHolding", async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, holding);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      const holding = await holding.create(req.body);
      return res.status(201).json({ holding });
    } catch (err) {
      return next(err);
    }
  });

 /** Given a holding id, return data about the holding 
   * 
   * Returns { id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }
   * 
   * Throws NotFoundError if not found.
   */

holdingRouter.get("/:id", async function (req, res, next) {
    try {
      const existingholding = await holding.get(req.params.id)
      return res.json({ existingholding });
    } catch (err) {
      return next(err);
    }
  });

  /** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: user must own portfolio
 */

router.delete("/:id", ensureCorrectHolding, async function (req, res, next) {
    try {
    
      await holding.remove(req.params.id);
      return res.json({ deleted: +req.params.id });
    } catch (err) {
      return next(err);
    }
  })

  // export default portfolioRouter;

module.exports = holdingRouter;

  