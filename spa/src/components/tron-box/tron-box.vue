<template>
  <div class="grid-box">
    <div class="header">
      <h1>Tron Battle Bots</h1>
    </div>
    <div class="flex-box-row">
      <div class="flex-box-row no-gap">
        <div>
          <p class="tip">
            Press 'a' or 'b' on the keyboard to place a bot at your mouse
            position!
          </p>
          <!-- Canvas will default to 300 x 150 if width and height aren't manually set -->
          <canvas
            :id="canvasId"
            ref="canvas"
            width="500"
            class="canvas-style"
            height="500"
            @mousemove="mouseMove"
            @mouseenter="canvasMouseEnter"
            @mouseleave="canvasMouseLeave"
          />
        </div>
        <div class="winner-box">
          <h2>Points:</h2>
          <ol v-if="showWinnerText">
            <li v-for="winner in engine.winners" :key="winner.id">
              <b :style="`color: ${winner.color}`">TRAIL [{{ winner.id }}]</b>
              - POINTS: {{ winner.points }}
            </li>
          </ol>
        </div>
      </div>
      <div class="editor">
        <div class="controls">
          <div class="multi-control">
            <button class="btn btn-dark" @click="addBot(botA)">ADD [A]</button>
            <input id="colorPickerA" v-model="botA.color" type="color" />
            <input v-model="botA.posTxt" type="text" class="pos-input" />
          </div>
          <div class="multi-control">
            <button class="btn btn-dark" @click="addBot(botB)">ADD [B]</button>
            <input id="colorPickerB" v-model="botB.color" type="color" />
            <input v-model="botB.posTxt" type="text" class="pos-input" />
          </div>
          <button class="btn btn-dark" @click="clear">CLEAR</button>
          <button class="btn btn-dark" @click="randomizeBots">RANDOM</button>
          <button class="btn btn-dark" @click="togglePause">{{ pauseBtnText }}</button>
          <button class="btn btn-dark" @click="step">STEP</button>
          <button class="btn btn-dark" @click="benchmark">BENCHMARK</button>
        </div>

        <div>
          <h6>BOT A:</h6>
          <textarea v-model="botA.js" class="code-area" :style="`border-color: ${botA.color}`"></textarea>
        </div>
        <div>
          <h6>BOT B:</h6>
          <textarea v-model="botB.js" class="code-area" :style="`border-color: ${botB.color}`"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Renderer } from "./tron/Renderer";
import { Engine } from "./tron/Engine";
import clockwiseExampleAi from "raw-loader!./tron/ai/clockwise.ai.js"; /* Load the raw JS as a string */
import counterclockwiseExampleAi from "raw-loader!./tron/ai/counterclockwise.ai.js"; /* Load the raw JS as a string */
import minimax from "raw-loader!./tron/ai/minimax.ai.js";
import { ColorExtensions } from "./tron/models/ColorExtensions";
import { Point } from "./tron/models/Point";

export default {
  name: "TronBox",
  props: {
    canvasId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    botA: {
      js: minimax,
      color: "#FF0000",
      prevColor: "#FF0000",
      posTxt: "2,1",
      id: "A"
    },
    botB: {
      js: clockwiseExampleAi,
      color: "#0000FF",
      prevColor: "#0000FF",
      posTxt: "7,0",
      id: "B"
    },
    renderer: undefined,
    engine: undefined,
    paused: true,
    mousePos: { x: 0, y: 0 },
    mouseIsOnCanvas: false,
    lastKeyPressed: undefined
  }),
  computed: {
    pauseBtnText: function () {
      return this.paused ? "PLAY" : "PAUSE";
    },
    showWinnerText: function () {
      return this.engine?.winners?.length > 0;
    }
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
    this.renderer = new Renderer(this.canvasId);
    this.engine = new Engine();
    this.start();
  },
  methods: {
    convertPosTxtToPoint(posTxt) {
      let [m, x, y] = posTxt.match(/(\d+),(\d+)/);
      return new Point(x, y);
    },
    addBot(bot, pos) {
      let getMove = this.engine.parseRawJsIntoGetMoveFunction(bot.js);
      pos = pos || this.convertPosTxtToPoint(bot.posTxt);
      this.engine.addTrail(getMove, bot.id, bot.color, pos);
    },
    clear() {
      this.engine.reset();
      this.renderer.reset();
    },
    step() {
      this.engine.step();
    },
    randomizeBots() {
      this.clear();
      this.randomizeBot(this.botA);
      this.randomizeBot(this.botB);
      this.addInitialTrails();
    },
    randomizeBot(bot) {
      //bot.prevColor = bot.color;
      //bot.color = ColorExtensions.getRandomColorHex();

      let rndNum = () => Math.floor(Math.random() * 10);
      bot.posTxt = rndNum() + "," + rndNum();
    },
    addInitialTrails() {
      this.addBot(this.botA);
      this.addBot(this.botB);
    },
    start() {
      this.addInitialTrails();
      this.loop();
    },
    togglePause() {
      this.paused = !this.paused;
    },
    canvasMouseEnter() {
      this.mouseIsOnCanvas = true;
    },
    canvasMouseLeave() {
      this.mouseIsOnCanvas = false;
    },
    addBotAtMousePos(bot) {
      if (!this.mouseIsOnCanvas) {
        return;
      }

      var gridPos = this.renderer.convertMousePosToGridPos(this.mousePos);
      if (!gridPos || Grid.isOccupied(this.engine.grid, gridPos)) {
        return;
      }

      this.addBot(bot, gridPos);
    },
    keyDown(keyEvent) {
      // Prevent multiple events when holding down a key:
      if (this.lastKeyPressed == keyEvent.key) {
        return;
      }
      this.lastKeyPressed = keyEvent.key;
      if (keyEvent.key == "a") {
        this.addBotAtMousePos(this.botA);
      } else if (keyEvent.key == "b") {
        this.addBotAtMousePos(this.botB);
      }
    },
    keyUp(keyEvent) {
      this.lastKeyPressed = undefined;
    },
    mouseMove(event) {
      var rect = this.$refs.canvas.getBoundingClientRect();
      this.mousePos = {
        x: Math.floor(event.clientX - rect.left),
        y: Math.floor(event.clientY - rect.top),
      };
    },
    loop() {
      if (!this.paused) {
        this.engine.step();
      }
      this.renderer.render(this.engine);
      setTimeout(this.loop, 50);
    },
    async benchmark() {
      if (!window.BENCHMARK_MAX_ITERATIONS) {
        window.BENCHMARK_MAX_ITERATIONS = 100;
      }
      let maxIterations = window.BENCHMARK_MAX_ITERATIONS;
      let pointMap = new Map();
      for (let i = 1; i <= maxIterations; i++) {
        this.randomizeBots();
        this.engine.debug = false;

        // flip bot starting order every iteration:
        let tempBot = this.botA;
        this.botA = this.botB;
        this.botB = tempBot;

        while (!this.engine.expired) {
          await new Promise(resolve => {
            this.engine.step();
            resolve();
          });
        }
        let winners = this.engine.winners
          .filter(x => x.points == this.engine.winners[0].points);
        for (let winner of winners) {
          if (!pointMap.has(winner.id)) {
            pointMap.set(winner.id, {
              ...winner,
              wins: 0
            });
          }
          if (winners.length == 1)
            pointMap.get(winner.id).wins++;
        }
        console.log(`Running iteration ${i}/${maxIterations}`);
      }
      console.log("=================");
      console.log("BENCHMARK RESULTS:");
      // console.log(pointMap); // <-- Full data (works for > 2 bots);
      let winsA = pointMap.get(this.botA.id).wins;
      let winsB = pointMap.get(this.botB.id).wins;
      let winsApercent = (winsA / maxIterations * 100).toFixed(1);
      let winsBpercent = (winsB / maxIterations * 100).toFixed(1);
      console.log(`Bot A wins: ${winsA}/${maxIterations} (${winsApercent}%)`);
      console.log(`Bot B wins: ${winsB}/${maxIterations} (${winsBpercent}%)`);
      console.log("      Ties: ", maxIterations - (winsA + winsB));

      this.engine.debug = true;
    }
  },
};
</script>

<style scoped lang="scss">
.tip {
  font-style: italic;
  color: #999;
}

.winner-box {
  width: 250px;
}

.canvas-style {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  margin: auto;
  box-shadow: 0 0 18px 5px black;
}

.editor > div {
  width: 100%;
}

.editor {
  min-width: 700px;
  display: inline-flex;
  flex-direction: column;
  align-items: baseline;
  gap: 25px;

  .controls {
    text-align: left;
    padding-bottom: 5px;
    display: flex;
    gap: 10px;
    align-items: flex-start;

    .multi-control {
      display: inline-flex;
      flex-direction: column;
      align-items: baseline;
      gap: 5px;

      * {
        width: 100%;
      }

      .pos-input {
        max-width: 85px;
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

.no-gap {
  gap: 0px;
}

.flex-box-col {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
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
  border: 3px solid #fff;
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
