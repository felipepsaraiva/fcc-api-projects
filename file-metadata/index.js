var express = require('express');
var router = express.Router();

var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: 'file-metadata/uploads/' });

router.get('/', function(req, res) {
  fs.readFile(__dirname + '/index.html', 'utf8', function(err, data) {
    if (err) {
      res.type('plain');
      res.status(500).send('Error loading this page!');
      return console.log("Couldn't load file-metadata/index.html", err);
    }

    res.type('html');
    res.send(data);
  });
});

router.post('/', upload.single('fileup'), function(req, res) {
  if (req.file) {
    res.json({ size: req.file.size });
    fs.unlink(__dirname + '/uploads/' + req.file.filename, function(err) {
      if (err) console.log(`Error deleting file ${req.file.filename} from 'file-metadata/uploads'`);
    });
  } else {
    res.send('No file uploaded...');
  }
});

module.exports = router;
