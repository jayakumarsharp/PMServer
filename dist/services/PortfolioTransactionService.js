"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHolding = createHolding;
exports.getDCASummary = getDCASummary;
exports.getHoldingbypfandsecurity = getHoldingbypfandsecurity;
exports.getProfitSignals = getProfitSignals;
var _portfoliotransactions = require("../model/portfoliotransactions");
var _SecurityMaster = require("../model/SecurityMaster");
var _Broker = _interopRequireDefault(require("../model/Broker"));
var _Pricedata = require("../model/Pricedata");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function createHolding(_x) {
  return _createHolding.apply(this, arguments);
}
function _createHolding() {
  _createHolding = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(Obj) {
    var securitydata, symbol, shares_owned, cost_basis, tran_code, executed_price, target_percentage, goal, portfolio_id, broker_id, createdBy, commission, currency, broker, newHolding;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _SecurityMaster.getbySymbol)(Obj.symbol);
        case 2:
          securitydata = _context.sent;
          symbol = securitydata._id;
          shares_owned = Obj.shares_owned, cost_basis = Obj.cost_basis, tran_code = Obj.tran_code, executed_price = Obj.executed_price, target_percentage = Obj.target_percentage, goal = Obj.goal, portfolio_id = Obj.portfolio_id, broker_id = Obj.broker_id, createdBy = Obj.createdBy;
          commission = 0;
          currency = "INR";
          if (!broker_id) {
            _context.next = 12;
            break;
          }
          _context.next = 10;
          return _Broker["default"].findById(broker_id).lean();
        case 10:
          broker = _context.sent;
          if (broker) {
            commission = tran_code === "sl" ? broker.sell_commission : broker.buy_commission;
            currency = broker.default_currency;
          }
        case 12:
          _context.next = 14;
          return _portfoliotransactions.PortfolioTransactions.create({
            symbol: symbol,
            shares_owned: shares_owned,
            cost_basis: cost_basis,
            tran_code: tran_code,
            executed_price: executed_price,
            target_percentage: target_percentage,
            goal: goal,
            portfolio_id: portfolio_id,
            broker_id: broker_id || undefined,
            commission: commission,
            currency: currency,
            createdBy: createdBy
          });
        case 14:
          newHolding = _context.sent;
          return _context.abrupt("return", newHolding);
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _createHolding.apply(this, arguments);
}
function getHoldingbypfandsecurity(_x2) {
  return _getHoldingbypfandsecurity.apply(this, arguments);
} // DCA summary for a security inside a portfolio.
// Shows average cost basis (incl. commissions), break-even price, current P&L.
function _getHoldingbypfandsecurity() {
  _getHoldingbypfandsecurity = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(obj) {
    var transactions;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _portfoliotransactions.PortfolioTransactions.find({
            portfolio_id: obj.portfolioid,
            symbol: obj.secid,
            tran_code: {
              $in: ["by", "sl"]
            }
          });
        case 2:
          transactions = _context2.sent;
          return _context2.abrupt("return", transactions);
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getHoldingbypfandsecurity.apply(this, arguments);
}
function getDCASummary(_x3, _x4) {
  return _getDCASummary.apply(this, arguments);
} // Returns all holdings in a portfolio that have hit their profit target.
function _getDCASummary() {
  _getDCASummary = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(portfolioId, securityId) {
    var transactions, total_shares, total_invested, total_commissions, lots, _iterator, _step, t, lot_value, average_cost, break_even_price, priceData, current_price, current_value, gross_pnl, net_pnl, net_pnl_percent;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _portfoliotransactions.PortfolioTransactions.find({
            portfolio_id: portfolioId,
            symbol: securityId,
            tran_code: {
              $in: ["by", "sl"]
            }
          }).lean();
        case 2:
          transactions = _context3.sent;
          total_shares = 0;
          total_invested = 0;
          total_commissions = 0;
          lots = [];
          _iterator = _createForOfIteratorHelper(transactions);
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              t = _step.value;
              lot_value = t.shares_owned * t.executed_price;
              total_commissions += t.commission || 0;
              if (t.tran_code === "by") {
                total_shares += t.shares_owned;
                total_invested += lot_value;
                lots.push({
                  date: t.createdAt,
                  shares: t.shares_owned,
                  price: t.executed_price,
                  commission: t.commission || 0,
                  currency: t.currency || "INR"
                });
              } else {
                total_shares -= t.shares_owned;
                total_invested -= lot_value;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          average_cost = total_shares > 0 ? total_invested / total_shares : 0; // Break-even = average cost + total commissions spread across remaining shares
          break_even_price = total_shares > 0 ? (total_invested + total_commissions) / total_shares : 0;
          _context3.next = 13;
          return _Pricedata.PriceData.findOne({
            securityMaster_id: securityId
          }).select("regularMarketPrice financialCurrency").lean();
        case 13:
          priceData = _context3.sent;
          current_price = priceData ? priceData.regularMarketPrice : 0;
          current_value = total_shares * current_price;
          gross_pnl = current_value - total_invested;
          net_pnl = gross_pnl - total_commissions;
          net_pnl_percent = total_invested > 0 ? net_pnl / total_invested * 100 : 0;
          return _context3.abrupt("return", {
            total_shares: total_shares,
            total_invested: total_invested,
            total_commissions: total_commissions,
            average_cost: average_cost,
            break_even_price: break_even_price,
            current_price: current_price,
            current_value: current_value,
            gross_pnl: gross_pnl,
            net_pnl: net_pnl,
            net_pnl_percent: net_pnl_percent,
            lots: lots,
            buy_count: lots.length
          });
        case 20:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _getDCASummary.apply(this, arguments);
}
function getProfitSignals(_x5) {
  return _getProfitSignals.apply(this, arguments);
}
function _getProfitSignals() {
  _getProfitSignals = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(portfolioId) {
    var transactions, holdings, _iterator2, _step2, t, secId, _h, val, signals, _i, _Object$values, h, priceData, current_price, current_value, net_pnl, net_pnl_percent;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _portfoliotransactions.PortfolioTransactions.find({
            portfolio_id: portfolioId,
            tran_code: {
              $in: ["by", "sl"]
            }
          }).populate("symbol").lean();
        case 2:
          transactions = _context4.sent;
          // Aggregate net position per security
          holdings = {};
          _iterator2 = _createForOfIteratorHelper(transactions);
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              t = _step2.value;
              secId = String(t.symbol._id);
              if (!holdings[secId]) {
                holdings[secId] = {
                  secid: t.symbol._id,
                  symbol: t.symbol.symbol,
                  total_shares: 0,
                  total_invested: 0,
                  total_commissions: 0,
                  profit_target: null
                };
              }
              _h = holdings[secId];
              val = t.shares_owned * t.executed_price;
              _h.total_commissions += t.commission || 0;
              if (t.tran_code === "by") {
                _h.total_shares += t.shares_owned;
                _h.total_invested += val;
                // Use the highest profit_target set across buy transactions
                if (t.target_percentage != null) {
                  _h.profit_target = _h.profit_target == null ? t.target_percentage : Math.max(_h.profit_target, t.target_percentage);
                }
              } else {
                _h.total_shares -= t.shares_owned;
                _h.total_invested -= val;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          signals = [];
          _i = 0, _Object$values = Object.values(holdings);
        case 8:
          if (!(_i < _Object$values.length)) {
            _context4.next = 23;
            break;
          }
          h = _Object$values[_i];
          if (!(h.total_shares <= 0 || h.profit_target == null)) {
            _context4.next = 12;
            break;
          }
          return _context4.abrupt("continue", 20);
        case 12:
          _context4.next = 14;
          return _Pricedata.PriceData.findOne({
            securityMaster_id: h.secid
          }).select("regularMarketPrice").lean();
        case 14:
          priceData = _context4.sent;
          current_price = priceData ? priceData.regularMarketPrice : 0;
          current_value = h.total_shares * current_price;
          net_pnl = current_value - h.total_invested - h.total_commissions;
          net_pnl_percent = h.total_invested > 0 ? net_pnl / h.total_invested * 100 : 0;
          if (net_pnl_percent >= h.profit_target) {
            signals.push({
              symbol: h.symbol,
              secid: h.secid,
              total_shares: h.total_shares,
              total_invested: h.total_invested,
              total_commissions: h.total_commissions,
              current_price: current_price,
              current_value: current_value,
              net_pnl: net_pnl,
              net_pnl_percent: +net_pnl_percent.toFixed(2),
              profit_target: h.profit_target,
              signal: "SELL",
              message: "".concat(h.symbol, " has reached ").concat(net_pnl_percent.toFixed(2), "% net return (target: ").concat(h.profit_target, "%). Consider selling.")
            });
          }
        case 20:
          _i++;
          _context4.next = 8;
          break;
        case 23:
          return _context4.abrupt("return", signals);
        case 24:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _getProfitSignals.apply(this, arguments);
}
//# sourceMappingURL=PortfolioTransactionService.js.map