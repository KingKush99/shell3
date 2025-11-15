// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  // 👇 ADD THIS LINE (this is for GitHub Pages under /shell3/)
  base: '/shell3/',

  plugins: [react(), tailwindcss()],

  // This is only for localhost dev, totally fine to keep
  server: {
    port: 5839,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2015',
    rollupOptions: {
      output: {
        format: 'es',
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
