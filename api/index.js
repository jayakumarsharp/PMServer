// Vercel serverless entry point.
// The vercel-build script pre-compiles all ES modules to dist/ using @babel/cli.
// This avoids dynamic require('@babel/preset-env') which Vercel's bundler can't trace.
module.exports = require("../dist/index").default;
