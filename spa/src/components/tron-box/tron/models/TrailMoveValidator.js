import { Point } from "./Point";
import { Grid } from "./Grid.Extensions";

export class TrailMoveValidator {
    static isValidMoveDir(grid, trail, moveDir, trails) {
        if (!moveDir || moveDir.x == undefined || moveDir.y == undefined) {
            return [false, ["Error - moveDir is not a valid Point object. Killing trail. moveDir supplied:", moveDir]];
        }
        if (!Object.keys(Constants.MoveDirection).map(key => Constants.MoveDirection[key]).some(x => moveDir.x == x.x && moveDir.y == x.y)) {
            return [false, ["Invalid move supplied! Killing trail. Move supplied: ", moveDir]];
        }

        let move = new Point(trail.head.x + moveDir.x, trail.head.y + moveDir.y);
        if ((move.x < 0 || move.x >= grid.length) ||
            (move.y < 0 || move.y >= grid[move.x].length)) {
            return [false, [`%cTRAIL [${trail.id}] %ctried to escape the grid! They failed...`, 'color: ' + trail.color, 'color: auto']];
        }
        if (Grid.isOccupied(grid, move)) {
            var otherTrailId = grid[move.x][move.y];
            var otherTrail = trails.find(x => x.id == otherTrailId);
            return [false, [`%cTRAIL [${trail.id}] %chit %cTRAIL [${otherTrail.id}]`, 'color: ' + trail.color, 'color: auto', 'color: ' + otherTrail.color]];
        }
        return [true];
    }
} 