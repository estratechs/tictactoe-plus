# PWA Install Fix
- Removed the in-page "Install this app for offline play" nudge.
- Added `src/utils/pwaInstall.ts` with `usePWAInstall`, `triggerInstall`, and `canInstall`.
- Exported these from `App.tsx` so your existing menu can trigger install.
- Included an optional `InstallToHomeMenuItem.tsx` button if you want a ready-made component.

## How to wire your existing menu
```ts
import { triggerInstall, canInstall } from "./utils/pwaInstall";

// on click
if (canInstall()) { await triggerInstall(); }
```

Or use the React hook:
```tsx
import { usePWAInstall } from "./utils/pwaInstall";
const { canInstall, install } = usePWAInstall();
<button disabled={!canInstall} onClick={install}>Install App to Home Screen</button>
```
