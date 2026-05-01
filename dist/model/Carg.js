"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// models/Carg.js

var cargSchema = new _mongoose["default"].Schema({
  securityMaster_id: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'SecurityMaster',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  cagr1yr: {
    type: Number,
    "default": null
  },
  cagr3yr: {
    type: Number,
    "default": null
  },
  cagr5yr: {
    type: Number,
    "default": null
  },
  cagr10yr: {
    type: Number,
    "default": null
  },
  createdAt: {
    type: Date,
    "default": Date.now
  },
  updatedAt: {
    type: Date,
    "default": Date.now
  }
});
var Carg = _mongoose["default"].model('Carg', cargSchema);
var _default = exports["default"] = Carg;
//# sourceMappingURL=Carg.js.map