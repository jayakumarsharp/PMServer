const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  const payload = { username: user.username };
  if (user._id != null) {
    payload._id = user._id.toString ? user._id.toString() : String(user._id);
  }
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
