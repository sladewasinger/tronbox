<template>
  <div>
    <h1>GRID</h1>
    <canvas :id="canvasId" class="canvas-style" />
  </div>
</template>

<script>
// TODO: move all of this logic to master
// packages
const paper = require("paper");

export default {
  name: "GridCanvas",
  props: ["canvasId"],
  data: () => ({
    path: null,
    scope: null,
  }),
  methods: {
    reset() {
      this.scope.project.activeLayer.removeChildren();
    },
    drawGrid() {
      var num_rectangles_wide = 10;
      var num_rectangles_tall = 11;
      var boundingRect = this.scope.view.bounds;
      var width_per_rectangle = boundingRect.width / num_rectangles_wide;
      var height_per_rectangle = boundingRect.height / num_rectangles_tall;
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
  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.canvasId);
    this.drawGrid();
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
