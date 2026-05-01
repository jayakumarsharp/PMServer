"use strict";

require("dotenv").config();
require("colors");
var SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pmserver";
var PORT = parseInt(process.env.PORT) || 3003;
var isProd = process.env.NODE_ENV === "production";
if (!isProd) {
  console.log("MONGODB_URI:".cyan, MONGODB_URI);
}
if (!isProd && SECRET_KEY === "secret-dev") {
  console.warn("WARNING:".yellow, "Using default SECRET_KEY — set SECRET_KEY env var before deploying");
}
module.exports = {
  SECRET_KEY: SECRET_KEY,
  MONGODB_URI: MONGODB_URI,
  PORT: PORT
};
//# sourceMappingURL=config.js.map