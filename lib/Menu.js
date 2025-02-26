'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _miniStore = require('mini-store');

var _SubPopupMenu = require('./SubPopupMenu');

var _SubPopupMenu2 = _interopRequireDefault(_SubPopupMenu);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Menu = function (_React$Component) {
  (0, _inherits3['default'])(Menu, _React$Component);

  function Menu(props) {
    (0, _classCallCheck3['default'])(this, Menu);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    _this.isRootMenu = true;

    var selectedKeys = props.defaultSelectedKeys;
    var openKeys = props.defaultOpenKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || [];
    }
    if ('openKeys' in props) {
      openKeys = props.openKeys || [];
    }

    _this.store = (0, _miniStore.create)({
      selectedKeys: selectedKeys,
      openKeys: openKeys,
      activeKey: { '0-menu-': (0, _SubPopupMenu.getActiveKey)(props, props.activeKey) }
    });
    return _this;
  }

  Menu.prototype.componentDidMount = function componentDidMount() {
    this.updateMiniStore();
  };

  Menu.prototype.componentDidUpdate = function componentDidUpdate() {
    this.updateMiniStore();
  };

  // onKeyDown needs to be exposed as a instance method
  // e.g., in rc-select, we need to navigate menu item while
  // current active item is rc-select input box rather than the menu itself


  Menu.prototype.updateMiniStore = function updateMiniStore() {
    if ('selectedKeys' in this.props) {
      this.store.setState({
        selectedKeys: this.props.selectedKeys || []
      });
    }
    if ('openKeys' in this.props) {
      this.store.setState({
        openKeys: this.props.openKeys || []
      });
    }
  };

  Menu.prototype.render = function render() {
    var _this2 = this;

    var props = (0, _objectWithoutProperties3['default'])(this.props, []);

    props.className += ' ' + props.prefixCls + '-root';
    props = (0, _extends3['default'])({}, props, {
      onClick: this.onClick,
      onOpenChange: this.onOpenChange,
      onDeselect: this.onDeselect,
      onSelect: this.onSelect,
      openTransitionName: this.getOpenTransitionName(),
      parentMenu: this
    });
    return _react2['default'].createElement(
      _miniStore.Provider,
      { store: this.store },
      _react2['default'].createElement(
        _SubPopupMenu2['default'],
        (0, _extends3['default'])({}, props, { ref: function ref(c) {
            return _this2.innerMenu = c;
          } }),
        this.props.children
      )
    );
  };

  return Menu;
}(_react2['default'].Component);

Menu.propTypes = {
  defaultSelectedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  defaultActiveFirst: _propTypes2['default'].bool,
  selectedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  defaultOpenKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  openKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  mode: _propTypes2['default'].oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
  getPopupContainer: _propTypes2['default'].func,
  onClick: _propTypes2['default'].func,
  onSelect: _propTypes2['default'].func,
  onDeselect: _propTypes2['default'].func,
  onDestroy: _propTypes2['default'].func,
  openTransitionName: _propTypes2['default'].string,
  openAnimation: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].object]),
  subMenuOpenDelay: _propTypes2['default'].number,
  subMenuCloseDelay: _propTypes2['default'].number,
  forceSubMenuRender: _propTypes2['default'].bool,
  triggerSubMenuAction: _propTypes2['default'].string,
  level: _propTypes2['default'].number,
  selectable: _propTypes2['default'].bool,
  multiple: _propTypes2['default'].bool,
  children: _propTypes2['default'].any,
  className: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  activeKey: _propTypes2['default'].string,
  prefixCls: _propTypes2['default'].string,
  builtinPlacements: _propTypes2['default'].object,
  itemIcon: _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].node]),
  expandIcon: _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].node]),
  overflowedIndicator: _propTypes2['default'].node
};
Menu.defaultProps = {
  selectable: true,
  onClick: _util.noop,
  onSelect: _util.noop,
  onOpenChange: _util.noop,
  onDeselect: _util.noop,
  defaultSelectedKeys: [],
  defaultOpenKeys: [],
  subMenuOpenDelay: 0.1,
  subMenuCloseDelay: 0.1,
  triggerSubMenuAction: 'hover',
  prefixCls: 'rc-menu',
  className: '',
  mode: 'vertical',
  style: {},
  builtinPlacements: {},
  overflowedIndicator: _react2['default'].createElement(
    'span',
    null,
    '\xB7\xB7\xB7'
  )
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onSelect = function (selectInfo) {
    var props = _this3.props;
    if (props.selectable) {
      // root menu
      var selectedKeys = _this3.store.getState().selectedKeys;
      var selectedKey = selectInfo.key;
      if (props.multiple) {
        selectedKeys = selectedKeys.concat([selectedKey]);
      } else {
        selectedKeys = [selectedKey];
      }
      if (!('selectedKeys' in props)) {
        _this3.store.setState({
          selectedKeys: selectedKeys
        });
      }
      props.onSelect((0, _extends3['default'])({}, selectInfo, {
        selectedKeys: selectedKeys
      }));
    }
  };

  this.onClick = function (e) {
    _this3.props.onClick(e);
  };

  this.onKeyDown = function (e, callback) {
    _this3.innerMenu.getWrappedInstance().onKeyDown(e, callback);
  };

  this.onOpenChange = function (event) {
    var props = _this3.props;
    var openKeys = _this3.store.getState().openKeys.concat();
    var changed = false;
    var processSingle = function processSingle(e) {
      var oneChanged = false;
      if (e.open) {
        oneChanged = openKeys.indexOf(e.key) === -1;
        if (oneChanged) {
          openKeys.push(e.key);
        }
      } else {
        var index = openKeys.indexOf(e.key);
        oneChanged = index !== -1;
        if (oneChanged) {
          openKeys.splice(index, 1);
        }
      }
      changed = changed || oneChanged;
    };
    if (Array.isArray(event)) {
      // batch change call
      event.forEach(processSingle);
    } else {
      processSingle(event);
    }
    if (changed) {
      if (!('openKeys' in _this3.props)) {
        _this3.store.setState({ openKeys: openKeys });
      }
      props.onOpenChange(openKeys);
    }
  };

  this.onDeselect = function (selectInfo) {
    var props = _this3.props;
    if (props.selectable) {
      var selectedKeys = _this3.store.getState().selectedKeys.concat();
      var selectedKey = selectInfo.key;
      var index = selectedKeys.indexOf(selectedKey);
      if (index !== -1) {
        selectedKeys.splice(index, 1);
      }
      if (!('selectedKeys' in props)) {
        _this3.store.setState({
          selectedKeys: selectedKeys
        });
      }
      props.onDeselect((0, _extends3['default'])({}, selectInfo, {
        selectedKeys: selectedKeys
      }));
    }
  };

  this.getOpenTransitionName = function () {
    var props = _this3.props;
    var transitionName = props.openTransitionName;
    var animationName = props.openAnimation;
    if (!transitionName && typeof animationName === 'string') {
      transitionName = props.prefixCls + '-open-' + animationName;
    }
    return transitionName;
  };
};

exports['default'] = Menu;
module.exports = exports['default'];