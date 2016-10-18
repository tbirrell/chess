var chess; //logic
var board; //board
var game; //status

var lastfen;
var lastmove;
var promotionMove = {};

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
  var move = executeMove(source, target)
  if (move === 'snapback') return 'snapback';
  var row = target.substr(target.length - 1);
  if ((peice == 'wP' || peice == 'bP') && (row == 1 || row == 8)) {
    promotionMove.from = source;
    promotionMove.to = target;
    console.log(row);
    console.log('promotion needed');
    $('.promotions').addClass('unhide');
  } else {
    $('#confirm').addClass('unhide');
    $('#undo').addClass('unhide');
  }

}
function executeMove(source, target, promotion) {
  var promotion  = promotion || '';
  var move = chess.move({
    from: source,
    to: target,
    promotion: promotion
  });

  console.log(move);

  if (move === null) return 'snapback';

  lastmove = source + '-' + target;

  game = checkGameStatus();

  return chess.fen();
}

// instantiate game
function setUpGame(fen, player, update = false) {
  //save for undos
  lastfen = fen;

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

function resetPage() {
  $('button').removeClass('unhide');
}
function undoMove() {
  chess.undo();
  board.position(lastfen);
}

function promotePeice(promoteTo) {
  chess.undo();
  var newfen = executeMove(promotionMove.from, promotionMove.to, promoteTo);
  board.position(newfen);
  $('#confirm').addClass('unhide');
  $('#undo').addClass('unhide');
  $('.promotions').removeClass('unhide');
}

$('.promote-btn').click(function(){
  promotePeice($(this)[0].value);
});
$('#confirm').click(function(){
  update(lastmove);
  resetPage();
});
$('#undo').click(function(){
  undoMove();
  resetPage();
});