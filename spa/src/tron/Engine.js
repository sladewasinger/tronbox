import { Constants } from "./models/Constants";
import { Point } from "./models/Point";
import { ai_Clockwise_v1 } from "./ai/clockwise.ai";

export class Engine {
  constructor() {
    this.path = null;
    this.point = {
      x: 0,
      y: 0
    };
    this.grid = undefined;
    this.trails = [];
    this.gridWidth = 10;
    this.colorIndex = 0;
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

  createTrail(x, y) {
    let trail = {
      head: new Point(x, y),
      tail: [], // queue type?
      color: Constants.colors[this.colorIndex++],
      alive: true,
      id: this.trails.length,
      getMove: ai_Clockwise_v1,
      applyMove(grid, headPos, moveDir) {
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

  addTrail() {
    var trail = this.createTrail(Math.round(Math.random() * 9), Math.round(Math.random() * 9));
    this.trails.push(trail);
    this.grid[trail.head.x][trail.head.y].id = trail.id;
  }

  start() {
    this.createGrid();
    this.addTrail();
  }

  iterateTrails() {
    for (let trail of this.trails.filter(x => x.alive)) {
      var moveDir = trail.getMove(this.grid, trail.head);
      trail.applyMove(this.grid, trail.head, moveDir);
      this.grid[trail.head.x][trail.head.y].id = trail.id;
    }
  }

  loop() {
    this.iterateTrails();
  }
}