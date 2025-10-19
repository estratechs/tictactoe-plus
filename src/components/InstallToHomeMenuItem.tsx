// src/components/InstallToHomeMenuItem.tsx
import * as React from "react";
import { usePWAInstall } from "@/utils/pwaInstall";

const iosStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.4
};

export const InstallToHomeMenuItem: React.FC = () => {
  const { platform, canInstall, installed, install } = usePWAInstall();
  const [showIOSHelp, setShowIOSHelp] = React.useState(false);
  const [unavailable, setUnavailable] = React.useState(false);

  if (installed) return null;

  async function onClick(){
    const res = await install();
    if (res.mode === 'ios-manual') {
      setShowIOSHelp(true);
    } else if (res.mode === 'unavailable') {
      setUnavailable(true);
    }
  }

  const label = platform === 'ios' ? "Add to Home Screen" : "Install App to Home Screen";

  return (
    <>
      <button type="button" onClick={onClick} disabled={!canInstall && platform !== 'ios'}>
        {label}
      </button>

      {/* iOS manual instructions */}
      {showIOSHelp && platform === 'ios' && (
        <div role="dialog" aria-modal="true" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"grid",placeItems:"center"}}>
          <div style={{background:"var(--bg,#0b0f1a)",color:"var(--fg,#e2e8f0)",padding:16,borderRadius:12,maxWidth:360}}>
            <h3 style={{marginTop:0}}>Add to Home Screen (iPhone/iPad)</h3>
            <ol style={iosStyle}>
              <li>Tap the <strong>Share</strong> icon in Safari.</li>
              <li>Scroll and choose <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong>.</li>
            </ol>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <button onClick={()=>setShowIOSHelp(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop/Windows fallback info */}
      {unavailable && platform !== 'ios' && (
        <div role="dialog" aria-modal="true" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"grid",placeItems:"center"}}>
          <div style={{background:"var(--bg,#0b0f1a)",color:"var(--fg,#e2e8f0)",padding:16,borderRadius:12,maxWidth:420}}>
            <h3 style={{marginTop:0}}>Install via Browser Menu</h3>
            <p style={{fontSize:14}}>
              Your browser may require a bit more browsing before it offers the native prompt.
              You can still install now via the browser menu:
            </p>
            <ul style={{fontSize:14}}>
              <li><strong>Windows / Chrome or Edge:</strong> Menu → <em>Install app</em>.</li>
              <li><strong>macOS / Chrome:</strong> Menu → <em>Install TicTacToe Plus</em>.</li>
            </ul>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <button onClick={()=>setUnavailable(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
