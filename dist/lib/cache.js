"use strict";

var NodeCache = require("node-cache");

// Prices: 5 minute TTL — fresh enough for a PMS, won't hammer Yahoo Finance
var priceCache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60
});

// Security master: 24 hour TTL — rarely changes
var securityCache = new NodeCache({
  stdTTL: 86400,
  checkperiod: 3600
});

// Exchange rates: 1 hour TTL
var fxCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 600
});
function getPriceCache() {
  return priceCache;
}
function getSecurityCache() {
  return securityCache;
}
function getFxCache() {
  return fxCache;
}
module.exports = {
  getPriceCache: getPriceCache,
  getSecurityCache: getSecurityCache,
  getFxCache: getFxCache
};
//# sourceMappingURL=cache.js.map