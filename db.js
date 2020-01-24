const sqlite = require('sqlite');

const migrationConfig = {};
if (process.env.DB_FORCE_MIGRATION == 'true')
  migrationConfig.force = 'last';

module.exports = sqlite.open(process.env.DB_URL)
  .then((db) => db.migrate(migrationConfig))
  .then(async (db) => {
    await db.run('PRAGMA foreign_keys = ON')
    return db;
  });
