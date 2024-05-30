/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");
const User = require("../model/user");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && user.username === req.params.username)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

async function ensureCorrectPortfolio(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && user.username)) throw new UnauthorizedError();

    const portfolioIds = await User.getUserPortfolioIds(user.username);
    if (!portfolioIds.includes(+req.params.id)) {
      throw new UnauthorizedError();
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

async function ensureCorrectHolding(req, res, next) {
  try {
    const user = res.locals.user;

    //Ensure user Object Exists and Has a username Property:
    if (!(user && user.username)) throw new UnauthorizedError();
    const holdingIds = await User.getUserHoldingIds(user.username);
    if (!holdingIds.includes(+req.params.id)) {
      throw new UnauthorizedError();
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  ensureCorrectPortfolio,
  ensureCorrectHolding,
};
