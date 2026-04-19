/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pmserver";
const PORT = parseInt(process.env.PORT) || 3003;

console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("MONGODB_URI:".cyan, MONGODB_URI);

module.exports = {
    SECRET_KEY,
    MONGODB_URI,
    PORT,
  };