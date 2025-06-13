import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      assets: path.resolve(__dirname, './src/assets'),
      utils: path.resolve(__dirname, './src/utils'),
      context: path.resolve(__dirname, './src/context'),
      Hook: path.resolve(__dirname, './src/Hook'),
    },
  },
  server: {
    proxy: {
      "/api": "http://213.210.21.186:7001"
    },},
   base: '/',
  plugins: [react()],
});
