/**
 * Packages
 */
var express = require('express'),
    app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var favicon = require('serve-favicon');
var chess = require('./public/bower_components/chess.js/chess.min.js')

/**
 * Environment Varibles
 */
var port = process.env.PORT || 3000;
var mongourl = process.env.MONGO_URL || 'mongodb://localhost:27017/chess';

/**
 * Database Varibles
 */
var gameBoard;
var player;

/**
 * Initiating App and DB
 */
app.use(express.static('public'));
app.use(favicon(__dirname + '/favicon.ico'));

MongoClient.connect(mongourl, function(err, db) {
  gameBoard = db.collection('gameboard');
  player = db.collection('gameboard');
});

app.listen(port, function(){
  console.log('App listening on port ' + port);
});

/**
 * Listens for page loads
 */
app.get('/', function (req, res) {
  var fileName = 'home.html';
  var options = {
    root: __dirname + '/public/'
  };
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
      process.exit();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
});

app.get('/game/:gamehash', function (req, res) {
  var fileName = 'game.html';
  var options = {
    root: __dirname + '/public/'
  };
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
      process.exit();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
});

/**
* Listens to Browser
*/
app.put('/new/:white/:black', function (req, res) {

});