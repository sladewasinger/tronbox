import { Point } from "paper/dist/paper-core";

export class Grid {
    constructor() { }

    static isOccupied(grid, pos) {
        if (!grid || !grid.length || !grid[0].length) {
            return;
        }
        if (pos.x >= grid.length || pos.x < 0 || pos.y < 0 || !grid[pos.x] || pos.y >= grid[pos.x].length) {
            return;
        }
        if (grid[pos.x][pos.y] != undefined) {
            return true;
        }
        return false;
    }

    static flatten(grid) {
        return grid
            .map((col, x) => col.map((cell, y) => {
                return {
                    position: new Point(x, y),
                    id: cell
                };
            }))
            .flatMap(x => x);
    }

    static setOwner(grid, pos, id) {
        if (!grid || !grid.length || !grid[0].length) {
            return;
        }
        if (pos.x >= grid.length || pos.x < 0 || pos.y < 0 || !grid[pos.x] || pos.y >= grid[pos.x].length) {
            return;
        }

        grid[pos.x][pos.y] = id;
    }

    static getRandomValidPos(grid) {
        var openSpots = Grid
            .flatten(grid)
            .filter(x => !Grid.isOccupied(grid, x.position));

        if (openSpots.length < 1) {
            console.log("No open spots to spawn in a tron bike!");
            return;
        }
        var pos = openSpots[Math.floor(Math.random() * openSpots.length)].gridPosition;
        return pos;
    }

    static copy(grid) {
        console.log(grid);
        let copy = grid.map(col => [...col]);
        console.log("copy:", copy);
        return copy;
    }
}