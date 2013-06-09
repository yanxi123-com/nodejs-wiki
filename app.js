
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
var express = require('express')
  , config = require('./config')
  , routes = require('./routes')
  , user = require('./routes/user')
  , page = require('./routes/page')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , passport = require('passport')
  , QqStrategy = require('passport-qq').Strategy
var accessLogfile = fs.createWriteStream('logs/access.log', {flags: 'a'});

var qqLogin = config.get('qqLogin');
var qqLoginEnabled = qqLogin && qqLogin.enabled;
if (qqLoginEnabled) {
  passport.use(new QqStrategy({
      clientID: qqLogin.appKey,
      clientSecret: qqLogin.appSecret,
      callbackURL: qqLogin.callback
    }, 
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's qq profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the qq account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    })
  );
}

var app = express();

// all environments
app.set('port', config.get('port'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));

// logger
// http://www.senchalabs.org/connect/middleware-logger.html
var format = ":date :method :url :status :res[content-length] - :response-time ms :user-agent";
app.use(express.logger({stream: accessLogfile, format: format}));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.get('cookieSecret')));
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 1000 * 3600 * 24 * 30}));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
app.use(passport.initialize());
app.use(passport.session());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// user
app.all('/user/register.json', user.register);
app.all('/user/login.json', user.login);
app.all('/user/logout.json', user.logout);

// check login
app.all("*", user.loadUser);

// user
app.all('/user/setting.html', user.setting);

// index
app.get('/', routes.index);

// page
app.get('/page/add.html', page.add);
app.get('/page/:id/add.html', page.add);
app.all('/page/add.json', page.create);
app.all('/page/remove.json', page.remove);
app.all('/page/update.json', page.update);
app.all('/page/sort.json', page.sort);
app.get('/page/:id', page.show);
app.get('/page/:id/edit', page.edit);
app.all('/page/:rootPageId/setting.html', user.setting);

// qq
app.get('/auth/qq',
  passport.authenticate('qq'),
  function(req, res){
// The request will be redirected to qq for authentication, so this
// function will not be called.
});
app.get('/auth/qq/callback', 
  passport.authenticate('qq', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

// 404
app.use(function(req, res, next){
  res.status(404);
  res.render('error', {title: '页面不存在', visitor: req.visitor});
});

//console.log(app.routes);
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
