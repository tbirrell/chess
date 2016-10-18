//this file handle the look and layout of the board using chess.js and chessboard.js

var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
  var moves = chess.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  // exit if not your turn
  if (chess.turn() != player.abbr) return;
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
}
var onMouseoutSquare = function(square, piece) {
  //remove grey squares
  $('#board .square-55d63').css('background', '');
}

function greySquare(square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

