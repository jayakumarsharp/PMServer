"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var userSchema = new _mongoose["default"].Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  watchlist: [{
    type: String
  }] // Assuming watchlist is an array of symbols
});
var User = exports.User = _mongoose["default"].model("User", userSchema);

/** Register user with data.
 *
 * Returns { username, email }
 *
 * Throws BadRequestError on duplicates.
 * It seems like there's an error in your code because the identifier username is being declared twice,
 * function parameter renamed to avoid the collision:
 **/
//# sourceMappingURL=user.js.map