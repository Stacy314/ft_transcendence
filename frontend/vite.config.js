import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync } from 'node:fs'

const isDocker = existsSync('/.dockerenv')
const apiTarget = process.env.VITE_API_TARGET || (isDocker ? 'http://backend:3000' : 'http://localhost:3000')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
})