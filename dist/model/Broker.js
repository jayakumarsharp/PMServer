"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var brokerSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  buy_commission: {
    type: Number,
    required: true,
    min: 0,
    "default": 0
  },
  sell_commission: {
    type: Number,
    required: true,
    min: 0,
    "default": 0
  },
  default_currency: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    "default": "USD"
  },
  notes: {
    type: String,
    trim: true
  },
  user_id: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// One broker name per user
brokerSchema.index({
  user_id: 1,
  name: 1
}, {
  unique: true
});
var Broker = _mongoose["default"].model("Broker", brokerSchema);
var _default = exports["default"] = Broker;
//# sourceMappingURL=Broker.js.map