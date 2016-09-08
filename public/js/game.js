// instantiate board
var board = ChessBoard('board', 'start');

// get game id
var gamePath = window.location.pathname;

$.get(gamePath + '/findGame', function(data) {
  //instantiate game
  setUpGame(data);
});

function setUpGame(fen) {
  board = ChessBoard('board', {
    position: fen,
    draggable: true,
    dropOffBoard: 'trash'
  });
}