import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      formats: ['es'],
      fileName: () => 'sus-form.js',
    },
    rollupOptions: {
      // React é bundled junto (o MF é autocontido)
    },
  },
  server: {
    port: 5173,
    cors: true,
  },
});
