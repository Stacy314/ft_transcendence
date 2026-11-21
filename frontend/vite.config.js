import path from 'node:path';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Docker supplies environment variables instead of copying the root .env file.
  const envDir = path.resolve(process.cwd(), '..');
  const env = loadEnv(mode, envDir, '');

  const target = env.API_PROXY_TARGET || 'http://localhost:3000';

  return {
    envDir,
    plugins: [react(), tailwindcss()],
    server: {
      host: true, // reachable from Docker and other devices on the network
      port: 5173,
      proxy: {
        // Preserve Host so it matches Origin for Rails' CSRF check.
        '/api': {
          target,
          changeOrigin: false,
        },
        '/cable': {
          target: target.replace(/^http/, 'ws'),
          ws: true,
          changeOrigin: false,
        },
      },
    },
  };
});