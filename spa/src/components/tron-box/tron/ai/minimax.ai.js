// Clockwise bot - Example:
function getMove(grid, headPos, heads, id, state) {
  var dir = Constants.MoveDirection;

  let gridCopy = Grid.copy(grid, depth = 2);

  minimax(gridCopy, headPos,);

  if (isValidMove(grid, headPos, dir.RIGHT)) return dir.RIGHT;
  if (isValidMove(grid, headPos, dir.DOWN)) return dir.DOWN;
  if (isValidMove(grid, headPos, dir.LEFT)) return dir.LEFT;
  if (isValidMove(grid, headPos, dir.UP)) return dir.UP;

  return dir.RIGHT;
}

function minimax(grid, headPos, id, maximizing = true, depth) {
  if (depth <= 0) return;

  if (maximizing) {
    let bestScore = -Infinity;
    let validMoves = getAdjMoves(grid, headPos);
    for (let move of validMoves) {
      let gridCopy = Grid.copy(grid);
      Grid.setOwner(gridCopy, move, id)
      let score = minimax(gridCopy, headPos, id, false, depth);
    }
  } else {

  }
}

function getAdjMoves(grid, headPos) {
  var dir = Constants.MoveDirection;
  let adj = [];
  if (isValidMove(grid, headPos, dir.UP)) adj.push(headPos.add(dir.UP));
  if (isValidMove(grid, headPos, dir.RIGHT)) adj.push(headPos.add(dir.RIGHT));
  if (isValidMove(grid, headPos, dir.DOWN)) adj.push(headPos.add(dir.DOWN));
  if (isValidMove(grid, headPos, dir.LEFT)) adj.push(headPos.add(dir.LEFT));
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