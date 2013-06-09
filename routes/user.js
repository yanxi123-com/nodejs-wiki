
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
var _s = require('underscore.string');
var config = require('../config');
var crypto = require('crypto');
var mongoUtils = require('../model/mongo-utils.js');
var User = mongoUtils.getSchema('User');
var Page = mongoUtils.getSchema('Page');

var getPwdMd5 = function(password) {
    var pwd = password + config.get('pwdSecret'); 
    return crypto.createHash('md5').update(pwd).digest('hex');
};

var setLoginCookie = function(res, userId) {
  res.cookie('userId', userId, { maxAge: 30 * 24 * 3600 * 1000, signed: true})
}

var createRootPage = function(visitor, done) {
    done = done || function(err) {console.log(err)};
    Page.create({
        userId: visitor.id,
        parentId: visitor.id,
        title: "首页",
        content: "点击右上角图标，可以选择编辑本页面，增加新页面。"
    }, function(err, page) {
        if (err) {
          done(err);
        } else {
            User.findOneAndUpdate({
                _id: visitor.id,
              }, {
                $set: {rootPageId: page.id}
              }, function(err){
                done(err, page);
              }
            );
        }
    });
};

exports.setLoginCookie = setLoginCookie;
exports.createRootPage = createRootPage;

exports.login = function(req, res) {
  var email = req.param('email') || "";
  var password = req.param('password') || "";
  User.findOne({
      email: email,
      passwordMd5: getPwdMd5(password)
    }, "rootPageId",
    function(err, doc) {
      if (err) {
        mongoUtils.handleErr(err, res);
        return;
      } else {
        if(doc) {
          setLoginCookie(res, doc.id);
          res.json({isOk: 1, visitor: doc});
        } else {
          res.json({isOk: 0, errMsg:'邮箱不正确或者密码错误'});
        }
      }
    }
  );
};

exports.logout = function(req, res) {
  res.clearCookie('userId');
  return res.json({isOk: 1});
};

exports.register = function(req, res) {
  var email = _s.trim(req.param('email')) || "";
  var password = _s.trim(req.param('password')) || "";

  if (!email.match(/^[\w\.-]+@[\w\.-]+\.[a-z]{2,4}$/)) {
    res.json({isOk: 0, errMsg: '邮箱不符合要求'});
    return;
  }
  if (password.length<4) {
    res.json({isOk: 0, errMsg: '密码不能小于4个字符'});
    return;
  }

  User.findOne({
      email: email,
    },
    function(err, doc) {
      if(err) {
        console.log(err);
        res.json({isOk: 0});
        return;
      }
      if(doc)
        res.json({isOk: 0, errMsg: "用户已存在"});
      else {
        User.create({
          email: email,
          passwordMd5: getPwdMd5(password)
        }, function(err, user) {
          mongoUtils.handleErr(err);
          if(!err) {
            createRootPage(user, function(err, page) {
              if (err) {
                mongoUtils.handleErr(err);
                res.json({isOk: 0});
              } else {
                setLoginCookie(res, user.id);
                res.json({isOk: 1, rootPageId: page.id});
              }
            });
          }
        });
      }
    }
  );
};

exports.setting = function(req, res) {
  var visitor = req.visitor;

  res.render('user-setting', {
    visitor: visitor
  });
}

exports.loadUser = function(req, res, next) {
  var userId = req.signedCookies.userId;
  User.findById(userId, function(err, doc) {
    mongoUtils.handleErr(err);
    if(doc) {
      req.visitor = doc;
    }
    next();
  });
};

