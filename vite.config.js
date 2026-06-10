import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures relative paths work on GitHub Pages regardless of repo name
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600, // Three.js can be quite large
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three';
            }
            if (id.includes('gsap')) {
              return 'gsap';
            }
            if (id.includes('react')) {
              return 'vendor';
            }
          }
        }
      }
    }
  }
})
