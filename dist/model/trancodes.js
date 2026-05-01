"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trancodeMaster = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var trancodeSchema = new _mongoose["default"].Schema({
  trantype: String,
  desc: String
});
var trancodeMaster = exports.trancodeMaster = _mongoose["default"].model('trancode', trancodeSchema);
//# sourceMappingURL=trancodes.js.map