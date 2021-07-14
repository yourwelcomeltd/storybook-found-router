"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _addonActions = require("@storybook/addon-actions");

var _addonLinks = require("@storybook/addon-links");

var _NavigationListener = _interopRequireDefault(require("./NavigationListener"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var mockActionAddon = jest.fn();
var mockLinkAddon = jest.fn();
jest.mock('@storybook/addon-actions', function () {
  return {
    action: jest.fn(function () {
      return mockActionAddon;
    })
  };
});
jest.mock('@storybook/addon-links', function () {
  return {
    linkTo: jest.fn(function () {
      return mockLinkAddon;
    })
  };
});
global.console = {
  info: jest.fn(),
  warn: jest.fn()
};

var storyFn = function storyFn() {
  return /*#__PURE__*/_react["default"].createElement("div", null, "my story");
};

describe('NavigationListener', function () {
  var routerProp = {
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      createHref: jest.fn(),
      createLocation: jest.fn(),
      isActive: jest.fn(),
      matcher: {
        match: jest.fn(),
        getRoutes: jest.fn(),
        isActive: jest.fn(),
        format: jest.fn()
      },
      addNavigationListener: jest.fn()
    }
  };

  var wrap = function wrap() {
    return (0, _enzyme.mount)( /*#__PURE__*/_react["default"].createElement(_NavigationListener["default"], _extends({}, routerProp, {
      story: storyFn
    })));
  };

  describe('React Component', function () {
    afterEach(function () {
      routerProp.router.addNavigationListener.mockClear();
    });
    it('renders the passed story element as a children', function () {
      var wrapper = wrap();
      expect(wrapper.find('NavigationListener')).toHaveLength(1);
      expect(wrapper.children().html()).toEqual((0, _enzyme.shallow)(storyFn()).html());
    });
    it('adds the internal onNavigation method as a NavigationListener', function () {
      var wrapper = wrap();
      wrapper.instance().removeNavigationListener = jest.fn();
      expect(routerProp.router.addNavigationListener).toHaveBeenCalledTimes(1);
      expect(routerProp.router.addNavigationListener).toHaveBeenCalledWith(wrapper.instance().onNavigation);
    });
    it('sets and execute removeNavigationListener method on componentWillUnmount', function () {
      var wrapper = wrap();
      var mockRemoveNavigationListener = jest.fn();
      wrapper.instance().removeNavigationListener = mockRemoveNavigationListener;
      expect(wrapper.instance().componentWillUnmount).toBeDefined();
      wrapper.unmount();
      expect(mockRemoveNavigationListener).toHaveBeenCalled();
    });
  });
  describe('onNavigation method', function () {
    afterEach(function () {
      mockActionAddon.mockClear();

      _addonActions.action.mockClear();

      routerProp.router.matcher.match.mockClear();
      routerProp.router.matcher.getRoutes.mockClear();
    });
    it('calls handleMatchingSuccess when matching route with story string', function () {
      var wrapper = wrap();
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      });
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([{
        story: 'HomePage'
      }]);
      wrapper.instance().handleMatchingFailure = jest.fn();
      wrapper.instance().handleMatchingSuccess = jest.fn();
      wrapper.instance().onNavigation({
        action: 'PUSH',
        pathname: '/'
      });
      expect(_addonActions.action).toHaveBeenCalledWith('PUSH');
      expect(mockActionAddon).toHaveBeenCalledWith('/');
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled();
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith('HomePage', 'default');
    });
    it('calls handleMatchingSuccess when matching route with story array of 2 elements', function () {
      var wrapper = wrap();
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      });
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([{
        story: ['LoginForm', 'invalid']
      }]);
      wrapper.instance().handleMatchingFailure = jest.fn();
      wrapper.instance().handleMatchingSuccess = jest.fn();
      wrapper.instance().onNavigation({
        action: 'PUSH',
        pathname: '/login'
      });
      expect(_addonActions.action).toHaveBeenCalledWith('PUSH');
      expect(mockActionAddon).toHaveBeenCalledWith('/login');
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled();
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith('LoginForm', 'invalid');
    });
    it('calls handleMatchingSuccess when matching route with story array ignoring extra elements', function () {
      var wrapper = wrap();
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      });
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([{
        story: ['LoginForm', 'invalid', 'foo', 'bar']
      }]);
      wrapper.instance().handleMatchingFailure = jest.fn();
      wrapper.instance().handleMatchingSuccess = jest.fn();
      wrapper.instance().onNavigation({
        action: 'PUSH',
        pathname: '/login'
      });
      expect(_addonActions.action).toHaveBeenCalledWith('PUSH');
      expect(mockActionAddon).toHaveBeenCalledWith('/login');
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled();
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith('LoginForm', 'invalid');
    });
    it('calls handleMatchingFailure when matching route without story', function () {
      var wrapper = wrap();
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      });
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([{}]);
      wrapper.instance().handleMatchingFailure = jest.fn();
      wrapper.instance().handleMatchingSuccess = jest.fn();
      wrapper.instance().onNavigation({
        action: 'PUSH',
        pathname: '/'
      });
      expect(_addonActions.action).toHaveBeenCalledWith('PUSH');
      expect(mockActionAddon).toHaveBeenCalledWith('/');
      expect(wrapper.instance().handleMatchingFailure).toHaveBeenCalledWith();
      expect(wrapper.instance().handleMatchingSuccess).not.toHaveBeenCalled();
    });
    it('calls handleMatchingFailure when not matching route', function () {
      var wrapper = wrap();
      routerProp.router.matcher.match.mockReturnValueOnce(null);
      wrapper.instance().handleMatchingFailure = jest.fn();
      wrapper.instance().handleMatchingSuccess = jest.fn();
      wrapper.instance().onNavigation({
        action: 'PUSH',
        pathname: '/'
      });
      expect(_addonActions.action).toHaveBeenCalledWith('PUSH');
      expect(mockActionAddon).toHaveBeenCalledWith('/');
      expect(routerProp.router.matcher.getRoutes).not.toHaveBeenCalled();
      expect(wrapper.instance().handleMatchingFailure).toHaveBeenCalledWith();
      expect(wrapper.instance().handleMatchingSuccess).not.toHaveBeenCalled();
    });
    it('traverses single empty object when present in routes array', function () {
      var wrapper = wrap();
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      });
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([{
        story: 'foo'
      }, {}]);
      wrapper.instance().handleMatchingFailure = jest.fn();
      wrapper.instance().handleMatchingSuccess = jest.fn();
      wrapper.instance().onNavigation({
        action: 'PUSH',
        pathname: '/'
      });
      expect(_addonActions.action).toHaveBeenCalledWith('PUSH');
      expect(mockActionAddon).toHaveBeenCalledWith('/');
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled();
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith('foo', 'default');
    });
    it('traverses multiple empty objects when present in routes array', function () {
      var wrapper = wrap();
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      });
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([{
        story: 'foo'
      }, {}, {}, {}]);
      wrapper.instance().handleMatchingFailure = jest.fn();
      wrapper.instance().handleMatchingSuccess = jest.fn();
      wrapper.instance().onNavigation({
        action: 'PUSH',
        pathname: '/'
      });
      expect(_addonActions.action).toHaveBeenCalledWith('PUSH');
      expect(mockActionAddon).toHaveBeenCalledWith('/');
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled();
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith('foo', 'default');
    });
  });
  describe('handleMatchingFailure method', function () {
    afterEach(function () {
      console.warn.mockClear();
      mockLinkAddon.mockClear();

      _addonLinks.linkTo.mockClear();
    });
    it('should log a warn message to notify that no route has been matched and return false', function () {
      var wrapper = wrap();
      var handleMatchingFailure = wrapper.instance().handleMatchingFailure();
      expect(console.warn).toHaveBeenCalledWith('storybook-found-router:', expect.stringContaining('No route matched'));
      expect(handleMatchingFailure).toBeFalsy();
      expect(_addonLinks.linkTo).not.toHaveBeenCalled();
      expect(mockLinkAddon).not.toHaveBeenCalled();
    });
  });
  describe('handleMatchingSuccess method', function () {
    afterEach(function () {
      console.info.mockClear();
      mockLinkAddon.mockClear();

      _addonLinks.linkTo.mockClear();
    });
    it('should log an info message with Kind and Story and call addon linkTo', function () {
      var wrapper = wrap();
      var kind = 'HomePage';
      var story = 'default';
      wrapper.instance().handleMatchingSuccess(kind, story);
      expect(console.info).toHaveBeenCalledWith('storybook-found-router:', expect.stringContaining("'".concat(kind, "', '").concat(story, "'")));
      expect(_addonLinks.linkTo).toHaveBeenCalledWith(kind, story);
      expect(mockLinkAddon).toHaveBeenCalledWith();
    });
  });
});