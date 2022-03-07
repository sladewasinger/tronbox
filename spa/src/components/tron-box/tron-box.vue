<template>
  <div class="grid-box">
    <div class="header">
      <h1>Battle Tron</h1>
      <button @click="addTrail()">Add tron bike trail</button>
    </div>
    <div>
      <canvas :id="canvasId" class="canvas-style" />
    </div>
    <div>
      <textarea v-model="aiJs" class="editor">TESTING</textarea>
    </div>
  </div>
</template>

<script>
import { Renderer } from "../../tron/Renderer";
import { Engine } from "../../tron/Engine";
import { ai_Clockwise_v1 } from "@/tron/ai/clockwise.ai";

export default {
  name: "TronBox",
  props: {
    canvasId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    aiJs: '',
    renderer: undefined,
    engine: undefined
  }),
  mounted() {
    this.renderer = new Renderer(this.canvasId);
    this.engine = new Engine();
    this.aiJs = ai_Clockwise_v1.toString();
    this.start();
  },
  methods: {
    addTrail() {
      this.engine.addTrail(new Function('return ' + this.aiJs)());
    },
    start() {
      this.addTrail();
      this.addTrail();
      this.addTrail();
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

<style scoped lang="scss">
.canvas-style {
  width: 500px;
  height: 500px;
  border: none;
  display: block;
  margin: auto;
  box-shadow: 0 0 18px 5px black;
}

.grid-box {
  padding: 50px;
  display: grid;
  grid-template-columns: 550px 1fr;
  grid-template-rows: 200px 1fr;
  column-gap: 10px;
}

.header {
  grid-column: 1 / 3;
}

.editor {
  width: 100%;
  height: 100%;
  font-family: "Courier New", Courier, monospace;
  font-size: small;
}

/* width */
.editor::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.editor::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

/* Fix scrollbar cursor bug: */
textarea {
  cursor: auto;
}

/* Handle */
.editor::-webkit-scrollbar-thumb {
  background-color: rgb(0, 129, 32);
}
/* Handle on hover */
.editor::-webkit-scrollbar-thumb:hover {
  background: rgb(2, 80, 32);
}
</style>
