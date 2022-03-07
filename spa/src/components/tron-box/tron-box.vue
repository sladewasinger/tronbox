<template>
  <div>
    <h3>The Grid</h3>
    <button @click="addTrail()">Add tron bike trail</button>
    <canvas :id="canvasId" class="canvas-style" />
    <
  </div>
</template>

<script>
import { Renderer } from "../../tron/Renderer";
import { Engine } from "../../tron/Engine";

export default {
  name: "TronBox",
  props: {
    canvasId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    renderer: undefined,
    engine: undefined
  }),
  mounted() {
    this.renderer = new Renderer(this.canvasId);
    this.engine = new Engine();
    this.start();
  },
  methods: {
    addTrail() {
      this.engine.addTrail();
    },
    start() {
      this.engine.addTrail();
      this.engine.addTrail();
      this.engine.addTrail();
      this.loop();
    },
    loop() {
      this.engine.loop();
      this.renderer.render(this.engine.grid, this.engine.trails);
      setTimeout(this.loop, 50);
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
