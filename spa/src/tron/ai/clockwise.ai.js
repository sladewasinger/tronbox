import { Constants } from "../models/Constants";
import { Point } from "../models/Point";
import { Grid } from "../models/GridExtensions";

export function ai_Clockwise_v1(grid, headPos) {
  var move = Constants.MoveDirection.RIGHT;
  var nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
  if (headPos.x + 1 >= grid.length || Grid.isOccupied(grid, nextPos)) {
    move = Constants.MoveDirection.DOWN;
    nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
    if (headPos.y + 1 >= grid[0].length || Grid.isOccupied(grid, nextPos)) {
      move = Constants.MoveDirection.LEFT;
      nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
      if (headPos.x - 1 < 0 || Grid.isOccupied(grid, nextPos)) {
        move = Constants.MoveDirection.UP;
        nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
        if (headPos.y - 1 < 0 || Grid.isOccupied(grid, nextPos)) {
          // move = MoveDirection.STALL;
          // we're about to die...
        }
      }
    }
  }
  return move;
}