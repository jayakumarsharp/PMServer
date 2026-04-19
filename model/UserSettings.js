import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    claudeApiKey: {
      type: String,
      default: null,
    },
    defaultCurrency: {
      type: String,
      default: "INR",
    },
    aiAnalysisEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

export { UserSettings };
