<template>
  <div>
    <h3>The Grid</h3>
    <button v-on:click="start()">Start (add tron bike)</button>
    <canvas :id="canvasId" class="canvas-style" />
  </div>
</template>

<script>
// TODO: move all of this logic to master

import { Point, Size } from "paper/dist/paper-core";

// packages
const paper = require("paper");

var MoveDirection = {
  UP: new Point(0, -1),
  DOWN: new Point(0, 1),
  LEFT: new Point(-1, 0),
  RIGHT: new Point(1, 0),
  STALL: new Point(0, 0)
};

function ai_v1_Clockwise(grid, headPos) {
  var move = MoveDirection.RIGHT;
  var nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
  if (headPos.x + 1 >= grid.length || isOccupied(grid, nextPos)) {
    move = MoveDirection.DOWN;
    nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
    if (headPos.y + 1 >= grid[0].length || isOccupied(grid, nextPos)) {
      move = MoveDirection.LEFT;
      nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
      if (headPos.x - 1 < 0 || isOccupied(grid, nextPos)) {
        move = MoveDirection.UP;
        nextPos = new Point(headPos.x + move.x, headPos.y + move.y);
        if (headPos.y - 1 < 0 || isOccupied(grid, nextPos)) {
          move = MoveDirection.STALL;
        }
      }
    }
  }
  return move;
}

function isOccupied(grid, pos) {
  if (grid[pos.x][pos.y].occupied) {
    return true;
  }
  return false;
}

export default {
  name: "GridCanvas",
  props: ["canvasId"],
  data: () => ({
    path: null,
    scope: null,
    point: {
      x: 0,
      y: 0,
    },
    grid: undefined,
    trails: [],
    renderStuff: {
      grid: undefined,
      trails: {}
    },
  }),
  methods: {
    reset() {
      this.scope.project.activeLayer.removeChildren();
    },
    createGrid() {
      this.grid = [];
      var gridWidth = 10;
      var cellWidth = 50;
      for (var x = 0; x < gridWidth; x++) {
        this.grid[x] = [];
        for (var y = 0; y < gridWidth; y++) {
          var renderedCell = new paper.Path.Rectangle(
            x * cellWidth,
            y * cellWidth,
            cellWidth,
            cellWidth
          );
          let fillColor = "#090909";
          if (
            (x == 0 || x + 1 == gridWidth) &&
            (y == 0 || y + 1 == gridWidth)
          ) {
            fillColor = "#221";
          }
          renderedCell.strokeColor = "#290";
          renderedCell.fillColor = fillColor;

          var cell = {
            id: undefined,
            get occupied() {
              return this.id != undefined;
            }
          };
          this.grid[x].push(cell);
        }
      }
    },
    createTrail(x, y) {
      let trail = {
        head: new Point(x, y),
        tail: [], // queue type?
        color: "#" + Math.floor(Math.random() * 16777215 / 2 + 16777215 / 2).toString(16),
        alive: true,
        id: this.trails.length,
        getMove: ai_v1_Clockwise,
        applyMove(grid, headPos, moveDir) {
          let move = new Point(headPos.x + moveDir.x, headPos.y + moveDir.y);
          if (moveDir != MoveDirection.STALL) {
            if (move.x < 0 || move.x >= grid.length) {
              console.log("ded");
              this.alive = false;
              return;
            }
            if (move.y < 0 || move.y >= grid[0].length) {
              console.log("ded");
              this.alive = false;
              return;
            }
            if (grid[move.x][move.y].occupied) {
              console.log(`${this.id} hit other snake at: (" + x + ", " + y + ")`);
              this.alive = false;
              return;
            }
          } else {
            console.log(`${this.id} returned stall`);
          }

          this.tail.push(this.head);
          this.head = move;
        },
      };
      return trail;
    },
    start() {
      var trail = this.createTrail(Math.round(Math.random() * 9), Math.round(Math.random() * 9));
      this.trails.push(trail);
      this.grid[trail.head.x][trail.head.y].id = trail.id;
      this.gameLoop();
    },
    render() {
      if (this.renderStuff.grid === undefined) {
        var gridWidth = 10;
        var cellWidth = 50;

        this.renderStuff.grid = this.grid.map((col, x) =>
          col.map((el, y) => {
            var cell = new paper.Path.Rectangle(
              new Point(x * cellWidth, y * cellWidth),
              new Size(cellWidth, cellWidth)
            );
            cell.strokeColor = "#290";
            let fillColor = "#090909";
            if (
              (x == 0 || x + 1 == gridWidth) &&
              (y == 0 || y + 1 == gridWidth)
            ) {
              fillColor = "#222";
            }
            cell.fillColor = fillColor;
            return cell;
          })
        );
      }
      for (let trail of this.trails) {
        for (let point of [...trail.tail, trail.head]) {
          let tailCell = this.renderStuff.grid[point.x][point.y];
          tailCell.fillColor = trail.color;
          tailCell.strokeColor = "#290";
          tailCell.strokeWidth = 1;
          tailCell.shadowColor = "#000";
          tailCell.shadowBlur = 10;
        }
        let headCell = this.renderStuff.grid[trail.head.x][trail.head.y];
        headCell.strokeColor = trail.color;
        headCell.strokeWidth = 10;
        headCell.shadowColor = "#000";
        headCell.shadowBlur = 20;
        headCell.bringToFront();

        if (!this.renderStuff.trails[trail.id]) {
          let circle = new paper.Path.Circle(headCell.position, 15);
          circle.fillColor = trail.color;
          circle.strokeColor = "#FFF";
          circle.strokeWidth = 10;
          this.renderStuff.trails[trail.id] = circle;
        }
        if (!trail.alive) {
          let triangle = new paper.Path.RegularPolygon(headCell.position, 3, 25);
          triangle.fillColor = '#000';
          this.renderStuff.trails[trail.id] = triangle;
        }
        let c = this.renderStuff.trails[trail.id];
        c.position = headCell.position;
        c.bringToFront();
      }
    },
    iterateTrails() {
      for (let trail of this.trails.filter(x => x.alive)) {
        var moveDir = trail.getMove(this.grid, trail.head);
        trail.applyMove(this.grid, trail.head, moveDir);
        this.grid[trail.head.x][trail.head.y].id = trail.id;
        console.log("moving", moveDir);
      }
    },
    gameLoop() {
      this.iterateTrails();
      this.render();
      setTimeout(this.gameLoop.bind(this), 50);
    },
  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.canvasId);
    this.createGrid();
    this.start();
  },
};
</script>

<style scoped>
.canvas-style {
  width: 500px;
  height: 500px;
  border: none;
  display: block;
  margin: auto;
  box-shadow: 0 0 18px 5px black;
}
</style>
