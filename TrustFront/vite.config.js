import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import path from 'path'

const PROXY_TARGET = process.env.VITE_PROXY_TARGET || 'http://54.66.146.131:8080'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      // 개발 중 직접 경로로 호출할 경우 대비
      '/product': {
        target: PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      '/item': {
        target: PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: { global: 'globalThis' },
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true, process: true })],
    },
  },
})
