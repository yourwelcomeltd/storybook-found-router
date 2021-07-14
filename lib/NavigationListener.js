"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _addonActions = require("@storybook/addon-actions");

var _addonLinks = require("@storybook/addon-links");

var _PropTypes = require("found/PropTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var NavigationListener = /*#__PURE__*/function (_React$Component) {
  _inherits(NavigationListener, _React$Component);

  var _super = _createSuper(NavigationListener);

  function NavigationListener(props) {
    var _this;

    _classCallCheck(this, NavigationListener);

    _this = _super.call(this, props);
    _this.onNavigation = _this.onNavigation.bind(_assertThisInitialized(_this));
    _this.removeNavigationListener = props.router.addNavigationListener(_this.onNavigation);
    return _this;
  }

  _createClass(NavigationListener, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeNavigationListener();
    }
  }, {
    key: "handleMatchingFailure",
    value: function handleMatchingFailure() {
      console.warn('storybook-found-router:', 'No route matched; forgot to add or mispelled something?');
      return false;
    }
  }, {
    key: "handleMatchingSuccess",
    value: function handleMatchingSuccess(kind, story) {
      console.info('storybook-found-router:', "Pushing matched route to story '".concat(kind, "', '").concat(story, "'"));
      return (0, _addonLinks.linkTo)(kind, story)();
    }
  }, {
    key: "onNavigation",
    value: function onNavigation(location) {
      var link = location.pathname;
      var matcher = this.props.router.matcher;
      (0, _addonActions.action)(location.action)(link);
      var match = matcher.match({
        pathname: link
      });
      if (!match) return this.handleMatchingFailure();
      var routes = matcher.getRoutes({
        routeIndices: match.routeIndices
      }); // Due to a breaking change introduced in found 4.0 we need to traverse empty objects.
      // As discussed in https://github.com/4Catalyzer/found/issues/657

      var route = routes.pop();

      while (!Object.keys(route).length && routes.length) {
        route = routes.pop();
      }

      var isRouteStoryArray = Array.isArray(route.story);
      var kind = isRouteStoryArray ? route.story[0] : route.story;
      var story = isRouteStoryArray ? route.story[1] : 'default';
      return kind ? this.handleMatchingSuccess(kind, story) : this.handleMatchingFailure();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, this.props.children);
    }
  }]);

  return NavigationListener;
}(_react["default"].Component);

NavigationListener.propTypes = {
  router: _PropTypes.routerShape.isRequired
};
var _default = NavigationListener;
exports["default"] = _default;