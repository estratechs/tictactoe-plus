# Feature Pack (Add-Only)
Included:
- Undo/Redo hook and toolbar (`src/hooks/useHistory.ts`, `src/components/UndoRedoBar.tsx`)
- Haptics + sound utils (`src/utils/haptics.ts`, `src/utils/sound.ts`)
- Theme system (`src/styles/theme.css`) with dark/light/high-contrast and dynamic `theme-color`
- Open Graph / Twitter meta in `index.html`
- Improved service worker caching (`public/sw.js`)
- Settings footer & install nudge injected into `App.tsx` (exported for easy use)

Usage:
- Render `<SettingsFooter />` and `<UndoRedoBar .../>` where appropriate in your UI.
- Use `useHistory` to manage game state time-travel.
- Call `haptics.tap()` on moves and `haptics.win()` on win; `blip()` for optional sound.
