var mongoose = require('mongoose');

var dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useMongoClient: true });

module.exports = mongoose;
