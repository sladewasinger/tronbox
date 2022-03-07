<template>
  <h1>Tronbox</h1>
  <div class="row mt-5">
    <div class="col-8">
      <TronBox :ref="childCanvs" canvas-id="'grid'" />
    </div>
  </div>
</template>

<script>
import TronBox from "./components/tron-box/tron-box.vue";

export default {
  name: "App",
  components: {
    TronBox
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
