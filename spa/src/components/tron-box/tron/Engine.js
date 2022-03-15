import { Constants } from "./models/Constants";
import { Point } from "paper/dist/paper-core";
import { Grid } from "./models/GridExtensions";
import { Trail } from "./models/Trail";
import { ColorExtensions } from "./models/ColorExtensions";
import { TrailMoveValidator } from "./models/TrailMoveValidator";

export class Engine {
  constructor() {
    window.Constants = Constants;
    window.Point = Point;
    window.Grid = Grid;

    this.reset();
  }

  log() {
    if (!this.debug) {
      return;
    }

    console.log(...arguments);
  }

  reset() {
    this.debug = true;
    this.expired = false;
    this.path = null;
    this.point = {
      x: 0,
      y: 0
    };
    this.grid = undefined;
    this.trails = [];
    this.gridWidth = 10;
    this.colorIndex = 0;
    this.winners = [];
    this.createGrid();
  }

  get allBotsDead() {
    return this.trails.length && this.trails.every(x => !x.alive);
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

  parseRawJsIntoGetMoveFunction(raw_ai_js) {
    let usrGetMove = new Function('return getMove; ' + raw_ai_js)();
    return usrGetMove;
  }

  addTrail(getMove_func, id, color, pos) {
    if (this.expired) {
      this.log("Engine has expired - please reset before addinga new bot.");
      return;
    }
    pos = pos || Grid.getRandomValidPos(this.grid);
    if (!pos) {
      return;
    }
    color = color || ColorExtensions.getRandomColorHex();

    // var id = this.trails.length;
    var trail = new Trail(pos, color, id, getMove_func);
    this.trails.push(trail);
    this.setGridCellOwner(trail);
  }

  setGridCellOwner(trail) {
    this.grid[trail.head.x][trail.head.y].id = trail.id;
  }

  determineWinners() {
    if (this.trails.length < 1) {
      return;
    }

    var pointMap = Grid
      .flatten(this.grid)
      .filter(x => x.occupied)
      .reduce((map, cur) => {
        if (!map.has(cur.id)) {
          map.set(cur.id, {
            points: 0,
            trail: this.trails.find(x => x.id == cur.id)
          });
        }

        map.get(cur.id).points += 1;
        return map;
      }, new Map());

    if (pointMap.size < 1) {
      this.log("No winners??");
      return;
    }

    let winners = Array.from(pointMap.values())
      .sort((a, b) => b.points - a.points);

    this.log("\n\n\n");
    this.log("#############################");
    this.log("##         WINNERS         ##");
    this.log("#############################");
    for (var winner of winners) {
      let trail = winner.trail;
      trail.points = winner.points;
      this.log(`%c > %cTRAIL [${trail.id}] %c POINTS: ${trail.points}`, `color: auto`, `color: ${trail.color};`, `color: auto`);
      this.winners.push(trail);
    }

    this.expired = true;
  }

  iterateTrails() {
    for (let trail of this.trails.filter(x => x.alive)) {
      try {
        var moveDir = trail.getMove(this.grid, trail.head, this.trails.map(t => t.head), trail.state);
      } catch (ex) {
        this.log("Error executing script: ", ex, trail.getMove);
      }

      let [validMove, logMsgs] = TrailMoveValidator.isValidMove(this.grid, trail, moveDir, this.trails);
      if (!validMove) {
        trail.alive = false;
        this.log(...logMsgs);
        continue;
      }

      let move = trail.head.add(moveDir);
      trail.applyMove(move);
      this.setGridCellOwner(trail);
    }
  }

  step() {
    if (!this.expired && !this.allBotsDead) {
      this.iterateTrails();
    }
    if (!this.expired && this.allBotsDead) {
      this.determineWinners();
    }
  }
}