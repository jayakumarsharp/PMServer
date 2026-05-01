"use strict";

var jwt = require("jsonwebtoken");
var _require = require("../config"),
  SECRET_KEY = _require.SECRET_KEY;

/** return signed JWT from user data. */

function createToken(user) {
  // console.assert(user.isAdmin !== undefined,
  //   "createToken passed user without isAdmin property");

  var payload = {
    username: user.username
  };
  return jwt.sign(payload, SECRET_KEY);
}
module.exports = {
  createToken: createToken
};
//# sourceMappingURL=tokens.js.map