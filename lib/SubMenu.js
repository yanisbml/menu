'use strict';

exports.__esModule = true;
exports.SubMenu = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _rcTrigger = require('rc-trigger');

var _rcTrigger2 = _interopRequireDefault(_rcTrigger);

var _KeyCode = require('rc-util/lib/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _miniStore = require('mini-store');

var _SubPopupMenu = require('./SubPopupMenu');

var _SubPopupMenu2 = _interopRequireDefault(_SubPopupMenu);

var _placements = require('./placements');

var _placements2 = _interopRequireDefault(_placements);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var guid = 0;

var popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop'
};

var updateDefaultActiveFirst = function updateDefaultActiveFirst(store, eventKey, defaultActiveFirst) {
  var _extends2;

  var menuId = (0, _util.getMenuIdFromSubMenuEventKey)(eventKey);
  var state = store.getState();
  store.setState({
    defaultActiveFirst: (0, _extends4['default'])({}, state.defaultActiveFirst, (_extends2 = {}, _extends2[menuId] = defaultActiveFirst, _extends2))
  });
};

var SubMenu = exports.SubMenu = function (_React$Component) {
  (0, _inherits3['default'])(SubMenu, _React$Component);

  function SubMenu(props) {
    (0, _classCallCheck3['default'])(this, SubMenu);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var store = props.store;
    var eventKey = props.eventKey;
    var defaultActiveFirst = store.getState().defaultActiveFirst;

    _this.isRootMenu = false;

    var value = false;

    if (defaultActiveFirst) {
      value = defaultActiveFirst[eventKey];
    }

    updateDefaultActiveFirst(store, eventKey, value);
    return _this;
  }

  SubMenu.prototype.componentDidMount = function componentDidMount() {
    this.componentDidUpdate();
  };

  SubMenu.prototype.componentDidUpdate = function componentDidUpdate() {
    var _this2 = this;

    var _props = this.props,
        mode = _props.mode,
        parentMenu = _props.parentMenu,
        manualRef = _props.manualRef;

    // invoke customized ref to expose component to mixin

    if (manualRef) {
      manualRef(this);
    }

    if (mode !== 'horizontal' || !parentMenu.isRootMenu || !this.props.isOpen) {
      return;
    }

    this.minWidthTimeout = setTimeout(function () {
      return _this2.adjustWidth();
    }, 0);
  };

  SubMenu.prototype.componentWillUnmount = function componentWillUnmount() {
    var _props2 = this.props,
        onDestroy = _props2.onDestroy,
        eventKey = _props2.eventKey;

    if (onDestroy) {
      onDestroy(eventKey);
    }

    /* istanbul ignore if */
    if (this.minWidthTimeout) {
      clearTimeout(this.minWidthTimeout);
    }

    /* istanbul ignore if */
    if (this.mouseenterTimeout) {
      clearTimeout(this.mouseenterTimeout);
    }
  };

  SubMenu.prototype.renderChildren = function renderChildren(children) {
    var props = this.props;
    var baseProps = {
      mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
      visible: this.props.isOpen,
      level: props.level + 1,
      inlineIndent: props.inlineIndent,
      focusable: false,
      onClick: this.onSubMenuClick,
      onSelect: this.onSelect,
      onDeselect: this.onDeselect,
      onDestroy: this.onDestroy,
      selectedKeys: props.selectedKeys,
      eventKey: props.eventKey + '-menu-',
      openKeys: props.openKeys,
      openTransitionName: props.openTransitionName,
      openAnimation: props.openAnimation,
      onOpenChange: this.onOpenChange,
      subMenuOpenDelay: props.subMenuOpenDelay,
      parentMenu: this,
      subMenuCloseDelay: props.subMenuCloseDelay,
      forceSubMenuRender: props.forceSubMenuRender,
      triggerSubMenuAction: props.triggerSubMenuAction,
      builtinPlacements: props.builtinPlacements,
      defaultActiveFirst: props.store.getState().defaultActiveFirst[(0, _util.getMenuIdFromSubMenuEventKey)(props.eventKey)],
      multiple: props.multiple,
      prefixCls: props.rootPrefixCls,
      id: this._menuId,
      manualRef: this.saveMenuInstance,
      itemIcon: props.itemIcon,
      expandIcon: props.expandIcon
    };

    var haveRendered = this.haveRendered;
    this.haveRendered = true;

    this.haveOpened = this.haveOpened || baseProps.visible || baseProps.forceSubMenuRender;
    // never rendered not planning to, don't render
    if (!this.haveOpened) {
      return _react2['default'].createElement('div', null);
    }

    // don't show transition on first rendering (no animation for opened menu)
    // show appear transition if it's not visible (not sure why)
    // show appear transition if it's not inline mode
    var transitionAppear = haveRendered || !baseProps.visible || baseProps.mode !== 'inline';

    baseProps.className = ' ' + baseProps.prefixCls + '-sub';
    var animProps = {};

    if (baseProps.openTransitionName) {
      animProps.transitionName = baseProps.openTransitionName;
    } else if (typeof baseProps.openAnimation === 'object') {
      animProps.animation = (0, _extends4['default'])({}, baseProps.openAnimation);
      if (!transitionAppear) {
        delete animProps.animation.appear;
      }
    }

    return _react2['default'].createElement(
      _rcAnimate2['default'],
      (0, _extends4['default'])({}, animProps, {
        showProp: 'visible',
        component: '',
        transitionAppear: transitionAppear
      }),
      _react2['default'].createElement(
        _SubPopupMenu2['default'],
        (0, _extends4['default'])({}, baseProps, { id: this._menuId }),
        children
      )
    );
  };

  SubMenu.prototype.render = function render() {
    var _classNames;

    var props = (0, _extends4['default'])({}, this.props);
    var isOpen = props.isOpen;
    var prefixCls = this.getPrefixCls();
    var isInlineMode = props.mode === 'inline';
    var className = (0, _classnames2['default'])(prefixCls, prefixCls + '-' + props.mode, (_classNames = {}, _classNames[props.className] = !!props.className, _classNames[this.getOpenClassName()] = isOpen, _classNames[this.getActiveClassName()] = props.active || isOpen && !isInlineMode, _classNames[this.getDisabledClassName()] = props.disabled, _classNames[this.getSelectedClassName()] = this.isChildrenSelected(), _classNames));

    if (!this._menuId) {
      if (props.eventKey) {
        this._menuId = props.eventKey + '$Menu';
      } else {
        this._menuId = '$__$' + ++guid + '$Menu';
      }
    }

    var mouseEvents = {};
    var titleClickEvents = {};
    var titleMouseEvents = {};
    if (!props.disabled) {
      mouseEvents = {
        onMouseLeave: this.onMouseLeave,
        onMouseEnter: this.onMouseEnter
      };

      // only works in title, not outer li
      titleClickEvents = {
        onClick: this.onTitleClick
      };
      titleMouseEvents = {
        onMouseEnter: this.onTitleMouseEnter,
        onMouseLeave: this.onTitleMouseLeave
      };
    }

    var style = {};
    if (isInlineMode) {
      style.paddingLeft = props.inlineIndent * props.level;
    }

    var ariaOwns = {};
    // only set aria-owns when menu is open
    // otherwise it would be an invalid aria-owns value
    // since corresponding node cannot be found
    if (this.props.isOpen) {
      ariaOwns = {
        'aria-owns': this._menuId
      };
    }

    // expand custom icon should NOT be displayed in menu with horizontal mode.
    var icon = null;
    if (props.mode !== 'horizontal') {
      icon = this.props.expandIcon; // ReactNode
      if (typeof this.props.expandIcon === 'function') {
        icon = _react2['default'].createElement(this.props.expandIcon, (0, _extends4['default'])({}, this.props));
      }
    }

    var title = _react2['default'].createElement(
      'div',
      (0, _extends4['default'])({
        ref: this.saveSubMenuTitle,
        style: style,
        className: prefixCls + '-title'
      }, titleMouseEvents, titleClickEvents, {
        'aria-expanded': isOpen
      }, ariaOwns, {
        'aria-haspopup': 'true',
        title: typeof props.title === 'string' ? props.title : undefined
      }),
      props.title,
      icon || _react2['default'].createElement('i', { className: prefixCls + '-arrow' })
    );
    var children = this.renderChildren(props.children);

    var getPopupContainer = props.parentMenu.isRootMenu ? props.parentMenu.props.getPopupContainer : function (triggerNode) {
      return triggerNode.parentNode;
    };
    var popupPlacement = popupPlacementMap[props.mode];
    var popupAlign = props.popupOffset ? { offset: props.popupOffset } : {};
    var popupClassName = props.mode === 'inline' ? '' : props.popupClassName;
    var disabled = props.disabled,
        triggerSubMenuAction = props.triggerSubMenuAction,
        subMenuOpenDelay = props.subMenuOpenDelay,
        forceSubMenuRender = props.forceSubMenuRender,
        subMenuCloseDelay = props.subMenuCloseDelay,
        builtinPlacements = props.builtinPlacements;

    _util.menuAllProps.forEach(function (key) {
      return delete props[key];
    });
    // Set onClick to null, to ignore propagated onClick event
    delete props.onClick;

    return _react2['default'].createElement(
      'li',
      (0, _extends4['default'])({}, props, mouseEvents, {
        className: className,
        role: 'menuitem'
      }),
      isInlineMode && title,
      isInlineMode && children,
      !isInlineMode && _react2['default'].createElement(
        _rcTrigger2['default'],
        {
          prefixCls: prefixCls,
          popupClassName: prefixCls + '-popup ' + popupClassName,
          getPopupContainer: getPopupContainer,
          builtinPlacements: (0, _extends4['default'])({}, _placements2['default'], builtinPlacements),
          popupPlacement: popupPlacement,
          popupVisible: isOpen,
          popupAlign: popupAlign,
          popup: children,
          action: disabled ? [] : [triggerSubMenuAction],
          mouseEnterDelay: subMenuOpenDelay,
          mouseLeaveDelay: subMenuCloseDelay,
          onPopupVisibleChange: this.onPopupVisibleChange,
          forceRender: forceSubMenuRender
        },
        title
      )
    );
  };

  return SubMenu;
}(_react2['default'].Component);

SubMenu.propTypes = {
  parentMenu: _propTypes2['default'].object,
  title: _propTypes2['default'].node,
  children: _propTypes2['default'].any,
  selectedKeys: _propTypes2['default'].array,
  openKeys: _propTypes2['default'].array,
  onClick: _propTypes2['default'].func,
  onOpenChange: _propTypes2['default'].func,
  rootPrefixCls: _propTypes2['default'].string,
  eventKey: _propTypes2['default'].string,
  multiple: _propTypes2['default'].bool,
  active: _propTypes2['default'].bool, // TODO: remove
  onItemHover: _propTypes2['default'].func,
  onSelect: _propTypes2['default'].func,
  triggerSubMenuAction: _propTypes2['default'].string,
  onDeselect: _propTypes2['default'].func,
  onDestroy: _propTypes2['default'].func,
  onMouseEnter: _propTypes2['default'].func,
  onMouseLeave: _propTypes2['default'].func,
  onTitleMouseEnter: _propTypes2['default'].func,
  onTitleMouseLeave: _propTypes2['default'].func,
  onTitleClick: _propTypes2['default'].func,
  popupOffset: _propTypes2['default'].array,
  isOpen: _propTypes2['default'].bool,
  store: _propTypes2['default'].object,
  mode: _propTypes2['default'].oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
  manualRef: _propTypes2['default'].func,
  itemIcon: _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].node]),
  expandIcon: _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].node])
};
SubMenu.defaultProps = {
  onMouseEnter: _util.noop,
  onMouseLeave: _util.noop,
  onTitleMouseEnter: _util.noop,
  onTitleMouseLeave: _util.noop,
  onTitleClick: _util.noop,
  manualRef: _util.noop,
  mode: 'vertical',
  title: ''
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onDestroy = function (key) {
    _this3.props.onDestroy(key);
  };

  this.onKeyDown = function (e) {
    var keyCode = e.keyCode;
    var menu = _this3.menuInstance;
    var _props3 = _this3.props,
        isOpen = _props3.isOpen,
        store = _props3.store;


    if (keyCode === _KeyCode2['default'].ENTER) {
      _this3.onTitleClick(e);
      updateDefaultActiveFirst(store, _this3.props.eventKey, true);
      return true;
    }

    if (keyCode === _KeyCode2['default'].RIGHT) {
      if (isOpen) {
        menu.onKeyDown(e);
      } else {
        _this3.triggerOpenChange(true);
        // need to update current menu's defaultActiveFirst value
        updateDefaultActiveFirst(store, _this3.props.eventKey, true);
      }
      return true;
    }
    if (keyCode === _KeyCode2['default'].LEFT) {
      var handled = void 0;
      if (isOpen) {
        handled = menu.onKeyDown(e);
      } else {
        return undefined;
      }
      if (!handled) {
        _this3.triggerOpenChange(false);
        handled = true;
      }
      return handled;
    }

    if (isOpen && (keyCode === _KeyCode2['default'].UP || keyCode === _KeyCode2['default'].DOWN)) {
      return menu.onKeyDown(e);
    }
  };

  this.onOpenChange = function (e) {
    _this3.props.onOpenChange(e);
  };

  this.onPopupVisibleChange = function (visible) {
    _this3.triggerOpenChange(visible, visible ? 'mouseenter' : 'mouseleave');
  };

  this.onMouseEnter = function (e) {
    var _props4 = _this3.props,
        key = _props4.eventKey,
        onMouseEnter = _props4.onMouseEnter,
        store = _props4.store;

    updateDefaultActiveFirst(store, _this3.props.eventKey, false);
    onMouseEnter({
      key: key,
      domEvent: e
    });
  };

  this.onMouseLeave = function (e) {
    var _props5 = _this3.props,
        parentMenu = _props5.parentMenu,
        eventKey = _props5.eventKey,
        onMouseLeave = _props5.onMouseLeave;

    parentMenu.subMenuInstance = _this3;
    onMouseLeave({
      key: eventKey,
      domEvent: e
    });
  };

  this.onTitleMouseEnter = function (domEvent) {
    var _props6 = _this3.props,
        key = _props6.eventKey,
        onItemHover = _props6.onItemHover,
        onTitleMouseEnter = _props6.onTitleMouseEnter;

    onItemHover({
      key: key,
      hover: true
    });
    onTitleMouseEnter({
      key: key,
      domEvent: domEvent
    });
  };

  this.onTitleMouseLeave = function (e) {
    var _props7 = _this3.props,
        parentMenu = _props7.parentMenu,
        eventKey = _props7.eventKey,
        onItemHover = _props7.onItemHover,
        onTitleMouseLeave = _props7.onTitleMouseLeave;

    parentMenu.subMenuInstance = _this3;
    onItemHover({
      key: eventKey,
      hover: false
    });
    onTitleMouseLeave({
      key: eventKey,
      domEvent: e
    });
  };

  this.onTitleClick = function (e) {
    var props = _this3.props;

    props.onTitleClick({
      key: props.eventKey,
      domEvent: e
    });
    if (props.triggerSubMenuAction === 'hover') {
      return;
    }
    _this3.triggerOpenChange(!props.isOpen, 'click');
    updateDefaultActiveFirst(props.store, _this3.props.eventKey, false);
  };

  this.onSubMenuClick = function (info) {
    // in the case of overflowed submenu
    // onClick is not copied over
    if (typeof _this3.props.onClick === 'function') {
      _this3.props.onClick(_this3.addKeyPath(info));
    }
  };

  this.onSelect = function (info) {
    _this3.props.onSelect(info);
  };

  this.onDeselect = function (info) {
    _this3.props.onDeselect(info);
  };

  this.getPrefixCls = function () {
    return _this3.props.rootPrefixCls + '-submenu';
  };

  this.getActiveClassName = function () {
    return _this3.getPrefixCls() + '-active';
  };

  this.getDisabledClassName = function () {
    return _this3.getPrefixCls() + '-disabled';
  };

  this.getSelectedClassName = function () {
    return _this3.getPrefixCls() + '-selected';
  };

  this.getOpenClassName = function () {
    return _this3.props.rootPrefixCls + '-submenu-open';
  };

  this.saveMenuInstance = function (c) {
    // children menu instance
    _this3.menuInstance = c;
  };

  this.addKeyPath = function (info) {
    return (0, _extends4['default'])({}, info, {
      keyPath: (info.keyPath || []).concat(_this3.props.eventKey)
    });
  };

  this.triggerOpenChange = function (open, type) {
    var key = _this3.props.eventKey;
    var openChange = function openChange() {
      _this3.onOpenChange({
        key: key,
        item: _this3,
        trigger: type,
        open: open
      });
    };
    if (type === 'mouseenter') {
      // make sure mouseenter happen after other menu item's mouseleave
      _this3.mouseenterTimeout = setTimeout(function () {
        openChange();
      }, 0);
    } else {
      openChange();
    }
  };

  this.isChildrenSelected = function () {
    var ret = { find: false };
    (0, _util.loopMenuItemRecursively)(_this3.props.children, _this3.props.selectedKeys, ret);
    return ret.find;
  };

  this.isOpen = function () {
    return _this3.props.openKeys.indexOf(_this3.props.eventKey) !== -1;
  };

  this.adjustWidth = function () {
    /* istanbul ignore if */
    if (!_this3.subMenuTitle || !_this3.menuInstance) {
      return;
    }
    var popupMenu = _reactDom2['default'].findDOMNode(_this3.menuInstance);
    if (popupMenu.offsetWidth >= _this3.subMenuTitle.offsetWidth) {
      return;
    }

    /* istanbul ignore next */
    popupMenu.style.minWidth = _this3.subMenuTitle.offsetWidth + 'px';
  };

  this.saveSubMenuTitle = function (subMenuTitle) {
    _this3.subMenuTitle = subMenuTitle;
  };
};

var connected = (0, _miniStore.connect)(function (_ref, _ref2) {
  var openKeys = _ref.openKeys,
      activeKey = _ref.activeKey,
      selectedKeys = _ref.selectedKeys;
  var eventKey = _ref2.eventKey,
      subMenuKey = _ref2.subMenuKey;
  return {
    isOpen: openKeys.indexOf(eventKey) > -1,
    active: activeKey[subMenuKey] === eventKey,
    selectedKeys: selectedKeys
  };
})(SubMenu);

connected.isSubMenu = true;

exports['default'] = connected;