"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));
var _socket = _interopRequireDefault(require("socket.io"));
var _http = _interopRequireDefault(require("http"));
var _os = _interopRequireDefault(require("os"));
var _path = _interopRequireDefault(require("path"));
var _DBconnection = require("./DBconnection");
var _config = require("./config");
var _auth = require("./middleware/auth");
var _CurrencyRouter = _interopRequireDefault(require("./routes/CurrencyRouter"));
var _securityRouter = _interopRequireDefault(require("./routes/securityRouter"));
var _priceRouter = _interopRequireDefault(require("./routes/priceRouter"));
var _fileUploadRouter = _interopRequireDefault(require("./routes/fileUploadRouter"));
var _users = _interopRequireDefault(require("./routes/users"));
var _portfolio = _interopRequireDefault(require("./routes/portfolio"));
var _Account = _interopRequireDefault(require("./routes/Account"));
var _exchangeRateRoutes = _interopRequireDefault(require("./routes/exchangeRateRoutes"));
var _portfoliotransactionsRouter = _interopRequireDefault(require("./routes/portfoliotransactionsRouter"));
var _heatMapRouter = _interopRequireDefault(require("./routes/heatMapRouter"));
var _importRouter = _interopRequireDefault(require("./routes/importRouter"));
var _voiceRouter = _interopRequireDefault(require("./routes/voiceRouter"));
var _brokerRouter = _interopRequireDefault(require("./routes/brokerRouter"));
var _claudeRouter = _interopRequireDefault(require("./routes/claudeRouter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var IS_VERCEL = !!process.env.VERCEL;
var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
if (!IS_VERCEL) (0, _socket["default"])(server); // Socket.IO only in local/Railway (needs persistent server)

// Trust Railway/Render/Vercel reverse proxy — required for rate limiting by real IP
app.set("trust proxy", 1);

// Security headers
app.use((0, _helmet["default"])({
  crossOriginResourcePolicy: {
    policy: "cross-origin"
  }
}));

// CORS — allow all in dev; lock down in production via env
var allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map(function (o) {
  return o.trim();
}) : ["http://localhost:3000", "http://localhost:3003"];
console.log("CORS allowedOrigins:", allowedOrigins);
function reflectCors(req, res) {
  var origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
}
app.use((0, _cors["default"])({
  origin: function origin(_origin, cb) {
    // Never pass Error into cors — it skips CORS headers and hits the JSON error handler,
    // which browsers report as a CORS failure.
    if (!_origin || allowedOrigins.includes(_origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true
}));

// Rate limiting — 100 requests per 15 min per IP globally
var globalLimiter = (0, _expressRateLimit["default"])({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later."
  },
  skip: function skip(req) {
    return req.method === "OPTIONS";
  },
  handler: function handler(req, res, _next, options) {
    reflectCors(req, res);
    res.status(options.statusCode).json(options.message);
  }
});
app.use(globalLimiter);

// Stricter limiter for auth endpoints
var authLimiter = (0, _expressRateLimit["default"])({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many login attempts, please try again later."
  },
  skip: function skip(req) {
    return req.method === "OPTIONS";
  },
  handler: function handler(req, res, _next, options) {
    reflectCors(req, res);
    res.status(options.statusCode).json(options.message);
  }
});
app.use(_bodyParser["default"].json({
  limit: "10mb"
}));
app.use(_express["default"].json({
  limit: "10mb"
}));

// Health check — no auth required
app.get("/health", function (_req, res) {
  return res.json({
    status: "ok",
    ts: new Date().toISOString()
  });
});

// Apply JWT to all routes except public ones
app.all("*", function (req, res, next) {
  var publicRoutes = ["/api/users/token", "/api/users/register", "/health"];
  if (!publicRoutes.includes(req.originalUrl.split("?")[0])) {
    (0, _auth.authenticateJWT)(req, res, next);
  } else {
    next();
  }
});

// Connect to MongoDB
(0, _DBconnection.connectDB)();

// Define routes that need authentication

// Auth — stricter rate limit
app.use("/api/users/token", authLimiter);
app.use("/api/users/register", authLimiter);

// Routes
app.use("/api/security", _securityRouter["default"]);
app.use("/api/currency", _CurrencyRouter["default"]);
app.use("/api/price", _priceRouter["default"]);
app.use("/api/upload", _fileUploadRouter["default"]);
app.use("/api/users", _users["default"]);
app.use("/api/portfolio", _portfolio["default"]);
app.use("/api/portfoliotransactions", _portfoliotransactionsRouter["default"]);
app.use("/api/heatmap", _heatMapRouter["default"]);
app.use("/api/account", _Account["default"]);
app.use("/api/exhangerate", _exchangeRateRoutes["default"]);
app.use("/api/import", _importRouter["default"]);
app.use("/api/voice", _voiceRouter["default"]);
app.use("/api/broker", _brokerRouter["default"]);
app.use("/api/ai", _claudeRouter["default"]);

// Vercel cron endpoint — called daily by Vercel to refresh prices
// (Hobby plan: once per day max. Pro plan: every 30 min)
app.get("/api/cron/refresh", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_req, res) {
    var _require, fetchDataAndUpdate;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _require = require("./Cron/cronjob"), fetchDataAndUpdate = _require.fetchDataAndUpdate;
          _context.next = 4;
          return fetchDataAndUpdate();
        case 4:
          res.json({
            ok: true,
            ts: new Date().toISOString()
          });
          _context.next = 11;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Cron refresh error:", _context.t0);
          res.status(500).json({
            ok: false,
            error: _context.t0.message
          });
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// Centralized error handler — must be AFTER all routes
app.use(function (err, req, res, _next) {
  reflectCors(req, res);
  var status = err.status || 500;
  var message = err.message || "Internal Server Error";
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: message
  });
});

// Start HTTP server in local/Railway environments only.
// On Vercel, the app is exported as a serverless function handler.
if (!IS_VERCEL) {
  require("./Cron/cronjob"); // schedule background price refresh locally
  server.listen(_config.PORT, function () {
    console.log("Server is running on port ".concat(_config.PORT));
    var cookiePath = _path["default"].join(_os["default"].homedir(), ".yf2-cookies.json");
    console.log("cookiePath", cookiePath);
  });
}
var _default = exports["default"] = app;
//# sourceMappingURL=index.js.map