"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectBroker = connectBroker;
exports.createBrokerConfig = createBrokerConfig;
exports.deleteBrokerConfig = deleteBrokerConfig;
exports.getAuthUrl = getAuthUrl;
exports.getBrokerConfigById = getBrokerConfigById;
exports.getBrokerConfigsByUser = getBrokerConfigsByUser;
exports.getBrokerStatus = getBrokerStatus;
exports.getSupportedBrokers = getSupportedBrokers;
exports.handleOAuthCallback = handleOAuthCallback;
exports.syncBrokerPositions = syncBrokerPositions;
exports.updateBrokerConfig = updateBrokerConfig;
var _BrokerCredential = _interopRequireDefault(require("../model/BrokerCredential"));
var _Broker = _interopRequireDefault(require("../model/Broker"));
var _UpstoxAdapter = require("./brokers/UpstoxAdapter");
var _FyersAdapter = require("./brokers/FyersAdapter");
var _portfoliotransactions = require("../model/portfoliotransactions");
var _SecurityMaster = require("../model/SecurityMaster");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var ADAPTERS = {
  upstox: _UpstoxAdapter.UpstoxAdapter,
  fyers: _FyersAdapter.FyersAdapter
};
function getAdapter(cred) {
  var AdapterClass = ADAPTERS[cred.broker];
  if (!AdapterClass) throw new Error("Unsupported broker: ".concat(cred.broker));
  return new AdapterClass({
    apiKey: cred.apiKey,
    apiSecret: cred.apiSecret,
    accessToken: cred.accessToken,
    redirectUri: process.env.BROKER_REDIRECT_BASE ? "".concat(process.env.BROKER_REDIRECT_BASE, "/api/broker/callback/").concat(cred.broker) : "http://localhost:3003/api/broker/callback/".concat(cred.broker)
  });
}
function getSupportedBrokers() {
  return _getSupportedBrokers.apply(this, arguments);
}
function _getSupportedBrokers() {
  _getSupportedBrokers = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", Object.keys(ADAPTERS).map(function (key) {
            return {
              key: key,
              name: new ADAPTERS[key]({}).name
            };
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getSupportedBrokers.apply(this, arguments);
}
function getAuthUrl(_x, _x2) {
  return _getAuthUrl.apply(this, arguments);
}
function _getAuthUrl() {
  _getAuthUrl = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(broker, userId) {
    var cred, adapter;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _BrokerCredential["default"].findOne({
            userId: userId,
            broker: broker
          }).lean();
        case 2:
          cred = _context2.sent;
          if (cred !== null && cred !== void 0 && cred.apiKey) {
            _context2.next = 5;
            break;
          }
          throw new Error("Connect your broker API key first via POST /api/broker/connect");
        case 5:
          adapter = getAdapter(cred);
          return _context2.abrupt("return", adapter.getAuthUrl());
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getAuthUrl.apply(this, arguments);
}
function connectBroker(_x3) {
  return _connectBroker.apply(this, arguments);
}
function _connectBroker() {
  _connectBroker = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(_ref) {
    var userId, broker, apiKey, apiSecret;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          userId = _ref.userId, broker = _ref.broker, apiKey = _ref.apiKey, apiSecret = _ref.apiSecret;
          return _context3.abrupt("return", _BrokerCredential["default"].findOneAndUpdate({
            userId: userId,
            broker: broker
          }, {
            apiKey: apiKey,
            apiSecret: apiSecret,
            isActive: true,
            syncStatus: "idle"
          }, {
            upsert: true,
            "new": true
          }));
        case 2:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _connectBroker.apply(this, arguments);
}
function handleOAuthCallback(_x4) {
  return _handleOAuthCallback.apply(this, arguments);
}
function _handleOAuthCallback() {
  _handleOAuthCallback = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(_ref2) {
    var broker, code, userId, cred, adapter, _yield$adapter$exchan, accessToken, refreshToken, expiry;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          broker = _ref2.broker, code = _ref2.code, userId = _ref2.userId;
          _context4.next = 3;
          return _BrokerCredential["default"].findOne({
            userId: userId,
            broker: broker
          });
        case 3:
          cred = _context4.sent;
          if (cred) {
            _context4.next = 6;
            break;
          }
          throw new Error("Broker not connected");
        case 6:
          adapter = getAdapter(cred);
          _context4.next = 9;
          return adapter.exchangeCode(code);
        case 9:
          _yield$adapter$exchan = _context4.sent;
          accessToken = _yield$adapter$exchan.accessToken;
          refreshToken = _yield$adapter$exchan.refreshToken;
          expiry = _yield$adapter$exchan.expiry;
          cred.accessToken = accessToken;
          if (refreshToken) cred.refreshToken = refreshToken;
          if (expiry) cred.tokenExpiry = expiry;
          _context4.next = 18;
          return cred.save();
        case 18:
          return _context4.abrupt("return", {
            connected: true
          });
        case 19:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _handleOAuthCallback.apply(this, arguments);
}
function syncBrokerPositions(_x5) {
  return _syncBrokerPositions.apply(this, arguments);
}
function _syncBrokerPositions() {
  _syncBrokerPositions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(_ref3) {
    var userId, broker, portfolioId, cred, adapter, positions, imported, _iterator, _step, pos, sec;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          userId = _ref3.userId, broker = _ref3.broker, portfolioId = _ref3.portfolioId;
          _context5.next = 3;
          return _BrokerCredential["default"].findOne({
            userId: userId,
            broker: broker,
            isActive: true
          });
        case 3:
          cred = _context5.sent;
          if (cred !== null && cred !== void 0 && cred.accessToken) {
            _context5.next = 6;
            break;
          }
          throw new Error("Broker not authorised — complete OAuth first");
        case 6:
          cred.syncStatus = "syncing";
          _context5.next = 9;
          return cred.save();
        case 9:
          _context5.prev = 9;
          adapter = getAdapter(cred);
          _context5.next = 13;
          return adapter.getPositions();
        case 13:
          positions = _context5.sent;
          imported = 0;
          _iterator = _createForOfIteratorHelper(positions);
          _context5.prev = 16;
          _iterator.s();
        case 18:
          if ((_step = _iterator.n()).done) {
            _context5.next = 33;
            break;
          }
          pos = _step.value;
          _context5.next = 22;
          return _SecurityMaster.securityMaster.findOne({
            $or: [{
              symbol: pos.symbol
            }, {
              symbol: pos.tradingSymbol
            }]
          }).lean();
        case 22:
          sec = _context5.sent;
          if (!(!sec && pos.tradingSymbol)) {
            _context5.next = 27;
            break;
          }
          _context5.next = 26;
          return _SecurityMaster.securityMaster.create({
            symbol: pos.tradingSymbol,
            shortname: pos.tradingSymbol,
            exchange: pos.exchange || "NSE"
          });
        case 26:
          sec = _context5.sent;
        case 27:
          if (!(sec && pos.shares_owned > 0)) {
            _context5.next = 31;
            break;
          }
          _context5.next = 30;
          return _portfoliotransactions.PortfolioTransactions.findOneAndUpdate({
            symbol: sec._id,
            portfolio_id: portfolioId,
            tran_code: "by"
          }, {
            symbol: sec._id,
            shares_owned: pos.shares_owned,
            executed_price: pos.avg_price,
            cost_basis: pos.shares_owned * pos.avg_price,
            tran_code: "by",
            portfolio_id: portfolioId,
            createdBy: "sync:".concat(broker)
          }, {
            upsert: true
          });
        case 30:
          imported++;
        case 31:
          _context5.next = 18;
          break;
        case 33:
          _context5.next = 38;
          break;
        case 35:
          _context5.prev = 35;
          _context5.t0 = _context5["catch"](16);
          _iterator.e(_context5.t0);
        case 38:
          _context5.prev = 38;
          _iterator.f();
          return _context5.finish(38);
        case 41:
          cred.syncStatus = "success";
          cred.lastSyncedAt = new Date();
          cred.syncError = null;
          _context5.next = 46;
          return cred.save();
        case 46:
          return _context5.abrupt("return", {
            imported: imported,
            positions: positions.length
          });
        case 49:
          _context5.prev = 49;
          _context5.t1 = _context5["catch"](9);
          cred.syncStatus = "error";
          cred.syncError = _context5.t1.message;
          _context5.next = 55;
          return cred.save();
        case 55:
          throw _context5.t1;
        case 56:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[9, 49], [16, 35, 38, 41]]);
  }));
  return _syncBrokerPositions.apply(this, arguments);
}
function getBrokerStatus(_x6) {
  return _getBrokerStatus.apply(this, arguments);
} // ── Broker fee config (VIO Bank, etc.) ────────────────────────────────────────
function _getBrokerStatus() {
  _getBrokerStatus = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(userId) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", _BrokerCredential["default"].find({
            userId: userId
          }).select("-apiSecret -accessToken -refreshToken").lean());
        case 1:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _getBrokerStatus.apply(this, arguments);
}
function createBrokerConfig(_x7) {
  return _createBrokerConfig.apply(this, arguments);
}
function _createBrokerConfig() {
  _createBrokerConfig = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(_ref4) {
    var user_id, name, buy_commission, sell_commission, default_currency, notes;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          user_id = _ref4.user_id, name = _ref4.name, buy_commission = _ref4.buy_commission, sell_commission = _ref4.sell_commission, default_currency = _ref4.default_currency, notes = _ref4.notes;
          return _context7.abrupt("return", _Broker["default"].create({
            user_id: user_id,
            name: name,
            buy_commission: buy_commission,
            sell_commission: sell_commission,
            default_currency: default_currency,
            notes: notes
          }));
        case 2:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _createBrokerConfig.apply(this, arguments);
}
function getBrokerConfigsByUser(_x8) {
  return _getBrokerConfigsByUser.apply(this, arguments);
}
function _getBrokerConfigsByUser() {
  _getBrokerConfigsByUser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(user_id) {
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          return _context8.abrupt("return", _Broker["default"].find({
            user_id: user_id
          }).lean());
        case 1:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _getBrokerConfigsByUser.apply(this, arguments);
}
function getBrokerConfigById(_x9) {
  return _getBrokerConfigById.apply(this, arguments);
}
function _getBrokerConfigById() {
  _getBrokerConfigById = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(id) {
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          return _context9.abrupt("return", _Broker["default"].findById(id).lean());
        case 1:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _getBrokerConfigById.apply(this, arguments);
}
function updateBrokerConfig(_x10, _x11) {
  return _updateBrokerConfig.apply(this, arguments);
}
function _updateBrokerConfig() {
  _updateBrokerConfig = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(id, data) {
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          return _context10.abrupt("return", _Broker["default"].findByIdAndUpdate(id, data, {
            "new": true,
            runValidators: true
          }).lean());
        case 1:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _updateBrokerConfig.apply(this, arguments);
}
function deleteBrokerConfig(_x12) {
  return _deleteBrokerConfig.apply(this, arguments);
}
function _deleteBrokerConfig() {
  _deleteBrokerConfig = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(id) {
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          return _context11.abrupt("return", _Broker["default"].findByIdAndDelete(id).lean());
        case 1:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _deleteBrokerConfig.apply(this, arguments);
}
//# sourceMappingURL=brokerService.js.map