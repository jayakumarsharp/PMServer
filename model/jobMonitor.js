const mongoose = require("mongoose");

const jobMonitorSchema = new mongoose.Schema({
  jobName: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  lastRun: { type: Date, default: Date.now },
});

const JobMonitor = mongoose.model("JobMonitor", jobMonitorSchema);

export { JobMonitor };
