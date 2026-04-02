import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// or: host: "0.0.0.0"
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build"
  },
  server: {
    host: true
  }
})
