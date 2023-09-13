import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: "/~juli22/jsramverk",
  test: {
    coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html', 'clover'],
        include: 'src/components/*.view'
    }
  }
})
