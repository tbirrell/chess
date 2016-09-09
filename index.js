/**
 * Packages
 */
var express = require('express'),
    app = express();
var bodyParser = require('body-parser');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(mongourl, function(err, db) {
  gameBoard = db.collection('gameboard');
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
app.get('/game/:gamehash/findGame', function (req, res) {
  console.log(req.params);
  var game = req.params.gamehash.substr(0, 10);
  gameBoard.find({
    "gamehash": game
  }).toArray(function(err, result){
    console.log(result);
    res.send(result); // return results
  });
});

app.post('/new/:game/:white/:black', function (req, res) {
  gameBoard.insertOne( {
    gamehash: req.params.game,
    white: req.params.white,
    black: req.params.black,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    lastmove: 'new',
    status: 'new'
  }, function(err, result) {
    assert.equal(err, null);
    console.log("New game inserted");
  });
});

app.put('/game/:gamehash/update', function (req, res) {
  var gamehash = req.params.gamehash.substr(0, 10);

  //update
  gameBoard.update( {
    gamehash: gamehash,
  }, {
    $set: {
      gamehash: gamehash,
      fen: req.body.fen,
      lastmove: req.body.lastmove,
      status: req.body.status
    }
  }, function(err, result) {
    assert.equal(err, null);
    console.log("Game updated");
  });
});
