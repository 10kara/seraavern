import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://10kara.github.io/seraavern/
export default defineConfig({
  base: '/seraavern/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // Dev-сервер доступен в веб-превью (0.0.0.0 + разрешённый внешний хост).
  server: {
    host: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
})
