<template>
  <div class="grid-box">
    <div class="header">
      <h1>Battle Tron</h1>
    </div>
    <div class="flex-box-row">
      <div>
        <!-- Canvas will randomly default to 300 x 150 if width and height aren't manually set -->
        <canvas :id="canvasId" class="canvas-style" width="500" height="500" />
      </div>
      <div class="editor">
        <div class="controls">
          <button class="btn btn-dark" @click="addTrail_A()">ADD [A]</button>
          <button class="btn btn-dark" @click="addTrail_B()">ADD [B]</button>
          <button class="btn btn-dark" @click="reset()">RESET</button>
          <button class="btn btn-dark" @click="togglePause()">{{ pauseBtnText }}</button>
        </div>
        <textarea v-model="aiJs_A" class="code-area"></textarea>
        <textarea v-model="aiJs_B" class="code-area"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { Renderer } from "./tron/Renderer";
import { Engine } from "./tron/Engine";
import clockwiseExampleAi from 'raw-loader!./tron/ai/clockwise.ai.js'; /* Load the raw JS as a string */

export default {
  name: "TronBox",
  props: {
    canvasId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    aiJs_A: '',
    aiJs_B: '',
    renderer: undefined,
    engine: undefined
  }),
  computed: {
    pauseBtnText: function () {
      return this.engine?.paused ? 'PLAY' : 'PAUSE';
    }
  },
  mounted() {
    this.renderer = new Renderer(this.canvasId);
    this.engine = new Engine();
    this.aiJs_A = clockwiseExampleAi;
    this.aiJs_B = clockwiseExampleAi;
    this.start();
  },
  methods: {
    addTrail_A() {
      let getMove = this.engine.parseRawJsIntoGetMoveFunction(this.aiJs_A);
      this.engine.addTrail(getMove);
    },
    addTrail_B() {
      let getMove = this.engine.parseRawJsIntoGetMoveFunction(this.aiJs_B);
      this.engine.addTrail(getMove);
    },
    reset() {
      this.engine.reset();
      this.renderer.reset();
      this.addInitialTrails();
    },
    addInitialTrails() {
      this.addTrail_A();
      this.addTrail_B();
    },
    start() {
      this.addInitialTrails();
      this.loop();
    },
    togglePause() {
      if (this.engine.paused) {
        this.engine.resume();
      } else {
        this.engine.pause();
      }
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
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  margin: auto;
  box-shadow: 0 0 18px 5px black;
}

.editor {
  min-width: 700px;

  .controls {
    text-align: left;
    padding-bottom: 5px;
    button {
      margin-right: 5px;
    }
  }
}

.flex-box-row {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 50px;
}

.grid-box {
  padding: 50px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 100px 1fr;
  column-gap: 10px;
}

.header {
  grid-column: 1 / 3;
}

.code-area {
  width: 100%;
  min-height: 600px;
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
