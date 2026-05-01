"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analyzePortfolio = analyzePortfolio;
exports.getSettings = getSettings;
exports.saveApiKey = saveApiKey;
exports.updateSettings = updateSettings;
var _sdk = _interopRequireDefault(require("@anthropic-ai/sdk"));
var _portfolio = require("../model/portfolio");
var _portfoliotransactions = require("../model/portfoliotransactions");
var _SecurityMaster = require("../model/SecurityMaster");
var _Pricedata = require("../model/Pricedata");
var _UserSettings = require("../model/UserSettings");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/**
 * Get user's Claude API key from settings.
 * Throws a clear error if not configured.
 */
function getUserApiKey(_x) {
  return _getUserApiKey.apply(this, arguments);
}
/**
 * Build a rich portfolio context string for Claude.
 * Fetches portfolios, transactions with security + price data.
 */
function _getUserApiKey() {
  _getUserApiKey = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(userId) {
    var settings, err;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _UserSettings.UserSettings.findOne({
            userId: userId
          }).lean();
        case 2:
          settings = _context.sent;
          if (settings !== null && settings !== void 0 && settings.claudeApiKey) {
            _context.next = 7;
            break;
          }
          err = new Error("Claude API key not configured. Go to Settings → Claude AI to add your key.");
          err.status = 400;
          throw err;
        case 7:
          return _context.abrupt("return", settings.claudeApiKey);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getUserApiKey.apply(this, arguments);
}
function buildPortfolioContext(_x2) {
  return _buildPortfolioContext.apply(this, arguments);
}
/**
 * Send a message to Claude with portfolio context.
 * @param {string} userId - MongoDB user ID
 * @param {string} userMessage - The question/request from the user
 * @param {string} analysisType - e.g. "general", "risk", "rebalance", "tax"
 * @param {Array}  chatHistory - [{role, content}] for multi-turn
 * @returns {string} Claude's text response
 */
function _buildPortfolioContext() {
  _buildPortfolioContext = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(userId) {
    var portfolios, lines, grandTotalInvested, grandTotalCurrent, _iterator, _step, pf, txns, posMap, _iterator2, _step2, t, _sid, isBuy, isSell, holdingLines, pfInvested, pfCurrent, _i, _Object$entries, _Object$entries$_i, sid, pos, sec, price, name, symbol, avgCost, currentPrice, currentValue, invested, gainLoss, gainPct, pfGain, pfGainPct, totalGain, totalGainPct;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _portfolio.Portfolio.find({
            user_id: userId
          }).lean();
        case 2:
          portfolios = _context2.sent;
          if (portfolios.length) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return", "The user has no portfolios yet.");
        case 5:
          lines = [];
          grandTotalInvested = 0;
          grandTotalCurrent = 0;
          _iterator = _createForOfIteratorHelper(portfolios);
          _context2.prev = 9;
          _iterator.s();
        case 11:
          if ((_step = _iterator.n()).done) {
            _context2.next = 57;
            break;
          }
          pf = _step.value;
          _context2.next = 15;
          return _portfoliotransactions.PortfolioTransactions.find({
            portfolio_id: pf._id
          }).lean();
        case 15:
          txns = _context2.sent;
          // Group by symbol to compute net position
          posMap = {};
          _iterator2 = _createForOfIteratorHelper(txns);
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              t = _step2.value;
              _sid = String(t.symbol);
              if (!posMap[_sid]) posMap[_sid] = {
                shares: 0,
                cost: 0,
                symbolId: t.symbol
              };
              isBuy = ["by", "buy", "B"].includes(t.tran_code);
              isSell = ["sl", "sell", "S"].includes(t.tran_code);
              if (isBuy) {
                posMap[_sid].shares += t.shares_owned || 0;
                posMap[_sid].cost += (t.shares_owned || 0) * (t.executed_price || 0);
              } else if (isSell) {
                posMap[_sid].shares -= t.shares_owned || 0;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          holdingLines = [];
          pfInvested = 0;
          pfCurrent = 0;
          _i = 0, _Object$entries = Object.entries(posMap);
        case 23:
          if (!(_i < _Object$entries.length)) {
            _context2.next = 47;
            break;
          }
          _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), sid = _Object$entries$_i[0], pos = _Object$entries$_i[1];
          if (!(pos.shares <= 0)) {
            _context2.next = 27;
            break;
          }
          return _context2.abrupt("continue", 44);
        case 27:
          _context2.next = 29;
          return _SecurityMaster.securityMaster.findById(pos.symbolId).lean();
        case 29:
          sec = _context2.sent;
          _context2.next = 32;
          return _Pricedata.PriceData.findOne({
            securityMaster_id: pos.symbolId
          }).lean();
        case 32:
          price = _context2.sent;
          name = (sec === null || sec === void 0 ? void 0 : sec.longName) || (sec === null || sec === void 0 ? void 0 : sec.symbol) || sid;
          symbol = (sec === null || sec === void 0 ? void 0 : sec.symbol) || sid;
          avgCost = pos.shares > 0 ? pos.cost / pos.shares : 0;
          currentPrice = (price === null || price === void 0 ? void 0 : price.regularMarketPrice) || 0;
          currentValue = pos.shares * currentPrice;
          invested = pos.cost;
          gainLoss = currentValue - invested;
          gainPct = invested > 0 ? (gainLoss / invested * 100).toFixed(1) : "0.0";
          pfInvested += invested;
          pfCurrent += currentValue;
          holdingLines.push("  - ".concat(symbol, " (").concat(name, "): ").concat(pos.shares, " shares @ avg \u20B9").concat(avgCost.toFixed(2), ", ") + "current \u20B9".concat(currentPrice.toFixed(2), ", value \u20B9").concat(currentValue.toFixed(0), ", ") + "P&L \u20B9".concat(gainLoss.toFixed(0), " (").concat(gainPct, "%)"));
        case 44:
          _i++;
          _context2.next = 23;
          break;
        case 47:
          grandTotalInvested += pfInvested;
          grandTotalCurrent += pfCurrent;
          pfGain = pfCurrent - pfInvested;
          pfGainPct = pfInvested > 0 ? (pfGain / pfInvested * 100).toFixed(1) : "0.0";
          lines.push("Portfolio: \"".concat(pf.name, "\"").concat(pf.notes ? " (".concat(pf.notes, ")") : ""));
          lines.push("  Invested: \u20B9".concat(pfInvested.toFixed(0), ", Current: \u20B9").concat(pfCurrent.toFixed(0), ", P&L: \u20B9").concat(pfGain.toFixed(0), " (").concat(pfGainPct, "%)"));
          if (holdingLines.length) {
            lines.push("  Holdings:");
            lines.push.apply(lines, holdingLines);
          } else {
            lines.push("  No active holdings.");
          }
          lines.push("");
        case 55:
          _context2.next = 11;
          break;
        case 57:
          _context2.next = 62;
          break;
        case 59:
          _context2.prev = 59;
          _context2.t0 = _context2["catch"](9);
          _iterator.e(_context2.t0);
        case 62:
          _context2.prev = 62;
          _iterator.f();
          return _context2.finish(62);
        case 65:
          totalGain = grandTotalCurrent - grandTotalInvested;
          totalGainPct = grandTotalInvested > 0 ? (totalGain / grandTotalInvested * 100).toFixed(1) : "0.0";
          lines.unshift("=== PORTFOLIO SUMMARY ===", "Total Invested: \u20B9".concat(grandTotalInvested.toFixed(0)), "Total Current Value: \u20B9".concat(grandTotalCurrent.toFixed(0)), "Overall P&L: \u20B9".concat(totalGain.toFixed(0), " (").concat(totalGainPct, "%)"), "");
          return _context2.abrupt("return", lines.join("\n"));
        case 69:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[9, 59, 62, 65]]);
  }));
  return _buildPortfolioContext.apply(this, arguments);
}
function analyzePortfolio(_x3) {
  return _analyzePortfolio.apply(this, arguments);
}
/**
 * Save or update Claude API key for a user.
 */
function _analyzePortfolio() {
  _analyzePortfolio = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(_ref) {
    var _response$content$;
    var userId, userMessage, _ref$analysisType, analysisType, _ref$chatHistory, chatHistory, apiKey, client, portfolioContext, systemPrompt, messages, response;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          userId = _ref.userId, userMessage = _ref.userMessage, _ref$analysisType = _ref.analysisType, analysisType = _ref$analysisType === void 0 ? "general" : _ref$analysisType, _ref$chatHistory = _ref.chatHistory, chatHistory = _ref$chatHistory === void 0 ? [] : _ref$chatHistory;
          _context3.next = 3;
          return getUserApiKey(userId);
        case 3:
          apiKey = _context3.sent;
          client = new _sdk["default"]({
            apiKey: apiKey
          });
          _context3.next = 7;
          return buildPortfolioContext(userId);
        case 7:
          portfolioContext = _context3.sent;
          systemPrompt = "You are an expert Indian stock market portfolio analyst and financial advisor.\nYou have deep knowledge of NSE/BSE markets, Indian tax laws (STCG/LTCG), and retail investment strategies.\n\nThe user's current portfolio data:\n".concat(portfolioContext, "\n\nGuidelines:\n- All monetary values are in Indian Rupees (\u20B9) unless stated otherwise\n- Reference specific holdings by name when giving advice\n- For tax questions: STCG applies to equity held < 12 months (15% tax), LTCG > \u20B91L gain taxed at 10%\n- Be concise but thorough. Use bullet points for clarity.\n- If the portfolio is empty, encourage the user to add holdings via the Import feature\n- Analysis type requested: ").concat(analysisType);
          messages = [].concat(_toConsumableArray(chatHistory.map(function (m) {
            return {
              role: m.role,
              content: m.content
            };
          })), [{
            role: "user",
            content: userMessage
          }]);
          _context3.next = 12;
          return client.messages.create({
            model: "claude-opus-4-6",
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages
          });
        case 12:
          response = _context3.sent;
          return _context3.abrupt("return", ((_response$content$ = response.content[0]) === null || _response$content$ === void 0 ? void 0 : _response$content$.text) || "No response from Claude.");
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _analyzePortfolio.apply(this, arguments);
}
function saveApiKey(_x4, _x5) {
  return _saveApiKey.apply(this, arguments);
}
/**
 * Get settings (without exposing the full key — just masked).
 */
function _saveApiKey() {
  _saveApiKey = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(userId, claudeApiKey) {
    var settings;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _UserSettings.UserSettings.findOneAndUpdate({
            userId: userId
          }, {
            $set: {
              claudeApiKey: claudeApiKey,
              aiAnalysisEnabled: !!claudeApiKey
            }
          }, {
            upsert: true,
            "new": true
          }).lean();
        case 2:
          settings = _context4.sent;
          return _context4.abrupt("return", {
            saved: true,
            aiAnalysisEnabled: settings.aiAnalysisEnabled
          });
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _saveApiKey.apply(this, arguments);
}
function getSettings(_x6) {
  return _getSettings.apply(this, arguments);
}
/**
 * Update general settings (currency, etc.) without touching the API key.
 */
function _getSettings() {
  _getSettings = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(userId) {
    var settings, key;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return _UserSettings.UserSettings.findOne({
            userId: userId
          }).lean();
        case 2:
          settings = _context5.sent;
          key = settings === null || settings === void 0 ? void 0 : settings.claudeApiKey;
          return _context5.abrupt("return", {
            hasApiKey: !!key,
            apiKeyMasked: key ? "sk-ant-...".concat(key.slice(-6)) : null,
            aiAnalysisEnabled: (settings === null || settings === void 0 ? void 0 : settings.aiAnalysisEnabled) || false,
            defaultCurrency: (settings === null || settings === void 0 ? void 0 : settings.defaultCurrency) || "INR"
          });
        case 5:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _getSettings.apply(this, arguments);
}
function updateSettings(_x7, _x8) {
  return _updateSettings.apply(this, arguments);
}
function _updateSettings() {
  _updateSettings = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(userId, _ref2) {
    var defaultCurrency, update, settings;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          defaultCurrency = _ref2.defaultCurrency;
          update = {};
          if (defaultCurrency) update.defaultCurrency = defaultCurrency;
          _context6.next = 5;
          return _UserSettings.UserSettings.findOneAndUpdate({
            userId: userId
          }, {
            $set: update
          }, {
            upsert: true,
            "new": true
          }).lean();
        case 5:
          settings = _context6.sent;
          return _context6.abrupt("return", {
            defaultCurrency: settings.defaultCurrency
          });
        case 7:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _updateSettings.apply(this, arguments);
}
//# sourceMappingURL=claudeService.js.map