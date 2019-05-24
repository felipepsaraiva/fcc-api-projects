const sqlite = require('sqlite');

let config = {};
if (process.env.NODE_ENV == 'development')
  config.force = 'last';

module.exports = sqlite.open('./apis.sqlite')
  .then((db) => db.migrate(config))
  .then(async (db) => {
    await db.run('PRAGMA foreign_keys = ON')
    return db;
  });
