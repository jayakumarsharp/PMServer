"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// Stores API keys / tokens per broker per user.
// In production these should be encrypted at rest.
var brokerCredentialSchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  broker: {
    type: String,
    "enum": ["upstox", "fyers", "zerodha", "angel", "5paisa"],
    required: true
  },
  apiKey: {
    type: String
  },
  apiSecret: {
    type: String
  },
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  tokenExpiry: {
    type: Date
  },
  isActive: {
    type: Boolean,
    "default": true
  },
  lastSyncedAt: {
    type: Date
  },
  syncStatus: {
    type: String,
    "enum": ["idle", "syncing", "error", "success"],
    "default": "idle"
  },
  syncError: {
    type: String
  }
}, {
  timestamps: true
});
brokerCredentialSchema.index({
  userId: 1,
  broker: 1
}, {
  unique: true
});
var BrokerCredential = _mongoose["default"].model("BrokerCredential", brokerCredentialSchema);
var _default = exports["default"] = BrokerCredential;
//# sourceMappingURL=BrokerCredential.js.map