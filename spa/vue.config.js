import { defineConfig } from '@vue/cli-service';
export default defineConfig({
  publicPath: '/tronbox/',
  outputDir: './dist',
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