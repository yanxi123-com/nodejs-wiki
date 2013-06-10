
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */

var _ = require('underscore');

/**
 * @api private
 * @inherits Error https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error
 * QiriError(err)
 * QiriError(msg)
 * QiriError(status)
 * QiriError(msg, status)
 */

function QiriError() {
  this.name = 'QiriError';
  var self = this;
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  _(arguments).each(function(arg) {
    if (arg.constructor === String) {
      self._msg = arg;
    } else if (arg.constructor === Number) {
      self._status = arg;
    } else if (arg.stack) {
      console.error(arg.stack);
    }
  });
}

/*!
 * Inherits from Error.
 */
QiriError.prototype.__proto__ = Error.prototype;

QiriError.prototype.getMsg = function() {
  if (!this._msg) {
    if (this._status == 403) this._msg = "没有权限";
    else if (this._status == 404) this._msg = "页面不存在";
  }
  return this._msg || "内部错误";
};

QiriError.prototype.getStatus = function() {
  return this._status || 500;
};

/*!
 * Module exports.
 */
module.exports = exports = QiriError;

