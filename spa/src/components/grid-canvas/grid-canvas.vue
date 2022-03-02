<template>
  <div>
    <h3>The Grid</h3>
    <canvas :id="canvasId" class="canvas-style" />
  </div>
</template>

<script>
// TODO: move all of this logic to master

import { Point, Size } from "paper/dist/paper-core";

// packages
const paper = require("paper");

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
    box: undefined,
  }),
  methods: {
    reset() {
      this.scope.project.activeLayer.removeChildren();
    },
    drawGrid() {
      var num_rectangles_wide = 10;
      var num_rectangles_tall = 11;
      var boundingRect = this.scope.view.bounds;
      var width_per_rectangle = 50; // boundingRect.width / num_rectangles_wide;
      var height_per_rectangle = 50; // boundingRect.height / num_rectangles_tall;
      for (var i = 0; i < num_rectangles_wide; i++) {
        for (var j = 0; j < num_rectangles_tall; j++) {
          var aRect = new paper.Path.Rectangle(
            boundingRect.left + i * width_per_rectangle,
            boundingRect.top + j * height_per_rectangle,
            width_per_rectangle,
            height_per_rectangle
          );
          aRect.strokeColor = "#290";
          aRect.fillColor = "#090909";
        }
      }
    },
    drawPoint() {
      this.box = new paper.Path.Rectangle(new Point(0, 0), new Size(50, 50));
      this.box.fillColor = "#FFFF00";
    },
  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.canvasId);
    this.drawGrid();
    this.drawPoint();
    setInterval(() => {
      if (!this.box) {
        console.log("box undefined!");
        return;
      }
      this.box.position.x += 10;
      this.box.position.y += 10;
      if (this.box.position.x > 500) {
        this.box.position.x = 0;
      }
      if (this.box.position.y > 500) {
        this.box.position.y = 0;
      }
    }, 50);
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
