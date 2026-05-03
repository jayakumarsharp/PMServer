const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

// Reads the JWT from the Authorization header and attaches the decoded payload
// to req.user. Does NOT block the request if no token is present.
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      if (req.user && req.user._id != null) {
        req.user._id = String(req.user._id);
      }
    }
    return next();
  } catch (err) {
    // Invalid token — clear it and continue; ensureLoggedIn will block if needed
    req.user = null;
    return next();
  }
}

// Blocks the request if the user is not authenticated
function ensureLoggedIn(req, res, next) {
  try {
    if (!req.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

// Blocks the request if the authenticated user doesn't match req.body.username
function ensureCorrectUser(req, res, next) {
  try {
    const user = req.user;
    if (!(user && user.username === req.body.username)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Require JWT username to match :username (and a non-empty user id for data routes). */
function ensureSameUserAsParam(param = "username") {
  return (req, res, next) => {
    try {
      if (!req.user) throw new UnauthorizedError();
      if (req.params[param] !== req.user.username) throw new UnauthorizedError();
      if (!req.user._id) throw new UnauthorizedError("Please sign out and sign in again.");
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

// Blocks the request if the authenticated user doesn't own the portfolio
async function ensureCorrectPortfolio(req, res, next) {
  try {
    const user = req.user;
    if (!(user && user.username)) throw new UnauthorizedError();
    // Ownership is enforced inside the service layer for now
    return next();
  } catch (err) {
    return next(err);
  }
}

// Blocks the request if the authenticated user doesn't own the holding
async function ensureCorrectHolding(req, res, next) {
  try {
    const user = req.user;
    if (!(user && user.username)) throw new UnauthorizedError();
    // Ownership is enforced inside the service layer for now
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  ensureSameUserAsParam,
  ensureCorrectPortfolio,
  ensureCorrectHolding,
};
