"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.normaliseRouteChildren = void 0;

var _react = _interopRequireDefault(require("react"));

var _createFarceRouter = _interopRequireDefault(require("found/createFarceRouter"));

var _createRender = _interopRequireDefault(require("found/createRender"));

var _MemoryProtocol = _interopRequireDefault(require("farce/MemoryProtocol"));

var _resolver = _interopRequireDefault(require("found/resolver"));

var _NavigationListener = _interopRequireDefault(require("./NavigationListener"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Due to a breaking change introduced in found 4.0 we need to
// add empty objects to route children array, if not present.
// As discussed in https://github.com/4Catalyzer/found/issues/657
var normaliseRouteChildren = function normaliseRouteChildren(input) {
  var childrenHasEmptyArray = false;
  var children = !!input.children && input.children.map(function (current) {
    childrenHasEmptyArray = childrenHasEmptyArray || Object.keys(current).length === 0;
    return normaliseRouteChildren(current);
  });

  if (children && !childrenHasEmptyArray) {
    children.unshift({});
  }

  return _objectSpread(_objectSpread({}, input), children && {
    children: children
  });
};

exports.normaliseRouteChildren = normaliseRouteChildren;

var storyRouterDecorator = function storyRouterDecorator() {
  var routes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [{}];
  var initialLocation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var decorator = function decorator(story) {
    var rootPath = routes[0].path === '/' ? '' : '/';
    var StoryRouter = (0, _createFarceRouter["default"])({
      historyProtocol: new _MemoryProtocol["default"](initialLocation),
      routeConfig: [{
        path: rootPath,
        Component: _NavigationListener["default"],
        render: function render(_ref) {
          var Component = _ref.Component,
              props = _ref.props;
          return /*#__PURE__*/_react["default"].createElement(Component, props, "story()");
        },
        children: routes.map(normaliseRouteChildren)
      }],
      render: (0, _createRender["default"])({})
    });
    return /*#__PURE__*/_react["default"].createElement(StoryRouter, {
      resolver: _resolver["default"]
    });
  };

  decorator.displayName = 'StoryRouter';
  return decorator;
};

var _default = storyRouterDecorator;
exports["default"] = _default;