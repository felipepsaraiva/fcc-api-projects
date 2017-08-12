var express = require('express');
var router = express.Router();

var fs = require('fs');
var md = require('markdown-it')();

var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

router.get('/', function(req, res) {
  fs.readFile(__dirname + '/README.md', 'utf8', function(err, data) {
    if (err) {
      res.type('plain');
      res.status(500).send('Error loading this page!');
      return console.log("Couldn't load timestamp/README.md", err);
    }

    res.render('index', {body: md.render(data)});
  });
});

router.get('/:date', function(req, res) {
  var date = req.params.date, timestamp;

  if ( Number.isNaN(Number(date)) )
    timestamp = Date.parse(date);
  else
    timestamp = Number(date);

  if (Number.isNaN(timestamp))
    return res.send('Invalid Date...');

  date = new Date(timestamp);
  var obj = {
    unix: timestamp,
    natural: month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
  };

  obj.natural = month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  res.json(obj);
});

module.exports = router;
