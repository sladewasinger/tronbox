<template>
  <div class="grid-box">
    <div class="header">
      <h1>Battle Tron</h1>
    </div>
    <div class="flex-box-row">
      <div>
        <!-- Canvas will default to 300 x 150 if width and height aren't manually set -->
        <canvas :id="canvasId" class="canvas-style" width="500" height="500" />
      </div>
      <div class="editor">
        <div class="controls">
          <div class="control">
            <button class="btn btn-dark" @click="addTrail(botA)">ADD [A]</button>
            <input id="colorPickerA" v-model="botA.color" type="color" />
          </div>
          <div class="control">
            <button class="btn btn-dark" @click="addTrail(botB)">ADD [B]</button>
            <input id="colorPickerB" v-model="botB.color" type="color" />
          </div>
          <button class="btn btn-dark" @click="clear()">CLEAR</button>
          <button class="btn btn-dark" @click="reset()">RESET</button>
          <button class="btn btn-dark" @click="togglePause()">{{ pauseBtnText }}</button>
          <button class="btn btn-dark" @click="step()">STEP</button>
        </div>

        <textarea v-model="botA.js" class="code-area"></textarea>
        <textarea v-model="botB.js" class="code-area"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { Renderer } from "./tron/Renderer";
import { Engine } from "./tron/Engine";
import clockwiseExampleAi from 'raw-loader!./tron/ai/clockwise.ai.js'; /* Load the raw JS as a string */
import counterclockwiseExampleAi from 'raw-loader!./tron/ai/counterclockwise.ai.js'; /* Load the raw JS as a string */

export default {
  name: "TronBox",
  props: {
    canvasId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    botA: {
      js: undefined,
      color: "#FF0000"
    },
    botB: {
      js: undefined,
      color: "#0000FF"
    },
    renderer: undefined,
    engine: undefined,
    paused: true
  }),
  computed: {
    pauseBtnText: function () {
      return this.paused ? 'PLAY' : 'PAUSE';
    }
  },
  mounted() {
    this.renderer = new Renderer(this.canvasId);
    this.engine = new Engine();
    this.botA.js = clockwiseExampleAi;
    this.botB.js = counterclockwiseExampleAi;
    this.start();
  },
  methods: {
    addTrail(bot) {
      let getMove = this.engine.parseRawJsIntoGetMoveFunction(bot.js);
      this.engine.addTrail(getMove, bot.color);
    },
    clear() {
      this.engine.reset();
      this.renderer.reset();
    },
    step() {
      this.engine.step();
    },
    reset() {
      this.clear();
      this.addInitialTrails();
    },
    addInitialTrails() {
      this.addTrail(this.botA);
      this.addTrail(this.botB);
    },
    start() {
      this.addInitialTrails();
      this.loop();
    },
    togglePause() {
      this.paused = !this.paused;
    },
    loop() {
      if (!this.paused) {
        this.engine.step();
      }
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
    display: flex;
    gap: 10px;

    .control {
      display: inline-flex;
      flex-direction: column;
      align-items: baseline;
      gap: 5px;
      * {
        width: 100%;
      }
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
.code-area::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.code-area::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

/* Fix scrollbar cursor bug: */
textarea {
  cursor: auto;
}

/* Handle */
.code-area::-webkit-scrollbar-thumb {
  background-color: rgb(0, 129, 32);
}
/* Handle on hover */
.code-area::-webkit-scrollbar-thumb:hover {
  background: rgb(2, 80, 32);
}
</style>
