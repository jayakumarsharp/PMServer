"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
/** ExpressError extends normal JS error so we can
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */
var ExpressError = /*#__PURE__*/function (_Error) {
  function ExpressError(message, status) {
    var _this;
    _classCallCheck(this, ExpressError);
    _this = _callSuper(this, ExpressError);
    _this.message = message;
    _this.status = status;
    return _this;
  }
  _inherits(ExpressError, _Error);
  return _createClass(ExpressError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/** 404 NOT FOUND error. */
var NotFoundError = /*#__PURE__*/function (_ExpressError) {
  function NotFoundError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Not Found";
    _classCallCheck(this, NotFoundError);
    return _callSuper(this, NotFoundError, [message, 404]);
  }
  _inherits(NotFoundError, _ExpressError);
  return _createClass(NotFoundError);
}(ExpressError);
/** 401 UNAUTHORIZED error. */
var UnauthorizedError = /*#__PURE__*/function (_ExpressError2) {
  function UnauthorizedError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Unauthorized";
    _classCallCheck(this, UnauthorizedError);
    return _callSuper(this, UnauthorizedError, [message, 401]);
  }
  _inherits(UnauthorizedError, _ExpressError2);
  return _createClass(UnauthorizedError);
}(ExpressError);
/** 400 BAD REQUEST error. */
var BadRequestError = /*#__PURE__*/function (_ExpressError3) {
  function BadRequestError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Bad Request";
    _classCallCheck(this, BadRequestError);
    return _callSuper(this, BadRequestError, [message, 400]);
  }
  _inherits(BadRequestError, _ExpressError3);
  return _createClass(BadRequestError);
}(ExpressError);
/** 403 BAD REQUEST error. */
var ForbiddenError = /*#__PURE__*/function (_ExpressError4) {
  function ForbiddenError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Bad Request";
    _classCallCheck(this, ForbiddenError);
    return _callSuper(this, ForbiddenError, [message, 403]);
  }
  _inherits(ForbiddenError, _ExpressError4);
  return _createClass(ForbiddenError);
}(ExpressError);
module.exports = {
  ExpressError: ExpressError,
  NotFoundError: NotFoundError,
  UnauthorizedError: UnauthorizedError,
  BadRequestError: BadRequestError,
  ForbiddenError: ForbiddenError
};
//# sourceMappingURL=expressError.js.map