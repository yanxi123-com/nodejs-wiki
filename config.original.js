
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
    defaultPage: "", // 目前只能通过手工更新 mongodb，设置 page.rootId 为空来创建公开的页面
    qqLogin: {
        enabled: false,
        appKey: "",
        appSecret: "",
        callback: "http://your-domain.com/auth/qq/callback"
    }
};

exports.get = function(key) {
    return config[key];
}; 
