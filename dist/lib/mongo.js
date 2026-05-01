"use strict";

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB database');
});
module.exports = db;
//# sourceMappingURL=mongo.js.map