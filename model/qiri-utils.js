
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
var _ = require('underscore');

exports.ready = function() {
    return _(arguments).every(function(arg, index) {
        var isDefined = ! _.isUndefined(arg);
        if (0) {
            console.log("arguments[" + index + "]:");
            console.log("    arg=" + arg)
            console.log("    typeof=" + typeof arg)
            console.log("    isDefined=" + isDefined)
        }
        return isDefined;
    });
};

