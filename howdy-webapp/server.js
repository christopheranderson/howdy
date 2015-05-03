
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , partners = require('./routes/partners')
  , http = require('http')
  , path = require('path')
  , appInsights = require('applicationinsights');

// todo: set the iKey as an environment variable in azure
appInsights.setup("bf14806e-9acc-4572-a49d-4e1f8a49f9d8").start();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
partners(app);

http.createServer(app).listen(app.get('port'), function(){
  appInsights.client.trackEvent("Server start", {port: app.get('port')});
  console.log("Express server listening on port " + app.get('port'));
});
