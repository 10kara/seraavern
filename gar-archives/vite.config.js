import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://10kara.github.io/gar-archives/
export default defineConfig({
  base: '/gar-archives/',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
})
