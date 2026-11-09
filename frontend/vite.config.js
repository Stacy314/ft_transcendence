import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Where the Rails backend runs during development.
  // Override in frontend/.env, e.g. API_PROXY_TARGET=http://localhost:3001
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.API_PROXY_TARGET || 'http://localhost:3000';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true, // reachable from Docker and other devices on the network
      port: 5173,
      proxy: {
        // REST API → Rails. The browser only ever talks to :5173, so the
        // session cookie is first-party and no CORS is needed.
        // changeOrigin stays false on purpose: Rails checks that the Origin
        // header matches the Host header for CSRF protection, and both must
        // stay "localhost:5173".
        '/api': { target, changeOrigin: false },
        // Action Cable (WebSockets) → Rails
        '/cable': {
          target: target.replace(/^http/, 'ws'),
          ws: true,
          changeOrigin: false,
        },
      },
    },
  };
});