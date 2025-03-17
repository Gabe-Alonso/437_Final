import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), checker({ typescript: true })],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false // if your backend serves over HTTP, not HTTPS
      },
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  base: ""
});
