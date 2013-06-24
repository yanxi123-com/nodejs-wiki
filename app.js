
/*
 * 七日知识管理系统
 * Copyright(c) qiri.com <yanxi@yanxi.com>
 * MIT Licensed
 */
 
var express = require('express'),
    config = require('./config'),
    http = require('http'),
    fs = require('fs'),
    passport = require('./model/passport-qiri').passport,
    qiriError = require('./model/qiri-err'),
    routes = {
        index: require('./routes').index,
        user: require('./routes/user'),
        page: require('./routes/page')
    },
    accessLogfile = fs.createWriteStream('logs/access.log', {flags: 'a'}),
    app = express();

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
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static('public', {maxAge: 1000 * 3600 * 24 * 30}));
  
    app.use(qiriError.qiriErrorHandler);
    app.use(qiriError.errorHandler);
});

// user
app.post('/user/register.json', routes.user.register);
app.post('/user/login.json', routes.user.login);
app.post('/user/logout.json', routes.user.logout);

// check login
app.all("*", routes.user.loadUser);

// user
app.get('/user/setting.html', routes.user.setting);

// index
app.get('/', routes.index);

// page
app.get('/page/add.html', routes.page.add);
app.get('/page/:id/add.html', routes.page.add);
app.post('/page/add.json', routes.page.create);
app.post('/page/remove.json', routes.page.remove);
app.post('/page/update.json', routes.page.update);
app.post('/page/sort.json', routes.page.sort);
app.get('/page/:id', routes.page.show);
app.get('/page/:id/edit', routes.page.edit);
app.get('/page/:rootPageId/setting.html', routes.user.setting);

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

app.locals({
    config: config
});

// console.log(app.routes);
var server = http.createServer(app);
server.setMaxListeners(100);
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

