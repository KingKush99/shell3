import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs' // Ensure the output directory is 'docs'
  },
  base: '/game-shell/' // Set the base path for GitHub Pages
})
