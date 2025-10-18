
# Tic‑Tac‑Toe Plus — Enhancement Pack

This folder contains **drop‑in files** to add arcade‑style animations and features
(3D tilt, tile flip, win line sweep, confetti, sounds, AI, 3×3/4×4/5×5 modes).

## How to use in your existing Vite + React project

1) **Copy the files** in `src/` into your project’s `src/`.
   - New: `src/components/AnimatedBg.tsx`, `src/components/Tile.tsx`, `src/components/WinLine.tsx`
   - New: `src/utils/confetti.ts`, `src/utils/game.ts`
   - New: `src/hooks/useBoardTilt.ts`
   - Update or add: `src/index.css`, `src/App.tsx`, `src/main.tsx`

2) **Ensure dependencies** (already in your project per your zip):
   ```bash
   npm i framer-motion
   ```

3) If your project already has its own `App.tsx`:
   - Either replace it with this enhanced version
   - Or extract just the pieces you want (Tile, WinLine, AnimatedBg, useBoardTilt, confetti, helpers)

4) **Accessibility & performance**
   - The status line uses `aria-live="polite"`
   - `prefers-reduced-motion` is respected in `src/index.css`

5) **Optional future upgrades**
   - Add minimax for Hard AI (replace `aiMove` in `utils/game.ts`)
   - Add online multiplayer via WebSockets
   - Add unlockable themes by tracking streaks in localStorage

## Run (if using the demo entry here)
```bash
npm run dev
```
Open http://localhost:5173
