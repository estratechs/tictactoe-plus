import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: set base to repo name for project pages
export default defineConfig({
  base: '/tictactoe-plus/',
  plugins: [react()],
  build: {
    sourcemap: false,
    target: 'es2019'
  }
})
