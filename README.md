
# TicTacToe+ (PWA)
Modern, animated, offline-first Tic-Tac-Toe with multiple modes and power-ups. Built with Vite + React + TypeScript.

## Dev
```bash
npm install
npm run dev
```
## Build
```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)
- Ensure `vite.config.ts` has `base: '/tictactoe-plus/'`
- Use the provided CI workflow in `.github/workflows/ci.yml`
- Repo Settings → Pages → Source = GitHub Actions
- Push to `main` → site at `https://<username>.github.io/tictactoe-plus/`
