var express = require('express');
var router = express.Router();

//router.enable('trust proxy');

router.get('/', function(req, res) {
  var response = {
    ipaddress: req.ip,
    language: req.headers['accept-language'].split(',')[0],
    software: req.headers['user-agent'].split(/[()]/)[1]
  };

  res.json(response);
});

module.exports = router;
