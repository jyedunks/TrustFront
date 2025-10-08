import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ✅ server는 최상위에만!
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
  },

  optimizeDeps: {
    // ✅ 여긴 esbuild 옵션만 (server 금지)
    esbuildOptions: {
      // globalThis가 없을 때 window로 대체
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
})