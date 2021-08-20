import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => /^x-/.test(tag)
        }
      }
    }),
    vueJsx()
  ],
  server: {
    proxy: {
      "/api": "http://localhost:9081",
      "/login": "http://localhost:9081"
    }
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  base: '/',
  build: {
    outDir: '../backend/src/main/resources/static',
    rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        }
    }

  }

});
