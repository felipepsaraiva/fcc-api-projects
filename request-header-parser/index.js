const fs = require('fs');
const md = require('markdown-it')();

const express = require('express');
const homeRouter = express.Router();
const apiRouter = express.Router();

homeRouter.get('/', (req, res, next) => {
  fs.readFile(__dirname + '/README.md', 'utf8', (err, data) => {
    if (err) {
      console.log("Couldn't load request-header-parser/README.md", err);
      return next(new Error('Error loading this page'));
    }

    res.render('index', { body: md.render(data) });
  });
});

apiRouter.get('/whoami', (req, res) => {
  res.json({
    ipaddress: req.ip,
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  });
});

module.exports = {
  home: homeRouter,
  api: apiRouter
};
