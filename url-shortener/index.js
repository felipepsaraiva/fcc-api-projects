var express = require('express');
var router = express.Router();

var fs = require('fs');
var md = require('markdown-it')();
var validUrl = require('valid-url');
var db = require('../db');

var urlSchema = db.Schema({
  original_url: String
});
var Url = db.model('url', urlSchema);

router.get('/', function(req, res) {
  fs.readFile(__dirname + '/README.md', 'utf8', function(err, data) {
    if (err) {
      console.log("Couldn't load url-shortener/README.md", err);
      var error = new Error('Error loading this page!');
      return next(err);
    }

    res.render('index', {body: md.render(data)});
  });
});

router.get('/new/*', function(req, res, next) {
  var url = req.params[0];

  if (!validUrl.isWebUri(url))
    return res.json({
      error: 'Invalid URL'
    });

  Url.find({ original_url: url }, function(err, results) {
    if (!err && results.length > 0) {
      res.json({
        short_url: 'http://' + req.headers.host + '/url-shortener/' + results[0]._id,
        original_url: results[0].original_url
      });
    } else {
      var entry = new Url({
        original_url: url
      });

      entry.save(function(err, entry) {
        if (err)
          return next(err);

        res.json({
          short_url: 'http://' + req.headers.host + '/url-shortener/' + entry._id,
          original_url: entry.original_url
        });
      });
    }
  });
});

router.get('/:id', function(req, res, next) {
  Url.findById(req.params.id, function(err, entry) {
    if (err)
      return next(err);

    if (entry) {
      res.redirect(entry.original_url);
    } else {
      var err = new Error("This URL doesn't exists!");
      err.status = 404;
      next(err);
    }
  });
});

module.exports = router;
