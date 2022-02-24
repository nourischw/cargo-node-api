var express = require('express');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
var passport = require('passport');
// var kue = require('kue');
var config = require('config.js');
var routersV1 = require('controllers/v1');
var dbURI = `mongodb://${config.db.uri}/${config.db.database}`;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept Auth, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).send();
  next();
});

// app.use(passport.initialize());
// app.use(passport.session());

app.use('/v1', routersV1);

app.listen(config.server.port);
console.info(`Server is listeninng on port: ${config.server.port}`);

// kue.app.listen(config.kue.ui.port);
// console.info(`Kue UI is listeninng on port: ${config.kue.ui.port}`);

mongoose.connect(dbURI, config.db.options, (err) => {
  if (err) {
    console.info('Mongodb connnect error.');
    console.error(err);
    process.exitCode = 1;
  }
  console.info('Mongodb connected.');
});

mongoose.connection.on('error', (err) => {
  console.info('Mongoose default connection has occured error.');
  console.error(err);
  process.exitCode = 1;
});

mongoose.connection.on('disconnected', () => {
  console.info('Mongoose default connection is disconnected');
  process.exitCode = 1;
});
