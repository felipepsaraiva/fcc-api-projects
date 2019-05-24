require('dotenv').config();

console.log(`Node Environment: ${process.env.NODE_ENV}`);
console.log('Debug:', process.env.DEBUG);

const fs = require('fs');
const md = require('markdown-it')();
const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const dbPromise = require('./db');

//Configs
app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.enable('trust proxy');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const timestamp = require('./timestamp');
const headerParser = require('./request-header-parser');
const urlShortener = require('./url-shortener');
const exerciseTracker = require('./exercise-tracker');

app.use('/timestamp', timestamp.home);
app.use('/request-header-parser', headerParser.home);
app.use('/url-shortener', urlShortener.home);
app.use('/exercise-tracker', exerciseTracker.home);
app.use('/file-metadata', require('./file-metadata'));
app.use('/image-search', require('./image-search'));

app.use('/api/timestamp', timestamp.api);
app.use('/api/whoami', headerParser.api);
app.use('/api/shorturl', urlShortener.api);
app.use('/api/exercise', exerciseTracker.api);

// Main route
app.get('/', (req, res, next) => {
  fs.readFile(__dirname + '/README.md', 'utf8', (err, data) => {
    if (err) {
      console.log("Couldn't load README.md", err);
      return next(new Error('Error loading this page'));
    }

    res.render('index', { body: md.render(data) });
  });
});

// 404 Not Found Middleware
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;

  next(err);
});

// Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.type('text/plain').status(status).send(status + ': ' + err.message);
});

// Wait database and start app
dbPromise.then((db) => {
  app.listen(app.get('port'), () => {
    console.log(`Server is running on http://localhost:${app.get('port')}\n`);
  });
}).catch((err) => {
  console.log('Could not open database', err);
  process.exit();
});
