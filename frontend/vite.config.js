import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/analyze': 'http://127.0.0.1:8000',
      '/history': 'http://127.0.0.1:8000',
      '/analytics': 'http://127.0.0.1:8000',
      '/ws': {
        target: 'ws://127.0.0.1:8000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
})
