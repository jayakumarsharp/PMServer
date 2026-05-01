"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JobMonitor = void 0;
var mongoose = require("mongoose");
var jobMonitorSchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true
  },
  lastRun: {
    type: Date,
    "default": Date.now
  }
});
var JobMonitor = exports.JobMonitor = mongoose.model("JobMonitor", jobMonitorSchema);
//# sourceMappingURL=jobMonitor.js.map