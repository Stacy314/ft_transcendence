import path from 'node:path';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // The project keeps its .env file in the repository root (one level up).
  // Docker supplies environment variables instead of copying the root .env file.
  const envDir = path.resolve(process.cwd(), '..');
  const env = loadEnv(mode, envDir, '');

  // Rails backend for local development. Override with API_PROXY_TARGET
  // in the root .env when Rails runs on a different port.
  const target = env.API_PROXY_TARGET || 'http://localhost:3000';

  return {
    envDir, // VITE_* variables for the browser also come from the root .env
    plugins: [react(), tailwindcss()],
    server: {
      host: true, // reachable from Docker and other devices on the network
      port: 5173,
      proxy: {
        // Preserve Host so it matches Origin for Rails' CSRF check.
        // REST API → Rails. The browser talks to the Vite origin, so the
        // session cookie is first-party and no CORS is needed.
        '/api': {
          target,
          changeOrigin: false,
        },
        // Action Cable (WebSockets) → Rails.
        '/cable': {
          target: target.replace(/^http/, 'ws'),
          ws: true,
          changeOrigin: false,
        },
      },
    },
  };
});
