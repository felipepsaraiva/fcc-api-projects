require('dotenv').config();

var express = require('express');
var app = express();

var fs = require('fs');
var md = require('markdown-it')();

//Configs
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.enable('trust proxy');

app.use('/timestamp', require('./timestamp'));
app.use('/request-header-parser', require('./request-header-parser'));
app.use('/url-shortener', require('./url-shortener'));
app.use('/image-search', require('./image-search'));
app.use('/file-metadata', require('./file-metadata'));

app.get('/', function(req, res, next) {
  fs.readFile(__dirname + '/README.md', 'utf8', function(err, data) {
    if (err) {
      console.log("Couldn't load README.md", err);
      return next(new Error('Error loading this page!'));
    }

    res.render('index', {body: md.render(data)});
  });
});

//Set 404 error
app.use(function(req, res, next) {
  var err = new Error('404: Page not found!');
  err.status = 404;

  next(err);
});

//Error Handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send(err.message);
});

app.listen(app.get('port'));
