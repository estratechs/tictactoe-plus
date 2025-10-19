
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/tictactoe-plus/',
  plugins: [react()],
  build: { sourcemap: false, target: 'es2019' }
})
