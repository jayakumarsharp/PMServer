"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var ATHTrackerSchema = new _mongoose["default"].Schema({
  symbol: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'SecurityMaster'
  },
  HighToday: Number,
  ATH: Number,
  ATHDate: Date
});
var ATHTracker = _mongoose["default"].model('Security', ATHTrackerSchema);
var _default = exports["default"] = ATHTracker;
//# sourceMappingURL=ATHTracker.js.map