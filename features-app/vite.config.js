import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/features/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 8192,
    cssCodeSplit: false,
    sourcemap: false,
  },
});
