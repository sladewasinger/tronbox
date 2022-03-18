// minimax bot - ASW:
function getMove(grid, headPos, myTrailId, trails, state) {
  var dir = Constants.MoveDirection;

  let opponent = trails.find(x => x.id != myTrailId);

  let bestScore = calculateScore(grid, headPos);
  let validMoves = getAdjMoves(grid, headPos);
  let move = validMoves[0] || dir.UP;
  for (var validMove of validMoves) {
    //console.log("tesing move:", validMove, " head pos", headPos, " opp: ", opponent.head);
    let gridCopy = Grid.copy(grid);
    //Grid.setOwner(gridCopy, headPos, myTrailId);
    Grid.setOwner(gridCopy, headPos.add(validMove), myTrailId);
    if (distance(headPos.add(validMove), opponent.head) <= 1.1) {
      //console.log("********************* Alert!");
      continue;
    }
    let score = minimax(gridCopy, headPos.add(validMove), myTrailId, opponent.head, opponent.id, 3, trails, true);
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
  return dis;
}

function minimax(grid, headPos, myId, opponentHeadPos, opponentId, depth, trails, maximizing = true) {
  // TODO: Check for winner first?

  if (maximizing) {
    if (depth < 0) return calculateScore(grid, myId);

    let bestScore = -Infinity;
    //console.log('.'.repeat(2 - depth) + "[MAX] headPos: ", headPos, ' opp: ', opponentHeadPos);
    let validMoves = getAdjMoves(grid, headPos);
    for (let move of validMoves) {
      //console.log('.'.repeat(2 - depth) + '[MAX] test move', move, " head pos ", headPos.add(move), " opponent: ", opponentHeadPos);
      let dis = distance(headPos.add(move), opponentHeadPos);
      if (dis < 1) {
        if (calculateScore(grid, myId) <= calculateScore(grid, opponentId)) {
          //console.log("[MAX] potential death", headPos.add(move), opponentHeadPos);
          bestScore -= 2;
        }
      }
      let gridCopy = Grid.copy(grid);
      let score = minimax(gridCopy, headPos.add(move), myId, opponentHeadPos, opponentId, depth - 1, trails, false);
      Grid.setOwner(gridCopy, headPos.add(move), myId)
      bestScore = Math.max(score, bestScore);
      //console.log('MAX best score ', bestScore);
    }
    return bestScore;
  } else {
    if (depth < 0) return calculateScore(grid, myId);

    let bestScore = Infinity;
    //console.log('.'.repeat(2 - depth) + "[min] headPos: ", headPos, ' opp: ', opponentHeadPos);
    let validMoves = getAdjMoves(grid, opponentHeadPos);
    if (validMoves.length < 1) {
      //console.log("[min] no valid moves headPos: ", headPos, " opponentHeadPos: ", opponentHeadPos);
      return 0;
    }
    for (let move of validMoves) {
      //console.log('.'.repeat(2 - depth) + '[min] test move', move, " head pos ", headPos, " opp: ", opponentHeadPos.add(move));
      let dis = distance(headPos, opponentHeadPos.add(move));
      if (dis <= 1.1) { // if dis == 1 then we are adj and cannot die.
        if (calculateScore(grid, myId) >= calculateScore(grid, opponentId)) {
          //console.log("[MIN] potential death", headPos, opponentHeadPos.add(move));
          bestScore += 1;
          break;
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