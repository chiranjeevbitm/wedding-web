import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { apiDevPlugin } from './scripts/api-dev-plugin.mjs';

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  server: { port: 5173 },
  build: { outDir: 'dist', sourcemap: false, chunkSizeWarningLimit: 600 },
});
