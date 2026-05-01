"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserSettings = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var userSettingsSchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  claudeApiKey: {
    type: String,
    "default": null
  },
  defaultCurrency: {
    type: String,
    "default": "INR"
  },
  aiAnalysisEnabled: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});
var UserSettings = exports.UserSettings = _mongoose["default"].model("UserSettings", userSettingsSchema);
//# sourceMappingURL=UserSettings.js.map