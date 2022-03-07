<template>
  <div>
    <h3>The Grid</h3>
    <button @click="addTrail()">Add tron bike trail</button>
    <canvas :id="canvasId" class="canvas-style" />
  </div>
</template>

<script>
import { Renderer } from "../../tron/Renderer";
import { Engine } from "../../tron/Engine";

export default {
  name: "Tronbox",
  props: {
    canvasId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    renderer: undefined,
    engine: undefined,
    path: null,
    scope: null,
    point: {
      x: 0,
      y: 0,
    },
    grid: undefined,
    trails: [],
    gridWidth: 10,
    renderStuff: {
      grid: undefined,
      trails: {},
      colors: ["#A72334", "#FC7A43", "#ECCF39", "#6FAF60", "#02654B", "#188DBF", "#22379B", "#7209b7", "#f72585"],
      colorIndex: 0
    },
  }),
  mounted() {
    this.renderer = new Renderer(this.canvasId);
    this.engine = new Engine();

    this.start();
  },
  methods: {
    reset() {
      this.scope.project.activeLayer.removeChildren();
    },
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
    },
    createTrail(x, y) {
      let trail = {
        head: new Point(x, y),
        tail: [], // queue type?
        color: this.renderStuff.colors[this.renderStuff.colorIndex++],
        alive: true,
        id: this.trails.length,
        getMove: ai_v1_Clockwise,
        applyMove(grid, headPos, moveDir) {
          let move = new Point(headPos.x + moveDir.x, headPos.y + moveDir.y);
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

          this.tail.push(this.head);
          this.head = move;
        },
      };
      return trail;
    },
    addTrail() {
      this.engine.addTrail();
    },
    start() {
      this.engine.start();
      this.engine.addTrail();
      this.loop();
    },
    loop() {
      this.engine.loop();
      this.renderer.render(this.engine.grid, this.engine.trails);
      setTimeout(this.loop.bind(this), 50);
    }
  }
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
