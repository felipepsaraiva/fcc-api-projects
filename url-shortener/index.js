const fs = require('fs');
const md = require('markdown-it')();
const validUrl = require('valid-url');
const shortid = require('shortid');

const express = require('express');
const homeRouter = express.Router();
const apiRouter = express.Router();

const dbPromise = require('../db');

homeRouter.get('/', (req, res, next) => {
  fs.readFile(__dirname + '/README.md', 'utf8', (err, data) => {
    if (err) {
      console.log("Couldn't load url-shortener/README.md", err);
      return next(new Error('Error loading this page'));
    }

    res.render('url-shortener', { body: md.render(data) });
  });
});

const newShortUrl = async (req, res, next) => {
  const url = req.body.url;

  if (!validUrl.isWebUri(url))
    return res.status(400).json({ error: 'Invalid URL' });

  try {
    const db = await dbPromise;

    let result = await db.get('SELECT id, original FROM url WHERE original = ?', url);
    if (result)
      return res.json({
        short_url: req.headers.host + '/api/shorturl/' + result.id,
        original_url: result.original
      });

    const id = shortid.generate();
    await db.run('INSERT INTO url VALUES (?, ?)', id, url);

    result = await db.get('SELECT id, original FROM url WHERE id = ?', id);
    res.json({
      short_url: req.headers.host + '/api/shorturl/' + result.id,
      original_url: result.original
    });
  } catch (e) {
    next(new Error('Server error'));
    console.log('Error creating new short URL:', e);
  }
};

apiRouter.post('/new', newShortUrl);
apiRouter.get('/new/*', (req, res, next) => {
  req.body = { url: req.params[0] };
  next();
}, newShortUrl);

apiRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  if (!shortid.isValid(id))
    return res.status(400).json({ error: 'Invalid short URL' });

  try {
    const db = await dbPromise;

    const result = await db.get('SELECT original FROM url WHERE id = ?', id);
    if (!result)
      return res.status(404).json({ error: 'Short URL does not exist' });

    res.redirect(result.original);
  } catch (e) {
    next(new Error('Server error'));
    console.log('Error fetching original URL:', e);
  }
});

module.exports = {
  home: homeRouter,
  api: apiRouter
};
