// src/utils/pwaInstall.ts
// Cross‑platform PWA install helpers with fallbacks for Android/Windows (native) and iOS (manual A2HS).

let deferredPrompt: any = null;
let _installed = false;
const listeners: Set<() => void> = new Set();

type Platform = 'android' | 'ios' | 'windows' | 'mac' | 'linux' | 'unknown';

export function getPlatform(): Platform {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
  if (isIOS) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (navigator.userAgent.includes('Windows')) return 'windows';
  if (navigator.userAgent.includes('Mac')) return 'mac';
  if (navigator.userAgent.includes('Linux')) return 'linux';
  return 'unknown';
}

export function isStandalone(): boolean {
  // Works for installed PWAs and iOS added to Home Screen
  const mql = window.matchMedia && (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches
  );
  const iosStandalone = (window.navigator as any).standalone === true;
  return !!mql || iosStandalone;
}

function notify(){ listeners.forEach(l => l()); }

// Capture native prompt (Chrome/Edge/Android + Desktop where available)
window.addEventListener('beforeinstallprompt', (e: any) => {
  e.preventDefault();
  deferredPrompt = e;
  notify();
});

// Track installed
window.addEventListener('appinstalled', () => {
  _installed = true;
  deferredPrompt = null;
  notify();
});

export function canInstallNative(): boolean {
  return !!deferredPrompt && !_installed;
}

export async function triggerInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  const dp = deferredPrompt;
  deferredPrompt = null; // one-shot
  await dp.prompt();
  const choice = await (typeof dp.userChoice === "function" ? dp.userChoice() : dp.userChoice);
  notify();
  return choice ? choice.outcome === 'accepted' : true;
}

// High-level API the menu can call. This handles platform specifics.
// Returns: { started: boolean, mode: 'native'|'ios-manual'|'unavailable', platform }
export async function platformInstall(): Promise<{started:boolean; mode:'native'|'ios-manual'|'unavailable'; platform: Platform}> {
  const platform = getPlatform();
  if (isStandalone()) return { started:false, mode:'unavailable', platform };
  if (canInstallNative()) {
    const ok = await triggerInstall();
    return { started: ok, mode: 'native', platform };
  }
  // iOS Safari never fires beforeinstallprompt; show manual flow
  if (platform === 'ios') {
    return { started: true, mode: 'ios-manual', platform };
  }
  // Desktop (Windows/Mac/Linux): native prompt might be gated by engagement heuristics.
  // If not available, you'll need to rely on the browser's menu (Chrome/Edge: "Install app").
  return { started:false, mode:'unavailable', platform };
}

// React hook for UI bindings
import { useEffect, useState } from 'react';
export function usePWAInstall(){
  const [platform, setPlatform] = useState<Platform>(getPlatform());
  const [available, setAvailable] = useState(canInstallNative());
  const [installed, setInstalled] = useState(isStandalone());
  useEffect(() => {
    const l = () => { setAvailable(canInstallNative()); setInstalled(isStandalone()); setPlatform(getPlatform()); };
    listeners.add(l); l();
    return () => { listeners.delete(l); };
  }, []);
  return { platform, canInstall: available || platform === 'ios', installed, install: platformInstall };
}
