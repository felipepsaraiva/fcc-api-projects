var express = require('express');
var router = express.Router();

var fs = require('fs');
var md = require('markdown-it')();
var http = require('https');
var db = require('../mongodb');

var searchSchema = db.Schema({
  term: String,
  when: Number
});
var Search = db.model('image-search', searchSchema);

router.get('/', function(req, res) {
  fs.readFile(__dirname + '/README.md', 'utf8', function(err, data) {
    if (err) {
      console.log("Couldn't load image-search/README.md", err);
      return next(new Error('Error loading this page!'));
    }

    res.render('index', { body: md.render(data) });
  });
});

router.get('/search/:search', function(req, res) {
  var search = req.params.search, offset = req.query.offset;
  var options = {
    "method": "GET",
    "hostname": "api.imgur.com",
    "path": "/3/gallery/search" + (offset ? `/${offset}` : '') + "?q=" + search,
    "headers": {
      "authorization": "Client-ID " + process.env.CLIENTID
    }
  };

  var request = http.request(options, function (response) {
    var chunks = [];
    response.on("data", function (chunk) {
      chunks.push(chunk);
    });

    response.on("end", function () {
      var body = JSON.parse(Buffer.concat(chunks)), results = [], result;
      for (var i=0 ; i<20 && i< body.data.length ; i++) {
        result = body.data[i];
        results.push({
          url: (result.is_album ? result.images[0].link : result.link),
          description: result.title,
          page: (result.is_album ? result.link : null)
        });
      }
      res.json(results);
    });
  });

  request.end();

  new Search({
    term: search,
    when: Date.now()
  }).save(function(err) {
    if (err)
      console.err('Error saving search: ', err);
  });
});

router.get('/latest', function(req, res) {
  Search.find({}, '-_id term when', { sort: { when: -1 }, limit: 10 }, function(err, results) {
    res.json(results);
  });
});

module.exports = router;
