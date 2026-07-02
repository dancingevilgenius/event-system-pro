import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devRealtimePlugin from './vite-plugin-dev-realtime.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devRealtimePlugin()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/realtime': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/realtime/, ''),
      },
    },
  },
})
