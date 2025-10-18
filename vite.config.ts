
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change '/tictactoe-plus/' to your repo name if using project pages
export default defineConfig({
  base: '/tictactoe-plus/',
  plugins: [react()]
})
