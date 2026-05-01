"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currencyMaster = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var currencySchema = new _mongoose["default"].Schema({
  name: String,
  code: String,
  country: String
});
var currencyMaster = exports.currencyMaster = _mongoose["default"].model('currency', currencySchema);
//# sourceMappingURL=Currency.js.map