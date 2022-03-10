import { Constants } from "./models/Constants";
import { Point } from "paper/dist/paper-core";
import { Grid } from "./models/GridExtensions";

export class Engine {
  constructor() {
    window.Constants = Constants;
    window.Point = Point;
    window.Grid = Grid;

    this.reset();
  }

  reset() {
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
    return this.trails.every(x => !x.alive);
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
      applyMove(grid, trails, headPos, moveDir) {
        if (!moveDir || moveDir.x == undefined || moveDir.y == undefined) {
          console.log("Error - moveDir is not a valid Point object. Killing trail. moveDir supplied:", moveDir);
          this.alive = false;
          return;
        }
        if (!Object.keys(Constants.MoveDirection).map(key => Constants.MoveDirection[key]).some(x => moveDir.x == x.x && moveDir.y == x.y)) {
          console.log("Invalid move supplied! Killing trail. Move supplied: ", moveDir);
          this.alive = false;
          return;
        }

        let move = new Point(headPos.x + moveDir.x, headPos.y + moveDir.y);
        if ((move.x < 0 || move.x >= grid.length) ||
          (move.y < 0 || move.y >= grid[0].length)) {
          console.log(`%cTRAIL [${this.id}] %ctried to escape the grid! They failed...`, 'color: ' + this.color, 'color: auto');
          this.alive = false;
          return;
        }
        if (grid[move.x][move.y].occupied) {
          var otherTrailId = grid[move.x][move.y].id;
          var otherTrail = trails.find(x => x.id == otherTrailId);
          console.log(`%cTRAIL [${this.id}] %chit %cTRAIL [${otherTrail.id}]`, 'color: ' + this.color, 'color: auto', 'color: ' + otherTrail.color);
          this.alive = false;
          return;
        }

        this.tail.push(this.head);
        this.head = move;
        grid[trail.head.x][trail.head.y].id = trail.id;
        return true;
      },
    };
    return trail;
  }

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

  getRandomColor() {
    var color = Constants.colors[this.colorIndex++];
    if (this.colorIndex >= Constants.colors.length) {
      console.log("No more colors to create a trail with...");
      return;
    }
    return color;
  }

  addTrail(getMove_func, color, pos) {
    pos = pos || this.getRandomValidPos();
    if (!pos) {
      return;
    }
    color = color || this.getRandomColor();

    var id = this.trails.length;
    var trail = this.createTrail(pos.x, pos.y, color, id, getMove_func);
    this.trails.push(trail);
    this.grid[trail.head.x][trail.head.y].id = trail.id;
  }

  getRandomColor() {
    const randomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function hslToHex(h, s, l) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    }
    var h = randomInt(0, 360);
    var s = randomInt(50, 100);
    var l = randomInt(30, 70);

    return hslToHex(h, s, l);
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
  }

  iterateTrails() {
    let atLeastOneMoveMade = false;
    for (let trail of this.trails.filter(x => x.alive)) {
      try {
        var move = trail.getMove(this.grid, trail.head);
      } catch (ex) {
        console.log("Error executing script: ", ex, trail.getMove);
      }
      let moveWasMade = trail.applyMove(this.grid, this.trails, trail.head, move) || false;
      if (moveWasMade) {
        atLeastOneMoveMade = true;
      }
    }
    if (this.allBotsDead) {
      this.determineWinners();
    }
  }

  step() {
    if (!this.allBotsDead) {
      this.iterateTrails();
    }
  }
}