var mongoose = require('mongoose');

var dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true });

module.exports = mongoose;
