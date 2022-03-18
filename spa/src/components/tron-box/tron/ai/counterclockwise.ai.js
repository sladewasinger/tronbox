// Counter-Clockwise bot - Example:
function getMove(grid, headPos, myTrailId, trails, state) {
  var dir = Constants.MoveDirection;

  // Store persistent data in the state object:
  state.counter = state.counter || 0;
  state.counter++;
  // console.log(state.counter);

  if (isValidMove(grid, headPos, dir.LEFT)) return dir.LEFT;
  if (isValidMove(grid, headPos, dir.DOWN)) return dir.DOWN;
  if (isValidMove(grid, headPos, dir.RIGHT)) return dir.RIGHT;
  if (isValidMove(grid, headPos, dir.UP)) return dir.UP;

  return dir.RIGHT;
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