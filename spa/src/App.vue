<template>
  <TronBox canvas-id="grid" />
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
@import "css-reset-and-normalize/css/reset-and-normalize.min.css";

body {
  background-color: #222;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
