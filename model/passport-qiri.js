
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
var passport = require('passport')
  , QqStrategy = require('../lib/passport-qq')
  , config = require('../config')
  , mongoUtils = require('../model/mongo-utils')
  , routeUser = require('../routes/user');

var User = mongoUtils.getSchema('User');

var qqLogin = config.get('qqLogin');
if (qqLogin && qqLogin.enabled) {
  passport.use(new QqStrategy({
      clientID: qqLogin.appKey,
      clientSecret: qqLogin.appSecret,
      callbackURL: qqLogin.callback
    }, 
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        var qqUid = profile.id;

        User.findOne({qqUid: qqUid}, function(err, user) {
          if (user) {
            return done(null, user);
          } else {
            User.create({qqUid: qqUid, email: qqUid + "@qq.connect"}, function(err, user) {
              if (err) return done(err);
              routeUser.createRootPage(user, function(err, page){
                return done(err, user);
              });
            });
          }
        });
      });
    })
  );
}

exports.passport = passport;

