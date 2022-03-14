// Clockwise bot - Example:
function getMove(grid, headPos, heads, state) {
  var dir = Constants.MoveDirection;

  if (validMove(grid, headPos, dir.RIGHT)) return dir.RIGHT;
  if (validMove(grid, headPos, dir.DOWN)) return dir.DOWN;
  if (validMove(grid, headPos, dir.LEFT)) return dir.LEFT;
  if (validMove(grid, headPos, dir.UP)) return dir.UP;

  return dir.RIGHT;
}

function validMove(grid, headPos, move) {
  var nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
  var isOccupied = Grid.isOccupied(grid, nextPos);

  return (isOccupied == false);
  // this works because isOccupied is 
  //    exactly false if the square is free, 
  //    true if occupied, 
  //    undefined if out of bounds
}