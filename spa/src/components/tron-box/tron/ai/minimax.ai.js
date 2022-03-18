
// minimax bot - ASW:
function getMove(grid, headPos, myTrailId, trails, state) {
  var dir = Constants.MoveDirection;

  let opponent = trails.find(x => x.id != myTrailId);

  let bestScore = -Infinity;
  let move = dir.UP;
  let validMoves = getAdjMoves(grid, headPos);
  for (var validMove of validMoves) {
    //console.log("tesing move:", validMove, " head pos", headPos);

    let gridCopy = Grid.copy(grid);
    Grid.setOwner(gridCopy, headPos.add(validMove), myTrailId);
    let score = minimax(gridCopy, headPos.add(validMove), myTrailId, opponent.head, opponent.id, 5, trails, false);
    if (score > bestScore) {
      //console.log("picking move ", validMove, " for score: ", score);
      bestScore = score;
      move = validMove;
    }
  }
  //console.log("Returning move:", move);
  //console.log("======================");

  return move;

  if (isValidMove(grid, headPos, dir.RIGHT)) return dir.RIGHT;
  if (isValidMove(grid, headPos, dir.DOWN)) return dir.DOWN;
  if (isValidMove(grid, headPos, dir.LEFT)) return dir.LEFT;
  if (isValidMove(grid, headPos, dir.UP)) return dir.UP;

  return dir.RIGHT;
}

function distance(pos1, pos2) {
  let dis = Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
  //console.log(dis);
  return dis;
}

function minimax(grid, headPos, myId, opponentHeadPos, opponentId, depth, trails, maximizing = true) {
  // Check winner?
  /* if (trails)
  */
  if (maximizing) {
    if (depth <= 0) return calculateScore(grid, myId);

    let bestScore = -Infinity;
    let validMoves = getAdjMoves(grid, headPos);
    for (let move of validMoves) {
      //console.log('MAXimizing move', move, " head pos ", headPos.add(move));
      if (distance(headPos, opponentHeadPos) <= 2.1) {
        //console.log("[MAX] Dis < 1");
        if (calculateScore(grid, myId) <= calculateScore(grid, opponentId)) {
          //console.log("Punishing move?");
          bestScore -= 1;
        }
      }

      let gridCopy = Grid.copy(grid);
      Grid.setOwner(gridCopy, headPos.add(move), myId)
      let score = minimax(gridCopy, headPos.add(move), myId, opponentHeadPos, opponentId, depth - 1, trails, false);
      bestScore = Math.max(score, bestScore);
      //console.log('MAX best score ', bestScore);
    }
    return bestScore;
  } else {
    if (depth <= 0) return calculateScore(grid, myId);

    let bestScore = Infinity;
    let validMoves = getAdjMoves(grid, opponentHeadPos);
    for (let move of validMoves) {
      //console.log('minimizing move', move, " head pos ", opponentHeadPos.add(move));
      if (distance(headPos, opponentHeadPos) <= 2.1) {
        //console.log("[MAX] Dis < 1");
        if (calculateScore(grid, myId) > calculateScore(grid, opponentId)) {
          bestScore += 1;
        }
      }

      let gridCopy = Grid.copy(grid);
      Grid.setOwner(gridCopy, opponentHeadPos.add(move), opponentId)
      let score = minimax(gridCopy, headPos, myId, opponentHeadPos.add(move), opponentId, depth - 1, trails, true);
      bestScore = Math.min(score, bestScore);
      //console.log('min best score ', bestScore);
    }
    return bestScore;
  }
}

function calculateScore(grid, id) {
  let score = Grid
    .flatten(grid)
    .filter(x => x.id == id)
    .length;
  //console.log(`[${id}] score: ${score}`);
  return score;
}

function getAdjMoves(grid, headPos) {
  var dir = Constants.MoveDirection;
  let adj = [];
  if (isValidMove(grid, headPos, dir.UP)) adj.push(dir.UP);
  if (isValidMove(grid, headPos, dir.RIGHT)) adj.push(dir.RIGHT);
  if (isValidMove(grid, headPos, dir.DOWN)) adj.push(dir.DOWN);
  if (isValidMove(grid, headPos, dir.LEFT)) adj.push(dir.LEFT);
  return adj;
}

function isValidMove(grid, headPos, move) {
  var nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
  var isOccupied = Grid.isOccupied(grid, nextPos);

  return (isOccupied == false);
  // this works because isOccupied is 
  //    exactly false if the square is free, 
  //    true if occupied, 
  //    undefined if out of bounds
}

function isValidMove2(grid, headPos, move) {
  var nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
  var isOccupied = Grid.isOccupied(grid, nextPos);

  return (isOccupied == false);
  // this works because isOccupied is 
  //    exactly false if the square is free, 
  //    true if occupied, 
  //    undefined if out of bounds
}