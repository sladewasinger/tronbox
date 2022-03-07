import { Constants } from "./models/Constants";
import { Point } from "paper/dist/paper-core";
import { ai_Clockwise_v1 } from "./ai/clockwise.ai";
import { Grid } from "./models/GridExtensions";

export class Engine {
  constructor() {
    window.Constants = Constants;
    window.Point = Point;
    window.Grid = Grid;

    this.reset();
  }

  reset() {
    this.paused = true;
    this.path = null;
    this.point = {
      x: 0,
      y: 0
    };
    this.grid = undefined;
    this.trails = [];
    this.gridWidth = 10;
    this.colorIndex = 0;
    this.createGrid();
  }

  createGrid() {
    this.grid = [];
    for (var x = 0; x < this.gridWidth; x++) {
      this.grid[x] = [];
      for (var y = 0; y < this.gridWidth; y++) {
        var cell = {
          id: undefined,
          get occupied() {
            return this.id != undefined;
          }
        };
        this.grid[x].push(cell);
      }
    }
  };

  createTrail(x, y, color, id, getMove) {
    let trail = {
      head: new Point(x, y),
      tail: [], // queue type?
      color: color,
      alive: true,
      id: id,
      getMove: getMove,
      applyMove(grid, headPos, moveDir) {
        //let moveDirPoint = Constants.MoveDirection[moveDir];
        if (!Object.keys(Constants.MoveDirection).map(key => Constants.MoveDirection[key]).some(x => moveDir.x == x.x && moveDir.y == x.y)) {
          console.log("Invalid move supplied! Defaulting to the RIGHT. Move supplied: ", moveDir);
          moveDir = Constants.MoveDirection.RIGHT;
        }
        let move = new Point(headPos.x + moveDir.x, headPos.y + moveDir.y);
        if (move.x < 0 || move.x >= grid.length) {
          this.alive = false;
          return;
        }
        if (move.y < 0 || move.y >= grid[0].length) {
          this.alive = false;
          return;
        }
        if (grid[move.x][move.y].occupied) {
          console.log(`${this.id} hit other snake at: (" + x + ", " + y + ")`);
          this.alive = false;
          return;
        }

        this.tail.push(this.head);
        this.head = move;
      },
    };
    return trail;
  }

  addTrail(aiJs = ai_Clockwise_v1) {
    var openSpots = this.grid
      .map((col, x) => col.map((cell, y) => ({ occupied: cell.occupied, position: new Point(x, y) })))
      .flatMap(x => x)
      .filter(x => !x.occupied);

    if (openSpots.length < 1) {
      console.log("No open spots to spawn in a tron bike!");
      return;
    }
    var pos = openSpots[Math.floor(Math.random() * openSpots.length)].position;
    var color = Constants.colors[this.colorIndex++];
    if (this.colorIndex >= Constants.colors.length) {
      console.log("No more colors to create a trail with...");
      return;
    }
    var id = this.trails.length;
    var trail = this.createTrail(pos.x, pos.y, color, id, aiJs);
    this.trails.push(trail);
    this.grid[trail.head.x][trail.head.y].id = trail.id;
  }

  iterateTrails() {
    for (let trail of this.trails.filter(x => x.alive)) {
      var moveDir = trail.getMove(this.grid, trail.head);
      trail.applyMove(this.grid, trail.head, moveDir);
      this.grid[trail.head.x][trail.head.y].id = trail.id;
    }
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  loop() {
    if (this.paused) {
      return;
    }
    this.iterateTrails();
  }
}