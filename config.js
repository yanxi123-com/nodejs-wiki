
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */

var config = {
    port: 3000,
    mongodb: "mongodb://localhost/qiri?poolSize=10",
    cookieSecret: "your secret for cookie",
    pwdSecret: "your secret for pwd",
    defaultPage: "" // 目前通过页面无法创建公开的页面，只能通过手工更新页面的 rootId 为空来创建
};

exports.get = function(key) {
    return config[key];
}; 
