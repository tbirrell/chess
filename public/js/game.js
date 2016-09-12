var chess; //logic
var board; //board
var game; //status

var player = {};

// get game id
var gamePath = window.location.pathname;

$.get(gamePath + '/findGame', function(data) {
  var playerHash = gamePath.substr(-5);

  //configure board orientation
  if (playerHash == data[0].white) {
    player = {
      full: 'white',
      abbr: 'w'
    }
  } else if (playerHash == data[0].black) {
    player = {
      full: 'black',
      abbr: 'b'
    }
  }
  console.log(playerHash);
  console.log(data[0]);
  console.log(player);

  //instantiate game
  setUpGame(data[0].fen, player);
});

//functions for board instatiation
var onDragStart = function(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  if (chess.game_over() === true ||
     (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
     (chess.turn() === 'b' && piece.search(/^w/) !== -1) ||
     (chess.turn() != player.abbr)) {
    return false;
  }
}
var onDrop = function(source, target, peice, newPos, oldPos, orientation){
  var move = chess.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  console.log(move);

  if (move === null) return 'snapback'

  game = checkGameStatus();

  var humanMove = move.from + '-' + move.to;

  update(humanMove);
}
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

// instantiate game
function setUpGame(fen, player, update = false) {
  if (!update) {
    //logic
    chess = new Chess(fen);
  }

  var drag = false;
  if (chess.turn() == player.abbr) drag = true;

  //board
  board = ChessBoard('board', {
    position: fen,
    dropOffBoard: 'snapback',
    draggable: drag,
    showNotation: false,
    orientation: player.full,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoverSquare: onMouseoverSquare,
    onMouseoutSquare: onMouseoutSquare
  });
}

function greySquare(square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

function checkGameStatus() {
  if (chess.in_check()) {
    return 'check';
  }
  if (chess.in_checkmate()) {
    return 'checkmate';
  }
  if (chess.in_draw()) {
    return 'draw';
  }
  if (chess.in_stalemate()) {
    return 'stalemate';
  }
  if (chess.insufficient_material()) {
    return 'draw';
  }
  return 'inprogress';
}

function update(lastmove) {
  $.ajax({
    url: gamePath + '/update',
    method: 'PUT',
    data: {
      fen: chess.fen(),
      lastmove: lastmove,
      status: game
    },
    success: function(msg){
      console.log(msg);
      setUpGame(chess.fen(), player, true);
    }
  });
}