const fs = require('fs');
const md = require('markdown-it')();
const upload = require('multer')({ dest: __dirname + '/uploads/' });

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  fs.readFile(__dirname + '/README.md', 'utf8', (err, data) => {
    if (err) {
      console.log("Couldn't load file-metadata/README.md", err);
      return next(new Error('Error loading this page'));
    }

    res.render('file-metadata', { body: md.render(data) });
  });
});

router.post('/', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    const err = new Error('No file uploaded');
    err.status = 400;
    return next(err);
  }

  res.json({
    name: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype
  });

  fs.unlink(__dirname + '/uploads/' + req.file.filename, (err) => {
    if (!err) return;
    console.log(`Error deleting file '${req.file.filename}' from 'file-metadata/uploads'`);
  });
});

module.exports = router;
