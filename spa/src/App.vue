<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <!-- canvas single -->
  <div class="row mt-5">
    <div class="col-2" />
    <div class="col-8">
      <Canvas :canvas-id="'canvas-one'" ref="childCanvas" />
    </div>
    <div class="col-2" />
  </div>
</template>

<script>
import Canvas from "./components/canvas/Canvas.vue";

export default {
  name: "App",
  components: {
    Canvas,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
