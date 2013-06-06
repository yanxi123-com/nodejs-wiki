
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
  , mongoose = require('mongoose');
var accessLogfile = fs.createWriteStream('logs/access.log', {flags: 'a'});

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

//console.log(app.routes);
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
