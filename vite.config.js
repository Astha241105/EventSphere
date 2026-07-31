import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://eventsphere-backend-he6w.onrender.com',  // ← must match your backend port
        changeOrigin: true,
      }
    }
  }
})
