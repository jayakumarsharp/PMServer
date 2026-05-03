"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToWatchlist = addToWatchlist;
exports.authenticate = authenticate;
exports.getComplete = getComplete;
exports.getUserPortfolioIds = getUserPortfolioIds;
exports.getbyUserId = getbyUserId;
exports.getbyUsername = getbyUsername;
exports.register = register;
exports.removeFromWatchlist = removeFromWatchlist;
var _portfolio = require("../model/portfolio");
var _user = require("../model/user");
var _portfoliotransactions = require("../model/portfoliotransactions");
var _Pricedata = require("../model/Pricedata");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var bcrypt = require("bcrypt");
var _require = require("../expressError"),
  NotFoundError = _require.NotFoundError,
  BadRequestError = _require.BadRequestError,
  UnauthorizedError = _require.UnauthorizedError;
function register(_x) {
  return _register.apply(this, arguments);
}
function _register() {
  _register = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(Obj) {
    var duplicateUser, hashedPassword, result;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log("Register function called with:", Obj.username, Obj.password, Obj.email);
          _context.next = 3;
          return _user.User.findOne({
            username: Obj.username
          });
        case 3:
          duplicateUser = _context.sent;
          console.log("Duplicate user:", duplicateUser);
          if (!duplicateUser) {
            _context.next = 7;
            break;
          }
          throw new BadRequestError("Duplicate Username: ".concat(Obj.username));
        case 7:
          _context.next = 9;
          return bcrypt.hash(Obj.password, 10);
        case 9:
          hashedPassword = _context.sent;
          console.log("Hashed password:", hashedPassword);
          _context.next = 13;
          return _user.User.create({
            username: Obj.username,
            password: hashedPassword,
            email: Obj.email
          });
        case 13:
          result = _context.sent;
          console.log("Inserted user result:", result);
          return _context.abrupt("return", {
            username: result.username,
            email: result.email,
            _id: result._id
          });
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _register.apply(this, arguments);
}
function authenticate(_x2, _x3) {
  return _authenticate.apply(this, arguments);
} // Define the get function to fetch user data including watchlist
function _authenticate() {
  _authenticate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(username, password) {
    var result, isValid;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          // try to find the user first
          console.log(username);
          _context2.next = 3;
          return _user.User.findOne({
            username: username
          });
        case 3:
          result = _context2.sent;
          if (!result) {
            _context2.next = 11;
            break;
          }
          _context2.next = 7;
          return bcrypt.compare(password, result.password);
        case 7:
          isValid = _context2.sent;
          if (!(isValid === true)) {
            _context2.next = 11;
            break;
          }
          delete result.password;
          return _context2.abrupt("return", result);
        case 11:
          throw new UnauthorizedError("Invalid username/password");
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _authenticate.apply(this, arguments);
}
function getbyUserId(_x4) {
  return _getbyUserId.apply(this, arguments);
} // Define the get function to fetch user data including watchlist
function _getbyUserId() {
  _getbyUserId = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(user_id) {
    var user;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log(user_id);
          _context3.next = 4;
          return _user.User.findOne({
            _id: user_id
          });
        case 4:
          user = _context3.sent;
          if (user) {
            _context3.next = 7;
            break;
          }
          throw new NotFoundError("No user: ".concat(user_id));
        case 7:
          return _context3.abrupt("return", user);
        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          throw new Error("Error while fetching user: ".concat(_context3.t0.message));
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return _getbyUserId.apply(this, arguments);
}
function getbyUsername(_x5) {
  return _getbyUsername.apply(this, arguments);
} // Define the getComplete function to fetch user data including watchlist and portfolios
function _getbyUsername() {
  _getbyUsername = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(username) {
    var user;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _user.User.findOne({
            username: username
          }).select("username,email,watchlist").lean();
        case 3:
          user = _context4.sent;
          if (user) {
            _context4.next = 6;
            break;
          }
          throw new NotFoundError("No user: ".concat(username));
        case 6:
          return _context4.abrupt("return", user);
        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          throw new Error("Error while fetching user: ".concat(_context4.t0.message));
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 9]]);
  }));
  return _getbyUsername.apply(this, arguments);
}
function getComplete(_x6) {
  return _getComplete.apply(this, arguments);
}
function _getComplete() {
  _getComplete = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(username) {
    var userWithPortfoliosAndHoldings;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return getUserWithPortfoliosAndHoldings(username);
        case 3:
          userWithPortfoliosAndHoldings = _context5.sent;
          return _context5.abrupt("return", userWithPortfoliosAndHoldings);
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          throw new Error("Error while fetching complete user data: ".concat(_context5.t0.message));
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return _getComplete.apply(this, arguments);
}
function getUserWithPortfoliosAndHoldings(_x7) {
  return _getUserWithPortfoliosAndHoldings.apply(this, arguments);
}
function _getUserWithPortfoliosAndHoldings() {
  _getUserWithPortfoliosAndHoldings = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(username) {
    var user, userid, portfolios;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return _user.User.findOne({
            username: username
          }).select("username email watchlist").lean();
        case 3:
          user = _context8.sent;
          if (user) {
            _context8.next = 6;
            break;
          }
          throw new Error("User not found");
        case 6:
          userid = user._id; // Retrieve the portfolios
          _context8.next = 9;
          return _portfolio.Portfolio.find({
            user_id: userid
          }).lean();
        case 9:
          portfolios = _context8.sent;
          _context8.next = 12;
          return Promise.all(portfolios.map( /*#__PURE__*/function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(portfolio) {
              var transactions, holdings, holdingsArray;
              return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.prev = 0;
                    _context7.next = 3;
                    return _portfoliotransactions.PortfolioTransactions.find({
                      portfolio_id: portfolio._id,
                      tran_code: {
                        $in: ["by", "sl"]
                      }
                    }).populate("symbol");
                  case 3:
                    transactions = _context7.sent;
                    // Populate the 'symbol' field from SecurityMaster
                    holdings = {};
                    transactions.forEach(function (transaction) {
                      var securitySymbol = transaction.symbol.symbol;
                      var holdingValue = transaction.shares_owned * transaction.executed_price;
                      if (!holdings[securitySymbol]) {
                        holdings[securitySymbol] = {
                          shares_owned: 0,
                          value: 0,
                          total_commissions: 0,
                          secid: transaction.symbol._id,
                          currency: transaction.currency || "INR"
                        };
                      }
                      holdings[securitySymbol].total_commissions += transaction.commission || 0;
                      if (transaction.tran_code === "by") {
                        holdings[securitySymbol].shares_owned += transaction.shares_owned;
                        holdings[securitySymbol].value += holdingValue;
                      } else if (transaction.tran_code === "sl") {
                        holdings[securitySymbol].shares_owned -= transaction.shares_owned;
                        holdings[securitySymbol].value -= holdingValue;
                      }
                    });
                    _context7.next = 8;
                    return Promise.all(Object.entries(holdings).map( /*#__PURE__*/function () {
                      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(_ref2) {
                        var _ref4, securitySymbol, _ref4$, shares_owned, value, total_commissions, secid, currency, priceData, regularMarketPrice, totalInvested, todayValue, grossPnl, netPnl, gainLossPercent, netGainLossPercent, averageBuyPrice, breakEvenPrice;
                        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                          while (1) switch (_context6.prev = _context6.next) {
                            case 0:
                              _ref4 = _slicedToArray(_ref2, 2), securitySymbol = _ref4[0], _ref4$ = _ref4[1], shares_owned = _ref4$.shares_owned, value = _ref4$.value, total_commissions = _ref4$.total_commissions, secid = _ref4$.secid, currency = _ref4$.currency;
                              _context6.next = 3;
                              return _Pricedata.PriceData.findOne({
                                securityMaster_id: secid
                              }).select("regularMarketPrice");
                            case 3:
                              priceData = _context6.sent;
                              regularMarketPrice = priceData ? priceData.regularMarketPrice : 0;
                              totalInvested = value;
                              todayValue = shares_owned * regularMarketPrice;
                              grossPnl = todayValue - totalInvested;
                              netPnl = grossPnl - total_commissions;
                              gainLossPercent = totalInvested !== 0 ? grossPnl / totalInvested * 100 : 0;
                              netGainLossPercent = totalInvested !== 0 ? netPnl / totalInvested * 100 : 0;
                              averageBuyPrice = shares_owned !== 0 ? totalInvested / shares_owned : 0;
                              breakEvenPrice = shares_owned !== 0 ? (totalInvested + total_commissions) / shares_owned : 0;
                              return _context6.abrupt("return", {
                                portfolioid: portfolio._id,
                                secid: secid,
                                symbol: securitySymbol,
                                quantity: shares_owned,
                                executed_price: value,
                                regular_market_price: regularMarketPrice,
                                total_invested: totalInvested,
                                today_value: todayValue,
                                total_commissions: total_commissions,
                                gross_pnl: +grossPnl.toFixed(4),
                                net_pnl: +netPnl.toFixed(4),
                                gain_loss_percent: +gainLossPercent.toFixed(2),
                                net_gain_loss_percent: +netGainLossPercent.toFixed(2),
                                average_buy_price: averageBuyPrice,
                                break_even_price: +breakEvenPrice.toFixed(4),
                                currency: currency
                              });
                            case 14:
                            case "end":
                              return _context6.stop();
                          }
                        }, _callee6);
                      }));
                      return function (_x12) {
                        return _ref3.apply(this, arguments);
                      };
                    }()));
                  case 8:
                    holdingsArray = _context7.sent;
                    portfolio.holdings = holdingsArray;
                    _context7.next = 16;
                    break;
                  case 12:
                    _context7.prev = 12;
                    _context7.t0 = _context7["catch"](0);
                    console.error("Error fetching holdings for portfolio ".concat(portfolio._id, ":"), _context7.t0);
                    throw _context7.t0;
                  case 16:
                  case "end":
                    return _context7.stop();
                }
              }, _callee7, null, [[0, 12]]);
            }));
            return function (_x11) {
              return _ref.apply(this, arguments);
            };
          }()));
        case 12:
          user.portfolios = portfolios;
          return _context8.abrupt("return", user);
        case 16:
          _context8.prev = 16;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          throw _context8.t0;
        case 20:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 16]]);
  }));
  return _getUserWithPortfoliosAndHoldings.apply(this, arguments);
}
function getUserPortfolioIds(_x8) {
  return _getUserPortfolioIds.apply(this, arguments);
} //Add stock to watchlist: update db, returns undefined.
function _getUserPortfolioIds() {
  _getUserPortfolioIds = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(username) {
    var portfolios, portfolioIds;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return _portfolio.Portfolio.find({
            username: username
          }).select("_id");
        case 2:
          portfolios = _context9.sent;
          // Extract the IDs from the portfolios and return them as an array
          portfolioIds = portfolios.map(function (portfolio) {
            return portfolio._id;
          });
          return _context9.abrupt("return", portfolioIds);
        case 5:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _getUserPortfolioIds.apply(this, arguments);
}
function addToWatchlist(_x9) {
  return _addToWatchlist.apply(this, arguments);
} // Remove stock from watchlist: update db, returns undefined.
function _addToWatchlist() {
  _addToWatchlist = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(Obj) {
    var user, duplicateCheck, result;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          console.log("Register function called with:", Obj.username, Obj.symbol);
          _context10.next = 3;
          return _user.User.findOne({
            username: Obj.username
          });
        case 3:
          user = _context10.sent;
          if (user) {
            _context10.next = 6;
            break;
          }
          throw new NotFoundError("No username: ".concat(Obj.username));
        case 6:
          console.log("User is found:", Obj.username, Obj.symbol);
          //This line queries the MongoDB collection users to find a document where the username matches the provided
          //username and where within the watchlist array there is an object with a symbol property matching the provided symbol.
          // const duplicateCheck = await User.findOne({
          //   username: Obj.username,
          //   "watchlist.symbol": symbol,
          // });
          _context10.next = 9;
          return _user.User.findOne({
            username: Obj.username,
            watchlist: {
              $in: [Obj.symbol]
            }
          });
        case 9:
          duplicateCheck = _context10.sent;
          if (!duplicateCheck) {
            _context10.next = 12;
            break;
          }
          throw new BadRequestError("Symbol ".concat(Obj.symbol, " already watched by user ").concat(Obj.username));
        case 12:
          _context10.next = 14;
          return _user.User.updateOne({
            username: Obj.username
          }, {
            $push: {
              watchlist: Obj.symbol
            }
          });
        case 14:
          result = _context10.sent;
          return _context10.abrupt("return", {
            watchlist: Obj.symbol
          });
        case 16:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _addToWatchlist.apply(this, arguments);
}
function removeFromWatchlist(_x10) {
  return _removeFromWatchlist.apply(this, arguments);
}
function _removeFromWatchlist() {
  _removeFromWatchlist = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(Obj) {
    var user, symbolExists, result;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          console.log("Remove function called with:", Obj.username, Obj.symbol);
          _context11.next = 3;
          return _user.User.findOne({
            username: Obj.username
          });
        case 3:
          user = _context11.sent;
          if (user) {
            _context11.next = 6;
            break;
          }
          throw new NotFoundError("No username: ".concat(Obj.username));
        case 6:
          console.log("User is found:", Obj.username, Obj.symbol);
          _context11.next = 9;
          return _user.User.findOne({
            username: Obj.username,
            watchlist: {
              $in: [Obj.symbol]
            }
          });
        case 9:
          symbolExists = _context11.sent;
          if (symbolExists) {
            _context11.next = 12;
            break;
          }
          throw new BadRequestError("Symbol ".concat(Obj.symbol, " not found in watchlist of user ").concat(Obj.username));
        case 12:
          _context11.next = 14;
          return _user.User.updateOne({
            username: Obj.username
          }, {
            $pull: {
              watchlist: Obj.symbol
            }
          });
        case 14:
          result = _context11.sent;
          return _context11.abrupt("return", {
            watchlist: Obj.symbol
          });
        case 16:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _removeFromWatchlist.apply(this, arguments);
}
//# sourceMappingURL=userService.js.map