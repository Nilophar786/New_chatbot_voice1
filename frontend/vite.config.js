import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'react-icons', 'lottie-react', '@tsparticles/react', '@tsparticles/preset-stars'],
          router: ['react-router-dom'],
          utils: ['axios', 'react-speech-recognition', 'wavesurfer.js', 'react-tooltip', 'react-bootstrap'],
          animations: ['gsap', 'react-speech-recognition'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
