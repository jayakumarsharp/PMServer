"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseVoiceCommand = parseVoiceCommand;
var _SecurityMaster = require("../model/SecurityMaster");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
// ── Number word mapping ───────────────────────────────────────────────────────
var NUMBER_WORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
  lakh: 100000
};
function wordsToNumber(word) {
  var lower = word.toLowerCase();
  if (!isNaN(parseFloat(lower))) return parseFloat(lower);
  return NUMBER_WORDS[lower] || null;
}

// ── Intent keywords ───────────────────────────────────────────────────────────
var BUY_KEYWORDS = ["buy", "bought", "purchase", "add", "invest", "long"];
var SELL_KEYWORDS = ["sell", "sold", "exit", "remove", "short"];
var PRICE_PREFIXES = ["at", "for", "price", "@", "₹", "rs", "inr", "usd", "$"];

// ── Fuzzy symbol matcher — checks DB for partial name or symbol match ─────────
function resolveSymbol(_x) {
  return _resolveSymbol.apply(this, arguments);
} // ── Main parser ───────────────────────────────────────────────────────────────
function _resolveSymbol() {
  _resolveSymbol = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(rawToken) {
    var upper, sec;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          upper = rawToken.toUpperCase().trim(); // Exact symbol match first
          _context.next = 3;
          return _SecurityMaster.securityMaster.findOne({
            symbol: upper
          }).select("symbol longname").lean();
        case 3:
          sec = _context.sent;
          if (!sec) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", sec);
        case 6:
          _context.next = 8;
          return _SecurityMaster.securityMaster.findOne({
            longname: {
              $regex: new RegExp(rawToken, "i")
            }
          }).select("symbol longname").lean();
        case 8:
          sec = _context.sent;
          if (!sec) {
            _context.next = 11;
            break;
          }
          return _context.abrupt("return", sec);
        case 11:
          _context.next = 13;
          return _SecurityMaster.securityMaster.findOne({
            symbol: {
              $regex: new RegExp("^".concat(upper), "i")
            }
          }).select("symbol longname").lean();
        case 13:
          sec = _context.sent;
          return _context.abrupt("return", sec || null);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _resolveSymbol.apply(this, arguments);
}
function parseVoiceCommand(_x2) {
  return _parseVoiceCommand.apply(this, arguments);
}
function _parseVoiceCommand() {
  _parseVoiceCommand = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(text) {
    var tokens, action, actionIdx, i, quantity, quantityIdx, _i, n, price, _i2, next, STOP_WORDS, symbolCandidates, resolvedSymbol, len, start, candidate, sec, confidence;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          tokens = text.toLowerCase().replace(/[,₹$]/g, " ").split(/\s+/).filter(Boolean); // Detect action
          action = null;
          actionIdx = -1;
          i = 0;
        case 4:
          if (!(i < tokens.length)) {
            _context2.next = 16;
            break;
          }
          if (!BUY_KEYWORDS.includes(tokens[i])) {
            _context2.next = 9;
            break;
          }
          action = "by";
          actionIdx = i;
          return _context2.abrupt("break", 16);
        case 9:
          if (!SELL_KEYWORDS.includes(tokens[i])) {
            _context2.next = 13;
            break;
          }
          action = "sl";
          actionIdx = i;
          return _context2.abrupt("break", 16);
        case 13:
          i++;
          _context2.next = 4;
          break;
        case 16:
          // Extract quantity — first numeric token after action word
          quantity = null;
          quantityIdx = -1;
          _i = Math.max(0, actionIdx);
        case 19:
          if (!(_i < tokens.length)) {
            _context2.next = 28;
            break;
          }
          n = wordsToNumber(tokens[_i]);
          if (!(n !== null)) {
            _context2.next = 25;
            break;
          }
          quantity = n;
          quantityIdx = _i;
          return _context2.abrupt("break", 28);
        case 25:
          _i++;
          _context2.next = 19;
          break;
        case 28:
          // Extract price — numeric token after a price prefix
          price = null;
          _i2 = 0;
        case 30:
          if (!(_i2 < tokens.length)) {
            _context2.next = 39;
            break;
          }
          if (!PRICE_PREFIXES.includes(tokens[_i2])) {
            _context2.next = 36;
            break;
          }
          next = tokens[_i2 + 1];
          if (!(next && !isNaN(parseFloat(next)))) {
            _context2.next = 36;
            break;
          }
          price = parseFloat(next);
          return _context2.abrupt("break", 39);
        case 36:
          _i2++;
          _context2.next = 30;
          break;
        case 39:
          // Extract symbol candidates — tokens that are not action/qty/price/prepositions
          STOP_WORDS = new Set([].concat(BUY_KEYWORDS, SELL_KEYWORDS, PRICE_PREFIXES, ["shares", "units", "of", "in", "the", "a", "stock", "share"]));
          symbolCandidates = tokens.filter(function (t, i) {
            return i !== actionIdx && i !== quantityIdx && !STOP_WORDS.has(t) && isNaN(parseFloat(t));
          }); // Try to resolve symbol from candidates (try longest first, then single tokens)
          resolvedSymbol = null; // Try multi-word company name combinations
          len = symbolCandidates.length;
        case 43:
          if (!(len >= 1)) {
            _context2.next = 61;
            break;
          }
          start = 0;
        case 45:
          if (!(start <= symbolCandidates.length - len)) {
            _context2.next = 56;
            break;
          }
          candidate = symbolCandidates.slice(start, start + len).join(" ");
          _context2.next = 49;
          return resolveSymbol(candidate);
        case 49:
          sec = _context2.sent;
          if (!sec) {
            _context2.next = 53;
            break;
          }
          resolvedSymbol = sec;
          return _context2.abrupt("break", 56);
        case 53:
          start++;
          _context2.next = 45;
          break;
        case 56:
          if (!resolvedSymbol) {
            _context2.next = 58;
            break;
          }
          return _context2.abrupt("break", 61);
        case 58:
          len--;
          _context2.next = 43;
          break;
        case 61:
          confidence = [action !== null, quantity !== null, resolvedSymbol !== null].filter(Boolean).length / 3;
          return _context2.abrupt("return", {
            raw: text,
            action: action,
            quantity: quantity,
            price: price,
            symbol: resolvedSymbol ? resolvedSymbol.symbol : symbolCandidates.join(" ").toUpperCase(),
            symbolResolved: resolvedSymbol !== null,
            symbolName: resolvedSymbol ? resolvedSymbol.longname : null,
            confidence: Math.round(confidence * 100),
            ready: action !== null && quantity !== null && resolvedSymbol !== null,
            warnings: [].concat(_toConsumableArray(action === null ? ["Could not detect buy or sell intent"] : []), _toConsumableArray(quantity === null ? ["Could not detect quantity"] : []), _toConsumableArray(resolvedSymbol === null ? ["Symbol not found for: \"".concat(symbolCandidates.join(" "), "\"")] : []), _toConsumableArray(price === null ? ["Price not detected — will use current market price"] : []))
          });
        case 63:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _parseVoiceCommand.apply(this, arguments);
}
//# sourceMappingURL=voiceService.js.map