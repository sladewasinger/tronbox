export class Grid {
    constructor() { }

    static isOccupied(grid, pos) {
        if (!grid || !grid.length || !grid[0].length) {
            return;
        }
        if (pos.x >= grid.length || pos.x < 0 || pos.y < 0 || pos.y >= grid[pos.x].length) {
            return;
        }
        if (grid[pos.x][pos.y].occupied) {
            return true;
        }
        return false;
    }

    static flatten(grid) {
        return grid
            .map((col, x) => col.map((cell, y) => {
                cell.gridPosition = new Point(x, y);
                return cell;
            }))
            .flatMap(x => x);
    }

    static getRandomValidPos(grid) {
        var openSpots = Grid
            .flatten(grid)
            .filter(x => !x.occupied);

        if (openSpots.length < 1) {
            console.log("No open spots to spawn in a tron bike!");
            return;
        }
        var pos = openSpots[Math.floor(Math.random() * openSpots.length)].gridPosition;
        return pos;
    }
}