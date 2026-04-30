// Vercel serverless entry point.
// Uses @babel/register to transpile ES module imports at runtime
// so the main Express app (index.js) can run as a serverless function.
require("@babel/register")({
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
  ignore: [/node_modules/],
});

module.exports = require("../index").default;
