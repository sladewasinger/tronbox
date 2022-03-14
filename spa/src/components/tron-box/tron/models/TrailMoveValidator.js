export class TrailMoveValidator {
    static isValidMove(grid, trail, moveDir, trails) {
        if (!moveDir || moveDir.x == undefined || moveDir.y == undefined) {
            console.log("Error - moveDir is not a valid Point object. Killing trail. moveDir supplied:", moveDir);
            return false;
        }
        if (!Object.keys(Constants.MoveDirection).map(key => Constants.MoveDirection[key]).some(x => moveDir.x == x.x && moveDir.y == x.y)) {
            console.log("Invalid move supplied! Killing trail. Move supplied: ", moveDir);
            return false;
        }

        let move = new Point(trail.head.x + moveDir.x, trail.head.y + moveDir.y);
        if ((move.x < 0 || move.x >= grid.length) ||
            (move.y < 0 || move.y >= grid[move.x].length)) {
            console.log(`%cTRAIL [${trail.id}] %ctried to escape the grid! They failed...`, 'color: ' + trail.color, 'color: auto');
            return false;
        }
        if (grid[move.x][move.y].occupied) {
            var otherTrailId = grid[move.x][move.y].id;
            var otherTrail = trails.find(x => x.id == otherTrailId);
            console.log(`%cTRAIL [${trail.id}] %chit %cTRAIL [${otherTrail.id}]`, 'color: ' + trail.color, 'color: auto', 'color: ' + otherTrail.color);
            return false;
        }

        return true;
    }
} 