import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { Provider, create } from 'mini-store';
import { default as SubPopupMenu, getActiveKey } from './SubPopupMenu';
import { noop } from './util';

var Menu = function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu(props) {
    _classCallCheck(this, Menu);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

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

    _this.store = create({
      selectedKeys: selectedKeys,
      openKeys: openKeys,
      activeKey: { '0-menu-': getActiveKey(props, props.activeKey) }
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

    var props = _objectWithoutProperties(this.props, []);

    props.className += ' ' + props.prefixCls + '-root';
    props = _extends({}, props, {
      onClick: this.onClick,
      onOpenChange: this.onOpenChange,
      onDeselect: this.onDeselect,
      onSelect: this.onSelect,
      openTransitionName: this.getOpenTransitionName(),
      parentMenu: this
    });
    return React.createElement(
      Provider,
      { store: this.store },
      React.createElement(
        SubPopupMenu,
        _extends({}, props, { ref: function ref(c) {
            return _this2.innerMenu = c;
          } }),
        this.props.children
      )
    );
  };

  return Menu;
}(React.Component);

Menu.propTypes = {
  defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
  defaultActiveFirst: PropTypes.bool,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
  openKeys: PropTypes.arrayOf(PropTypes.string),
  mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
  getPopupContainer: PropTypes.func,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  onDestroy: PropTypes.func,
  openTransitionName: PropTypes.string,
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subMenuOpenDelay: PropTypes.number,
  subMenuCloseDelay: PropTypes.number,
  forceSubMenuRender: PropTypes.bool,
  triggerSubMenuAction: PropTypes.string,
  level: PropTypes.number,
  selectable: PropTypes.bool,
  multiple: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object,
  activeKey: PropTypes.string,
  prefixCls: PropTypes.string,
  builtinPlacements: PropTypes.object,
  itemIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  expandIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  overflowedIndicator: PropTypes.node
};
Menu.defaultProps = {
  selectable: true,
  onClick: noop,
  onSelect: noop,
  onOpenChange: noop,
  onDeselect: noop,
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
  overflowedIndicator: React.createElement(
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
      props.onSelect(_extends({}, selectInfo, {
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
      props.onDeselect(_extends({}, selectInfo, {
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

export default Menu;