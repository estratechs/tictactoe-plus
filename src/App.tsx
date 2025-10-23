import { useMemo, useRef, useState, useEffect } from "react";
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}


import { motion } from "framer-motion";
import { AnimatedBg } from "./components/AnimatedBg";
import { Tile } from "./components/Tile";
import { WinLine } from "./components/WinLine";
import { aiMove, Cell, emptyBoard, isFull, nextPlayer, winner } from "./utils/game";
import { spawnConfetti } from "./utils/confetti";
import { useBoardTilt } from "./hooks/useBoardTilt";

type Mode = 3 | 4 | 5;

const useFlags = () => {
  const q = new URLSearchParams(location.search);
  const get = (k:string, d:boolean) => {
    const v = q.get(k); if (v === "1" || v === "true") return true; if (v === "0" || v === "false") return false; return d;
  };
  return { anim: get("anim", true), tilt: get("tilt", true), confetti: get("confetti", true), sounds: get("sounds", true), nuke: get("nuke", false) };
};

const useSound = (enabled: boolean) => {
  const ctxRef = useRef<AudioContext | null>(null);
  const beep = (freq: number, dur = 0.07, type: OscillatorType = "sine") => {
    if (!enabled) return;
    try {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = ctxRef.current;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.start(); o.stop(ctx.currentTime + dur);
    } catch {}
  };
  return { place: () => beep(420, 0.06, "triangle"), invalid: () => beep(160, 0.08, "sawtooth"), win: () => { [660,880,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.09,"sine"), i*80)); }, };
};

export const App = () => {
  const flags = useFlags();
  // Optional SW/cache nuke on demand (?nuke=1)
  useEffect(() => {
    if (flags.nuke && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
      if ('caches' in window) caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
      console.log("[TTT+] Service worker & caches cleared (nuke=1). Reloading...");
      setTimeout(() => location.reload(), 250);
    }
  }, []);

  const [n, setN] = useState<Mode>(3);
  const [cells, setCells] = useState<Cell[]>(() => emptyBoard(3));
  const [vsAI, setVsAI] = useState(false);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const sounds = useSound(flags.sounds);
  const win = useMemo(() => winner(cells, n), [cells, n]);
  const turn = nextPlayer(cells);
  const tiltRef = flags.tilt ? useBoardTilt() : { current: null as any };

  useEffect(() => { setCells(emptyBoard(n)); }, [n]);

  useEffect(() => {
    if (!vsAI || win || isFull(cells)) return;
    if (turn === "O") {
      const t = setTimeout(() => {
        const idx = aiMove(cells);
        if (idx != null) setCells(prev => prev.map((v,i)=> i===idx ? "O" : v));
      }, 300);
      return () => clearTimeout(t);
    }
  }, [vsAI, win, cells, turn]);

  useEffect(() => {
    if (win) {
      if (win.player === "X") setXScore(s => s+1); else setOScore(s => s+1);
      if (flags.confetti) {
        const wrap = document.querySelector(".board-wrap") as HTMLElement | null;
        if (wrap) { const r = wrap.getBoundingClientRect(); spawnConfetti(r.left + r.width/2, r.top + r.height/2); }
      }
      try { if (navigator.vibrate) navigator.vibrate([30]); } catch {}
    }
  }, [win]);

  const placeAt = (i: number) => {
    if (cells[i] || win) { sounds.invalid(); return; }
    setCells(prev => prev.map((v, idx) => idx === i ? turn : v));
    sounds.place();
  };

  const reset = () => setCells(emptyBoard(n));

  const boardPx = Math.min(110*n + 10*(n-1), 110*5 + 10*4);
  const gap = 10;
  const lineGeom = (() => {
    if (!win) return null;
    const idxs = win.line;
    const first = idxs[0], last = idxs[idxs.length-1];
    const fc = first % n, fr = Math.floor(first / n);
    const lc = last % n, lr = Math.floor(last / n);
    const cell = (boardPx - gap*(n-1))/n;
    let x = Math.min(fc, lc)* (cell+gap) + cell/2;
    let y = Math.min(fr, lr)* (cell+gap) + cell/2;
    let length = 0, angle = 0;
    if (fr === lr) { length = (cell+gap)*(n-1) + 1; angle = 0; y = fr*(cell+gap) + cell/2; x = 0 + cell/2; }
    else if (fc === lc) { length = (cell+gap)*(n-1) + 1; angle = 90; x = fc*(cell+gap) + cell/2; y = 0 + cell/2; }
    else if (fr < lr && fc < lc) { length = Math.sqrt(2) * ((cell+gap)*(n-1) + 1); angle = 45; x = 0 + cell/4; y = 0 + cell/4; }
    else { length = Math.sqrt(2) * ((cell+gap)*(n-1) + 1); angle = -45; x = 0 + cell/4; y = boardPx - cell/4 - 6; }
    return { x, y, length, angle };
  })();

  return (
    <>
      <AnimatedBg />
      <div className="container">
        <div className="header">
          <h1>Tic-Tac-Toe <span style={{ color: "var(--accent)" }}>Plus</span></h1>
          <div className="toolbar" role="toolbar" aria-label="Game controls">
            <select className="select" value={n} onChange={e => setN(Number(e.target.value) as Mode)} aria-label="Board size">
              <option value={3}>3×3</option><option value={4}>4×4</option><option value={5}>5×5</option>
            </select>
            <button className="button" onClick={reset}>Reset</button>
            <label style={{ display:"inline-flex", alignItems:"center", gap:1 }}>
              <input type="checkbox" checked={vsAI} onChange={e => setVsAI(e.target.checked)} aria-label="Play versus AI" /> Vs AI
            </label>
          </div>
        </div>
        <div className="status" aria-live="polite">
          {!win && !isFull(cells) && <span>Turn: <strong>{turn}</strong></span>}
          {win && <span>Winner: <strong style={{ color: "var(--win)" }}>{win.player}</strong></span>}
          {!win && isFull(cells) && <span>Draw!</span>}
        </div>
        <div className="board-wrap" style={{ width: boardPx, height: boardPx }}>
          <motion.div
            ref={flags.tilt ? (useBoardTilt() as any) : undefined}
            className="board"
            style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, width: "100%", height: "100%" }}
            initial={flags.anim ? { opacity: 0, y: 12 } : false}
            animate={flags.anim ? { opacity: 1, y: 0 } : undefined}
            transition={flags.anim ? { duration: .3 } : undefined}
          >
            {cells.map((v, i) => (
              <Tile key={i} value={v} onClick={() => placeAt(i)} disabled={vsAI && turn === "O"} />
            ))}
          </motion.div>
          {lineGeom && <WinLine x={lineGeom.x} y={lineGeom.y} length={lineGeom.length} angle={lineGeom.angle} show={!!win} />}
        </div>
        <div className="footer">
          <div>Score — X: <strong>{xScore}</strong> · O: <strong>{oScore}</strong></div>
        </div>
      </div>
    </>
  );
};


// Simple settings footer
export function SettingsFooter(){
  const [anim, setAnim] = useLocalStorage('t3.anim', true);
  const [sound, setSound] = useLocalStorage('t3.sound', false);
  return (
    <div style={{marginTop:24, display:'flex', gap:16, justifyContent:'center', fontSize:14}}>
      <label><input type="checkbox" checked={anim} onChange={e=>setAnim(e.target.checked)} /> Animations</label>
      <label><input type="checkbox" checked={sound} onChange={e=>setSound(e.target.checked)} /> Sound</label>
    </div>
  );
}
