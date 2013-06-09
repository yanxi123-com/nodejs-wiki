
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
var express = require('express')
  , config = require('./config')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , passport = require('./model/passport-qiri').passport
  , routes = {
    index: require('./routes').index,
    user: require('./routes/user'),
    page: require('./routes/page')
  };
var accessLogfile = fs.createWriteStream('logs/access.log', {flags: 'a'});

var app = express();

app.configure(function() {
  app.set('port', config.get('port'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
  app.use(express.logger({
    stream: accessLogfile,
    // http://www.senchalabs.org/connect/middleware-logger.html
    format: ":date :method :url :status :res[content-length] - :response-time ms :user-agent"
  }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.get('cookieSecret')));

  app.use(passport.initialize());

  app.use(app.router);
  app.use(express.static('public', {maxAge: 1000 * 3600 * 24 * 30}));
  app.use(require('stylus').middleware(__dirname + '/public'));

  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
});

// user
app.all('/user/register.json', routes.user.register);
app.all('/user/login.json', routes.user.login);
app.all('/user/logout.json', routes.user.logout);

// check login
app.all("*", routes.user.loadUser);

// user
app.all('/user/setting.html', routes.user.setting);

// index
app.get('/', routes.index);

// page
app.get('/page/add.html', routes.page.add);
app.get('/page/:id/add.html', routes.page.add);
app.all('/page/add.json', routes.page.create);
app.all('/page/remove.json', routes.page.remove);
app.all('/page/update.json', routes.page.update);
app.all('/page/sort.json', routes.page.sort);
app.get('/page/:id', routes.page.show);
app.get('/page/:id/edit', routes.page.edit);
app.all('/page/:rootPageId/setting.html', routes.user.setting);

// qq
app.get('/auth/qq', passport.authenticate('qq'));
app.get('/auth/qq/callback', function(req, res, next) {
  passport.authenticate('qq', function(err, user, info) {
    if (err) return next(err);
    routes.user.setLoginCookie(res, user.id);     
    res.redirect('/');
  })(req, res, next);
}); 

// 404
app.use(function(req, res, next){
  res.status(404);
  res.render('error', {title: '页面不存在', visitor: req.visitor});
});

//console.log(app.routes);
var server = http.createServer(app);
server.setMaxListeners(100);
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
