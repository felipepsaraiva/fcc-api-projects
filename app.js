var express = require('express');
var app = express();

var fs = require('fs');
var md = require('markdown-it')();

var timestamp = require('./timestamp');
var requestHeaderParser = require('./request-header-parser');
var fileMetadata = require('./file-metadata');

//Configs
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.enable('trust proxy');

app.use('/timestamp', timestamp);
app.use('/request-header-parser', requestHeaderParser);
app.use('/file-metadata', fileMetadata);

app.get('/', function(req, res, next) {
  fs.readFile(__dirname + '/README.md', 'utf8', function(err, data) {
    if (err) {
      console.log("Couldn't load timestamp/README.md", err);
      var error = new Error('Error loading this page!');
      return next(err);
    }

    res.render('index', {body: md.render(data)});
  });
});

//Set 404 error
app.use(function(req, res, next) {
  var err = new Error('Not found!');
  err.status = 404;

  next(err);
});

//Error Handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send(err.message);
});

app.listen(app.get('port'));
