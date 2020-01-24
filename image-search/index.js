const express = require('express');
const router = express.Router();

const fs = require('fs');
const md = require('markdown-it')();
const axios = require('axios');
const dbPromise = require('../db');

router.get('/', (req, res, next) => {
  fs.readFile(__dirname + '/README.md', 'utf8', (err, data) => {
    if (err) {
      console.log("Couldn't load image-search/README.md", err);
      return next(new Error('Error loading this page!'));
    }

    res.render('index', { body: md.render(data) });
  });
});

router.get('/search/:search', async (req, res, next) => {
  const search = req.params.search
  const offset = req.query.offset;
  let url = 'https://api.imgur.com/3/gallery/search';
  if (offset) url += `/${offset}`

  try {
    const response = await axios.get(url, {
      params: { q: search },
      responseType: 'json',
      headers: { "authorization": "Client-ID " + process.env.CLIENTID },
    });

    if (!response.data.success)
      throw 'Imgur API error';

    const data = response.data.data;
    const result = [];
    for (let i = 0; i < 20 && i < data.length; i++) {
      result.push({
        url: (data[i].is_album ? data[i].images[0].link : data[i].link),
        description: data[i].title,
        page: (data[i].is_album ? data[i].link : null),
      });
    }

    res.json(result);

    dbPromise.then((db) => db.run('INSERT INTO image_search(search) VALUES (?)', search))
      .catch((e) => console.log('Error saving image search:', e));
  } catch (e) {
    console.log('Error searching image:', e);
    next(new Error('Server error'));
  }
});

router.get('/latest', async (req, res) => {
  try {
    const db = await dbPromise;
    const rows = await db.all(`
      SELECT search, date FROM image_search
      ORDER BY date DESC LIMIT 10
    `);

    res.json(rows.map((row) => ({
      term: row.search,
      when: new Date(row.date).getTime(),
    })));
  } catch (e) {
    console.log('Error getting latest image searches:', e);
    next(new Error('Server error'));
  }
});

module.exports = router;
