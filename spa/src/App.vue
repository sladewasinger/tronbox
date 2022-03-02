<template>
  <h1>Tronbox</h1>
  <div class="row mt-5">
    <div class="col-8">
      <GridCanvas :canvas-id="'grid'" ref="childCanvs" />
    </div>
  </div>
</template>

<script>
import GridCanvas from "./components/grid-canvas/grid-canvas.vue";

export default {
  name: "App",
  components: {
    GridCanvas,
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
