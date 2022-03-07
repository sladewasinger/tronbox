export class Grid {
    constructor() { }

    static isOccupied(grid, pos) {
        if (grid[pos.x][pos.y].occupied) {
            return true;
        }
        return false;
    }
}