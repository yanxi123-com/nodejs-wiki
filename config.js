
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
    defaultPage: "" // 目前无法通过页面创建默认页，只能通过手工操作数据库完成
};

exports.get = function(key) {
    return config[key];
}; 
