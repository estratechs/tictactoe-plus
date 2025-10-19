// src/utils/pwaInstall.ts
// Drop-in helper to expose native PWA install from your menu.

let deferredPrompt: any = null;
let installed = false;
const listeners: Set<() => void> = new Set();

// Capture the PWA install event when the browser determines your app is installable.
window.addEventListener('beforeinstallprompt', (e: any) => {
  e.preventDefault();
  deferredPrompt = e;
  notify();
});

// Mark as installed once the user completes installation.
window.addEventListener('appinstalled', () => {
  installed = true;
  deferredPrompt = null;
  notify();
});

function notify(){ listeners.forEach((l) => l()); }

export function canInstall(){ return !!deferredPrompt && !installed; }

export async function triggerInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  const dp = deferredPrompt;
  // Clear so we don't reuse an old prompt.
  deferredPrompt = null;
  await dp.prompt();
  const choice = await (typeof dp.userChoice === "function" ? dp.userChoice() : dp.userChoice);
  notify();
  // Some browsers resolve to an object with { outcome: 'accepted' | 'dismissed' }
  return choice ? choice.outcome === 'accepted' : true;
}

// React hook (optional).
// Usage:
// const { canInstall, installed, install } = usePWAInstall();
// <button disabled={!canInstall} onClick={install}>Install</button>
import { useEffect, useState } from 'react';
export function usePWAInstall(){
  const [available, setAvailable] = useState(canInstall());
  const [isInstalled, setInstalled] = useState(installed);
  useEffect(() => {
    const l = () => { setAvailable(canInstall()); setInstalled(installed); };
    listeners.add(l); l();
    return () => { listeners.delete(l); };
  }, []);
  return { canInstall: available, installed: isInstalled, install: triggerInstall };
}
