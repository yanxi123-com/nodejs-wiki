
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
var _s = require('underscore.string')
  , config = require('../config')
  , crypto = require('crypto')
  , mongoUtils = require('../model/mongo-utils.js')
  , User = mongoUtils.getSchema('User')
  , Page = mongoUtils.getSchema('Page')
  , QiriError = require('../model/qiri-err');

var getPwdMd5 = function(password) {
    var pwd = password + config.get('pwdSecret'); 
    return crypto.createHash('md5').update(pwd).digest('hex');
};

var setLoginCookie = function(res, userId) {
  res.cookie('userId', userId, { maxAge: 30 * 24 * 3600 * 1000, signed: true})
}

var createRootPage = function(visitor, done) {
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

exports.login = function(req, res, next) {
  var email = req.param('email') || "";
  var password = req.param('password') || "";
  User.findOne({
      email: email.toLowerCase(),
      passwordMd5: getPwdMd5(password)
    },
    function(err, doc) {
      if (err) {
        return next(new QiriError(err));
      } 
      if(doc) {
        setLoginCookie(res, doc.id);
        res.json({visitor: doc});
      } else {
        return next(new QiriError('邮箱不正确或者密码错误'));
      }
    }
  );
};

exports.logout = function(req, res, next) {
  res.clearCookie('userId');
  return res.json({});
};

exports.register = function(req, res, next) {
  var email = _s.trim(req.param('email')) || "";
  var password = _s.trim(req.param('password')) || "";

  if (!email.match(/^[\w\.-]+@[\w\.-]+\.[a-z]{2,4}$/)) {
    return next(new QiriError('邮箱不符合要求'));
  }
  if (password.length<4) {
    return next(new QiriError('密码不能小于4个字符'));
  }

  User.findOne({
      email: email.toLowerCase(),
    },
    function(err, doc) {
      if (err) {
        return next(new QiriError(err));
      } 
      if(doc) {
        return next(new QiriError('用户已存在'));
      }
      User.create({
        email: email.toLowerCase(),
        passwordMd5: getPwdMd5(password)
      }, function(err, user) {
        if (err) {
          return next(new QiriError(err));
        } 
        createRootPage(user, function(err, page) {
          if (err) {
            return next(new QiriError(err));
          } 
          setLoginCookie(res, user.id);
          res.json({rootPageId: page.id});
        });
      });
    }
  );
};

exports.setting = function(req, res, next) {
  var visitor = req.visitor;
  var rootPages;
  var vender = function() {
    res.render('user-setting', {
      visitor: visitor,
      rootPages: rootPages
    });
  }
  
  if (visitor == null) {
    vender();
  } else {
    Page.find({parentId: visitor.id}, "title", function(err, docs) {
      rootPages = docs;
      vender();
    }); 
  }

};

exports.loadUser = function(req, res, next) {
  var userId = req.signedCookies.userId;
  User.findById(userId, function(err, doc) {
    if (err) {
      return next(new QiriError(err));
    } 
    if(doc) {
      req.visitor = doc;
    }
    next();
  });
};

