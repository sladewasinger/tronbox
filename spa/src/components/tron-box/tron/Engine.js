import { Constants } from "./models/Constants";
import { Point as PaperPoint } from "paper/dist/paper-core";
import { Grid } from "./models/Grid.Extensions";
import { Trail } from "./models/Trail";
import { ColorExtensions } from "./models/ColorExtensions";
import { TrailMoveValidator } from "./models/TrailMoveValidator";

export class Engine {
  constructor() {
    window.Constants = Constants;
    window.Point = PaperPoint;
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
        this.grid[x].push(undefined);
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

    let idUniqueifier = 0;
    let origId = id;
    while (this.trails.some(x => x.id == id)) {
      id = origId + idUniqueifier++;
    }
    // var id = this.trails.length;
    var trail = new Trail(pos, color, id, getMove_func);
    this.trails.push(trail);
    this.setGridCellOwner(trail);
  }

  setGridCellOwner(trail) {
    Grid.setOwner(this.grid, trail.head, trail.id);
    //this.grid[trail.head.x][trail.head.y].id = trail.id;
  }

  determineWinners() {
    if (this.trails.length < 1) {
      return;
    }

    var pointMap = Grid
      .flatten(this.grid)
      .filter(x => Grid.isOccupied(this.grid, x.position))
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
        var moveDir = trail.getMove(
          this.grid,
          trail.head,
          trail.id,
          /* remove certain "secrets" from trails before passing to getMove: */
          this.trails.map(t => ({ ...t, getMove: undefined, state: undefined })),
          trail.state
        );
      } catch (ex) {
        this.log("Error executing script: ", ex, trail.getMove);
      }

      let [isValidMove, logMsgs] = TrailMoveValidator.isValidMoveDir(this.grid, trail, moveDir, this.trails);
      if (!isValidMove) {
        trail.alive = false;
        this.log(...logMsgs);
        continue;
      }

      let movePos = trail.head.add(moveDir);
      trail.nextMovePos = movePos;
    }
    let aliveTrails = this.trails.filter(x => x.alive);
    for (let i = 0; i < aliveTrails.length; i++) {
      let trail1 = aliveTrails[i];
      for (let j = i + 1; j < aliveTrails.length; j++) {
        let trail2 = aliveTrails[j];
        if (trail1.nextMovePos.x == trail2.nextMovePos.x
          && trail1.nextMovePos.y == trail2.nextMovePos.y) {
          trail1.alive = false;
          trail2.alive = false;
          this.log(`TRAIL [${trail1.id}] and TRAIL [${trail2.id}] tried to occupy the same space: (${trail1.nextMovePos.x},${trail1.nextMovePos.y})`);
        }
      }
      let movePos = trail1.nextMovePos;
      trail1.nextMovePos = undefined;
      if (!trail1.alive) {
        continue;
      }
      trail1.applyMove(movePos);
      this.setGridCellOwner(trail1);
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