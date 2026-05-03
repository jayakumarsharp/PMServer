"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var importHistorySchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  portfolioId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Portfolio"
  },
  mappingId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "ImportMapping"
  },
  filename: {
    type: String,
    required: true
  },
  totalRows: {
    type: Number,
    "default": 0
  },
  importedRows: {
    type: Number,
    "default": 0
  },
  skippedRows: {
    type: Number,
    "default": 0
  },
  // duplicates
  errorRows: {
    type: Number,
    "default": 0
  },
  status: {
    type: String,
    "enum": ["preview", "completed", "failed"],
    "default": "preview"
  },
  errors: [{
    row: Number,
    message: String
  }]
}, {
  timestamps: true,
  // `errors` is an intentional field in import history documents.
  suppressReservedKeysWarning: true
});
var ImportHistory = _mongoose["default"].model("ImportHistory", importHistorySchema);
var _default = exports["default"] = ImportHistory;
//# sourceMappingURL=ImportHistory.js.map