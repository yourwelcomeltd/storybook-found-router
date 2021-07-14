"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ = _interopRequireWildcard(require("."));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var storyFn = function storyFn() {
  return /*#__PURE__*/_react["default"].createElement("div", null, "my story");
};

describe('storyRouterDecorator', function () {
  var wrap = function wrap(routeConfig, initialLocation) {
    var StoryRouter = (0, _["default"])(routeConfig, initialLocation);
    return (0, _enzyme.mount)(StoryRouter(storyFn));
  };

  it('should render BaseRouter with expected resolvedMatch prop when called without arguments', function () {
    var wrapper = wrap();
    var resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch');
    expect(wrapper.find('FarceRouter')).toHaveLength(1);
    expect(wrapper.find('Provider')).toHaveLength(1);
    expect(wrapper.find('BaseRouter')).toHaveLength(1);
    expect(resolvedMatch.location.pathname).toBe('');
    expect(resolvedMatch.routeIndices).toBeDefined();
  });
  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig with "/" route', function () {
    var wrapper = wrap([{
      path: '/',
      story: 'HomePage'
    }]);
    var resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch');
    expect(wrapper.find('FarceRouter')).toHaveLength(1);
    expect(wrapper.find('Provider')).toHaveLength(1);
    expect(wrapper.find('BaseRouter')).toHaveLength(1);
    expect(resolvedMatch.location.pathname).toBe('');
    expect(resolvedMatch.routeIndices).toBeDefined();
  });
  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig without "/" route nor initialLocation', function () {
    var wrapper = wrap([{
      path: '/login',
      story: 'LoginPage'
    }]);
    var resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch');
    expect(wrapper.find('FarceRouter')).toHaveLength(1);
    expect(wrapper.find('Provider')).toHaveLength(1);
    expect(wrapper.find('BaseRouter')).toHaveLength(1);
    expect(resolvedMatch.location.pathname).toBe('');
    expect(resolvedMatch.routeIndices).toBeUndefined();
  });
  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig and initialLocation', function () {
    var wrapper = wrap([{
      path: '/login',
      story: 'LoginPage'
    }], '/login');
    var resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch');
    expect(wrapper.find('FarceRouter')).toHaveLength(1);
    expect(wrapper.find('Provider')).toHaveLength(1);
    expect(wrapper.find('BaseRouter')).toHaveLength(1);
    expect(resolvedMatch.location.pathname).toBe('/login');
    expect(resolvedMatch.routeIndices).toBeDefined();
  });
  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig and inexistent initialLocation', function () {
    var wrapper = wrap([{
      path: '/login',
      story: 'LoginPage'
    }], '/foo');
    var resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch');
    expect(wrapper.find('FarceRouter')).toHaveLength(1);
    expect(wrapper.find('Provider')).toHaveLength(1);
    expect(wrapper.find('BaseRouter')).toHaveLength(1);
    expect(resolvedMatch.location.pathname).toBe('/foo');
    expect(resolvedMatch.routeIndices).toBeUndefined();
  });
});
describe('normaliseRouteChildren', function () {
  var expectedRouteConfig = [{
    path: '/',
    story: 'RootStory',
    children: [{}, {
      path: 'foo',
      story: 'FooStory'
    }, {
      path: 'bar',
      story: 'BarStory',
      children: [{}, {
        path: 'baz',
        story: 'BazStory',
        children: [{}, {
          path: 'quux',
          story: 'QuuxStory'
        }]
      }]
    }]
  }];
  it('returns expected array of objects when no empty objects are included in children', function () {
    var initialRouteConfig = [{
      path: '/',
      story: 'RootStory',
      children: [{
        path: 'foo',
        story: 'FooStory'
      }, {
        path: 'bar',
        story: 'BarStory',
        children: [{
          path: 'baz',
          story: 'BazStory',
          children: [{
            path: 'quux',
            story: 'QuuxStory'
          }]
        }]
      }]
    }];
    expect(initialRouteConfig.map(_.normaliseRouteChildren)).toEqual(expectedRouteConfig);
  });
  it('returns expected array of objects when some empty objects are included in children', function () {
    var initialRouteConfig = [{
      path: '/',
      story: 'RootStory',
      children: [{}, {
        path: 'foo',
        story: 'FooStory'
      }, {
        path: 'bar',
        story: 'BarStory',
        children: [{
          path: 'baz',
          story: 'BazStory',
          children: [{}, {
            path: 'quux',
            story: 'QuuxStory'
          }]
        }]
      }]
    }];
    expect(initialRouteConfig.map(_.normaliseRouteChildren)).toEqual(expectedRouteConfig);
  });
});