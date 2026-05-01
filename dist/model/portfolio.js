"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Portfolio = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var portfolioSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true
  },
  notes: String,
  user_id: {
    type: _mongoose["default"].Schema.ObjectId,
    ref: "User"
  }
});
var Portfolio = exports.Portfolio = _mongoose["default"].model("Portfolio", portfolioSchema);

/** Create a portfolio, update db, return new portfolio data.
 *
 * data should be { name, cash, notes, username }
 *
 * Returns { id, name, cash, notes, username }
 *
 * Throws BadRequestError if portfolio already exists for user
 */
//# sourceMappingURL=portfolio.js.map