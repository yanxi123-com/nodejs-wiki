
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */

var _ = require('underscore');

/**
 * @api private
 * @inherits Error https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error
 * new QiriError([msg], [status])
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
        }
    });
}

/*!
 * Inherits from Error.
 */
QiriError.prototype.__proto__ = Error.prototype;

QiriError.prototype.getMsg = function() {
    if (!this._msg) {
        switch(this._status) {
            case 403:
                this._msg = "没有权限";
                break;
            case 404:
                this._msg = "页面不存在";
                break;
            default:
                this._msg = "内部错误";
        }
    }
    return this._msg;
};

QiriError.prototype.getStatus = function() {
    return this._status || 500;
};

/*!
 * Module exports.
 */
module.exports = exports = QiriError;

exports.qiriErrorHandler = function(err, req, res, next) {
    if (err.constructor !== QiriError) {
        return next(err);
    }
    if (req.xhr) {
        res.send({ error: err.getMsg() });
    } else {
        res.status(err.getStatus());
        res.render('error', { title: err.getMsg(), visitor: req.visitor });
    }
};

exports.errorHandler = function(err, req, res, next) {
    console.error(err.stack);
    if (req.xhr) {
        res.send({ error: "内部错误" });
    } else {
        res.status(500);
        res.render('error', { title: "内部错误", visitor: req.visitor });
    }
};
