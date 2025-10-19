import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Change base if your repo name is different
export default defineConfig({
  base: "/tictactoe-plus/",
  plugins: [react()],
  build: {
    target: "es2019",
    sourcemap: false
  },
  server: {
    port: 5173,
    open: true
  }
});
