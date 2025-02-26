import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';

var Divider = function (_React$Component) {
  _inherits(Divider, _React$Component);

  function Divider() {
    _classCallCheck(this, Divider);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Divider.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        rootPrefixCls = _props.rootPrefixCls,
        style = _props.style;

    return React.createElement('li', {
      className: className + ' ' + rootPrefixCls + '-item-divider',
      style: style
    });
  };

  return Divider;
}(React.Component);

Divider.propTypes = {
  className: PropTypes.string,
  rootPrefixCls: PropTypes.string,
  style: PropTypes.object
};
Divider.defaultProps = {
  // To fix keyboard UX.
  disabled: true,
  className: '',
  style: {}
};
export default Divider;