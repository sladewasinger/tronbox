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
    renderStuff: {},
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
            ownerId: undefined,
            get occupied() {
              return !!this.ownerId;
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
        color: "#F00",
        alive: true,
        ownerId: 1,
        getMove: ai_v1_Clockwise,
        applyMove(grid, headPos, moveDir) {
          if (moveDir == MoveDirection.STALL) {
            console.log(`${this.ownerId} returned stall`);
            return;
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
          grid.forEach((col, x) => {
            col.forEach((cell, y) => {
              if (move.x == x && move.y == y && cell.occupied) {
                this.alive = false;
                console.log(`${this.ownerId} hit other snake at: (" + x + ", " + y + ")`);
                return;
              }
            });
          });
          this.tail.push(this.head);
          this.head = move;
        },
      };
      return trail;
    },
    start() {
      var trail = this.createTrail(0, 0);
      this.trails.push(trail);
      this.grid[trail.head.x][trail.head.y].ownerId = trail.ownerId;
      this.gameLoop();
    },
    render() {
      if (this.renderStuff.grid === undefined) {
        var gridWidth = 10;
        var cellWidth = 50;

        this.renderStuff.grid = this.grid.map((col, x) =>
          col.map((el, y) => {
            var cell = new paper.Path.Rectangle(
              x * cellWidth,
              y * cellWidth,
              cellWidth,
              cellWidth
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
          this.renderStuff.grid[point.x][point.y].fillColor = trail.color;
        }
      }
    },
    iterateTrails() {
      for (let trail of this.trails.filter(x => x.alive)) {
        var moveDir = trail.getMove(this.grid, trail.head);
        trail.applyMove(this.grid, trail.head, moveDir);
        this.grid[trail.head.x][trail.head.y].ownerId = trail.ownerId;
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
