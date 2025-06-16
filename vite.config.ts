import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7282/api',
        changeOrigin: true,
        secure: false, // Allow self-signed SSL
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
