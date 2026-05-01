"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var importMappingSchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mappingName: {
    type: String,
    required: true,
    trim: true
  },
  brokerName: {
    type: String,
    trim: true,
    "default": ""
  },
  // Maps our field names → the user's CSV column header
  // e.g. { symbol: "Scrip Name", shares_owned: "Qty", executed_price: "Buy Price" }
  columnMap: {
    type: Map,
    of: String,
    required: true
  },
  dateFormat: {
    type: String,
    "default": "YYYY-MM-DD"
  },
  // How to interpret tran_code values in the CSV
  // e.g. { buy: ["B", "BUY", "Purchase"], sell: ["S", "SELL", "Sale"] }
  tranCodeMap: {
    buy: {
      type: [String],
      "default": ["B", "BUY", "buy", "Purchase"]
    },
    sell: {
      type: [String],
      "default": ["S", "SELL", "sell", "Sale"]
    }
  }
}, {
  timestamps: true
});
importMappingSchema.index({
  userId: 1,
  mappingName: 1
}, {
  unique: true
});
var ImportMapping = _mongoose["default"].model("ImportMapping", importMappingSchema);
var _default = exports["default"] = ImportMapping;
//# sourceMappingURL=ImportMapping.js.map