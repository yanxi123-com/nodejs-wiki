var _ = require('underscore');
var mongoUtils = require('../model/mongo-utils.js');
var Page = mongoUtils.getSchema('Page');

exports.index = function(req, res) {
  var visitor = req.visitor;

  if (visitor) {
      res.redirect('/page/' + visitor.rootPageId);
      return;
  } else {
      var defaultPage = '51aed8e356beb4212b000002';
      res.redirect('/page/' + defaultPage);
  }
};
