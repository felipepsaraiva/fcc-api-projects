const fs = require('fs');
const md = require('markdown-it')();
const shortid = require('shortid');

const express = require('express');
const homeRouter = express.Router();
const apiRouter = express.Router();

const dbPromise = require('../db');

// SQLite error codes
const SQLITE_CONSTRAINT = 19;

homeRouter.get('/', (req, res, next) => {
  fs.readFile(__dirname + '/README.md', 'utf8', (err, data) => {
    if (err) {
      console.log("Couldn't load url-shortener/README.md", err);
      return next(new Error('Error loading this page'));
    }

    res.render('exercise-tracker', { body: md.render(data) });
  });
});

apiRouter.post('/new-user', async (req, res) => {
  if (!(req.body && req.body.username))
    return res.status(400).json({ error: 'Empty username' });

  try {
    const db = await dbPromise;
    const username = req.body.username;

    const result = await db.run('INSERT INTO user(username) VALUES (?)', username);
    res.json({ id: result.lastID, username });
  } catch (e) {
    if (e.errno == SQLITE_CONSTRAINT) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
      console.log('Error creating new user:', e);
    }
  }
});

apiRouter.get('/users', async (req, res) => {
  try {
    const db = await dbPromise;
    const list = await db.all('SELECT * FROM user');
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
    console.log('Error getting users:', e);
  }
});

apiRouter.post('/add', async (req, res) => {
  const userid = Number.parseInt(req.body.userId);
  const description = req.body.description;
  const duration = Number.parseInt(req.body.duration);
  const date = (req.body.date ? new Date(req.body.date) : new Date());

  if (!userid) return res.status(400).json({ error: 'Invalid user id' });
  if (!description) return res.status(400).json({ error: 'Empty description' });
  if (!duration) return res.status(400).json({ error: 'Invalid duration' });

  if (Number.isNaN(date.getTime()))
    return res.status(400).json({ error: 'Invalid date' });

  try {
    const db = await dbPromise;
    const result = await db.run(`
      INSERT INTO exercise(user, description, duration, date)
      VALUES (?, ?, ?, date(?))
    `, userid, description, duration, date.toISOString());

    const infos = await db.get(`
      SELECT user.id, user.username, exercise.description, exercise.duration, exercise.date
      FROM user
      INNER JOIN exercise ON user.id = exercise.user
      WHERE exercise.id = ?
    `, result.lastID);

    res.json(infos);
  } catch (e) {
    if (e.errno == SQLITE_CONSTRAINT) {
      res.status(400).json({ error: 'Invalid user id' });
    } else {
      res.status(500).json({ error: 'Server error' });
      console.log('Error adding exercise:', e);
    }
  }
});

apiRouter.get('/log', async (req, res) => {
  const userid = req.query.userId;
  const from = new Date(req.query.from || 'a');
  const to = new Date(req.query.to || 'a');
  const limit = Number.parseInt(req.query.limit);

  if (!userid) return res.status(400).json({ error: 'Invalid user id' });

  let params = [userid];
  let logQuery = 'SELECT id, description, duration, date FROM exercise WHERE user = ?';

  if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime())) {
    logQuery += ' AND date BETWEEN date(?) AND date(?)';
    params.push(from.toISOString(), to.toISOString())
  }

  logQuery += ' ORDER BY date ASC';

  if (!Number.isNaN(limit)) {
    logQuery += ' LIMIT ?';
    params.push(limit);
  }

  try {
    const db = await dbPromise;
    const [user, log] = await Promise.all([
      db.get('SELECT id, username FROM user WHERE id = ?', userid),
      db.all(logQuery, params)
    ]);

    if (!user) return res.status(400).json({ error: 'Invalid user id' });

    user.count = log.length;
    user.log = log;
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
    console.log('Error getting log:', e);
  }
});

module.exports = {
  home: homeRouter,
  api: apiRouter
};
