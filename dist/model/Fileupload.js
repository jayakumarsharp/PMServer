"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var fileUploadSchema = new _mongoose["default"].Schema({
  filename: String,
  filepath: String
});
var security = _mongoose["default"].model('FileUpload', fileUploadSchema);
var _default = exports["default"] = security;
//# sourceMappingURL=Fileupload.js.map