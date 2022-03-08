const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/tronbox/',
  outputDir: '../docs',
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3080',
        changeOrigin: true
      }
    }
  },
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import '@/styles/global.scss';
        `
      }
    }
  }
});