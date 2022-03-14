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

  reset() {
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

  // TODO: Add "gameFinished" boolean value instead...
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

  getRandomValidPos() {
    var openSpots = Grid
      .flatten(this.grid)
      .filter(x => !x.occupied);

    if (openSpots.length < 1) {
      console.log("No open spots to spawn in a tron bike!");
      return;
    }
    var pos = openSpots[Math.floor(Math.random() * openSpots.length)].gridPosition;
    return pos;
  }

  addTrail(getMove_func, color, pos) {
    if (this.expired) {
      console.log("Engine has expired - please reset before addinga new bot.");
      return;
    }
    pos = pos || this.getRandomValidPos();
    if (!pos) {
      return;
    }
    color = color || ColorExtensions.getRandomColorHex();

    var id = this.trails.length;
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
      .reduce((prev, cur) => {
        if (!prev[cur.id]) {
          prev[cur.id] = {
            points: 0,
            id: cur.id
          };
        }
        prev[cur.id].points += 1;
        return prev;
      }, {});

    if (Object.keys(pointMap).length < 1) {
      return;
    }

    let mostPoints = Object.keys(pointMap)
      .map(key => pointMap[key])
      .sort((a, b) => b.points - a.points)
    [0].points;

    let tempWinners = Object.keys(pointMap)
      .map(key => pointMap[key])
      .filter(x => x.points == mostPoints);

    for (var trail of Object.keys(pointMap).map(key => pointMap[key])) {
      console.log(`TRAIL [${trail.id}] has ${trail.points} points.`);
    }

    console.log("\n\n\n");
    console.log("#############################");
    console.log("##         WINNERS         ##");
    console.log("#############################");
    var wonortiedText = 'WON';
    if (tempWinners.length > 1) {
      console.log(" -- IT'S A TIE! -- ");
      wonortiedText = 'TIED'
    }
    for (var tempWinner of tempWinners) {
      let trail = this.trails.find(x => x.id == tempWinner.id);
      trail.points = tempWinner.points;
      console.log(`%c!!!! %cTRAIL [${trail.id}] %c${wonortiedText} WITH ${tempWinner.points} POINTS!!!!`, `color: auto`, `color: ${trail.color};`, `color: auto`);
      this.winners.push(trail);
    }

    this.expired = true;
  }

  iterateTrails() {
    for (let trail of this.trails.filter(x => x.alive)) {
      try {
        var moveDir = trail.getMove(this.grid, trail.head, this.trails.map(t => t.head), trail.state);
      } catch (ex) {
        console.log("Error executing script: ", ex, trail.getMove);
      }

      if (!TrailMoveValidator.isValidMove(this.grid, trail, moveDir, this.trails)) {
        trail.alive = false;
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