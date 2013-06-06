
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */

var config = {
    port: 3000,
    mongodb: "mongodb://localhost/qiri?poolSize=10",
    cookieSecret: "your secret for cookie",
    pwdSecret: "your secret for pwd"
};

exports.get = function(key) {
    return config[key];
}; 
