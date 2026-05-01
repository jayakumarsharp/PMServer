"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accountSchema = new Schema({
  balance: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    "default": null
  },
  currency: {
    type: String,
    required: true
  },
  isExcluded: {
    type: Boolean,
    "default": false
  },
  name: {
    type: String,
    required: true
  },
  platformId: {
    type: String,
    "default": null
  },
  value: {
    type: Number,
    "default": 0
  },
  activities: {
    type: Number,
    "default": 0
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});
var Account = mongoose.model('Account', accountSchema);
module.exports = Account;
//# sourceMappingURL=Account.js.map