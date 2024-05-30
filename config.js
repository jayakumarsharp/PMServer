/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const ALPHAVANTAGE_KEY = process.env.ALPHAVANTAGE_KEY ||"RWS8W5Z52IH2R05L";

console.log("SECRET_KEY:".yellow, SECRET_KEY);

module.exports = {
    SECRET_KEY,
  };