
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
var _ = require('underscore'),
    config = require('../config');
var mongoUtils = require('../model/mongo-utils.js');
var Page = mongoUtils.getSchema('Page');

exports.index = function(req, res) {
  var visitor = req.visitor;

  if (visitor) {
      res.redirect('/page/' + visitor.rootPageId);
      return;
  } else {
      res.redirect(config.get('defaultPage') || '/user/setting.html');
  }
};
