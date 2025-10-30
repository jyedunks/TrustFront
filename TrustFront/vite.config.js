import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import path from 'path'

// 환경변수로 덮어쓸 수 있음: VITE_PROXY_TARGET=http://<host>:<port>
const PROXY_TARGET = process.env.VITE_PROXY_TARGET || 'http://54.66.146.131:8080'

export default defineConfig({
  plugins: [react()],

  // 경로 별칭 (예: "@/api/chat")
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ✅ dev 서버 + 프록시
  server: {
    proxy: {
      '/api': {
        target: 'http://54.66.146.131:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // "/api/chat/.." -> "/chat/.."
      },
    },
  },


  // ✅ esbuild 최적화 옵션 (여기에 server 넣지 않기)
  optimizeDeps: {
    esbuildOptions: {
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

