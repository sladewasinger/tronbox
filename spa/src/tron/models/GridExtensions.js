export class Grid {
    constructor() { }

    static isOccupied(grid, pos) {
        if (grid[pos.x][pos.y].occupied) {
            return true;
        }
        return false;
    }

    static flatten(grid) {
        return grid
            .map((col, x) => col.map((cell, y) => ({ occupied: cell.occupied, position: new Point(x, y) })))
            .flatMap(x => x)
            .filter(x => !x.occupied);
    }
}