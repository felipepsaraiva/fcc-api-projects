const fs = require('fs');
const md = require('markdown-it')();

const express = require('express');
const homeRouter = express.Router();
const apiRouter = express.Router();

homeRouter.get('/', (req, res, next) => {
  fs.readFile(__dirname + '/README.md', 'utf8', (err, data) => {
    if (err) {
      console.log("Couldn't load timestamp/README.md", err);
      return next(new Error('Error loading this page'));
    }

    res.render('index', { body: md.render(data) });
  });
});

apiRouter.get('/timestamp/:date?', (req, res) => {
  let timestamp, date = req.params.date;

  if (!date) {
     timestamp = Date.now();
  } else {
    timestamp = Number(date);
    if (Number.isNaN(timestamp))
      timestamp = Date.parse(date);
  }

  if (Number.isNaN(timestamp))
    return res.json({ error: "Invalid Date" });

  date = new Date(timestamp);
  res.json({
    unix: timestamp,
    utc: date.toUTCString()
  });
});

module.exports = {
  home: homeRouter,
  api: apiRouter
};
