"use strict";

$('#newgame').click(function(){
  //show inputs
  $('.links').removeClass('hidden');

  //create links
  var game = createNewGame();
  var baseLink = window.location.origin + '/game/' + game.hash;

  //show links
  $('.links#white').val(baseLink + game.playerWhite);
  $('.links#black').val(baseLink + game.playerBlack);

  addToDatabase(game);
});

function createNewGame() {
  var text = [];
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i=0; i < 4; i++ ) {
    text[i] = '';
    for( var j=0; j < 5; j++ ) {
      text[i] += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }
  var game = {
    'hash': text[0] + text[1],
    'playerWhite': text[2],
    'playerBlack': text[3]
  };
  return game;
}

function addToDatabase(game) {
  $.post('/new/' + game.hash + '/' + game.playerWhite + '/' + game.playerBlack);
}