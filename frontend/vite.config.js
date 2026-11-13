import path from 'node:path';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // The project keeps ONE .env file, in the repository root (one level up).
  // In Docker that file is not inside the image; there the values come from
  // the container's environment variables instead, which loadEnv also reads.
  const envDir = path.resolve(process.cwd(), '..');
  const env = loadEnv(mode, envDir, '');

  // Where the Rails backend runs during development,
  // e.g. API_PROXY_TARGET=http://localhost:3001 in the root .env
  const target = env.API_PROXY_TARGET || 'http://localhost:3000';

  return {
    envDir, // VITE_* variables for the browser also come from the root .env
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
        '/api': {
          target,
          changeOrigin: false,
          // headers: { origin: 'https://localhost:5173' }, // TEMP: backend runs in production, remove before commit!
        },
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