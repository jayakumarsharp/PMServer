"use strict";

var jwt = require("jsonwebtoken");
var _require = require("../config"),
  SECRET_KEY = _require.SECRET_KEY;

/** return signed JWT from user data. */

function createToken(user) {
  var payload = {
    username: user.username
  };
  if (user._id != null) {
    payload._id = user._id.toString ? user._id.toString() : String(user._id);
  }
  return jwt.sign(payload, SECRET_KEY);
}
module.exports = {
  createToken: createToken
};
//# sourceMappingURL=tokens.js.map