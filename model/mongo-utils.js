
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
var mongoose = require('mongoose');
var conn = mongoose.createConnection('mongodb://localhost/qiri?poolSize=10');

var schemas = {
  User: {
    email: String,
    passwordMd5: String,
    rootPageId: String,
    addDate: { type: Date, default: Date.now }
  },
  Page: {
    userId: String,
    title: String,
    content: String,
    parentId: String,
    childIds: [String],
    rootId: String,
    addDate: { type: Date, default: Date.now }
  }
};

var mongoSchemas = (function() {
    var result = {};
    for(var name in schemas) {
        result[name] = conn.model(name,
             mongoose.Schema(schemas[name], {
                 strict: true
             })
        );
    }
    return result;
}());

exports.getSchema = function(name) {
    return mongoSchemas[name];
};

exports.handleErr = function(err, res) {
  if(err) {
    console.log(err);
  }
  if(res) {
    res.json({isOk: err ? 0 : 1});
  }
}
