import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedBg } from "./components/AnimatedBg";
import { Tile } from "./components/Tile";
import { WinLine } from "./components/WinLine";
import { aiMove, Cell, emptyBoard, isFull, nextPlayer, winner } from "./utils/game";
import { spawnConfetti } from "./utils/confetti";
import { useBoardTilt } from "./hooks/useBoardTilt";

type Mode = 3 | 4 | 5;

const useSound = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const beep = (freq: number, dur = 0.07, type: OscillatorType = "sine") => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = ctxRef.current;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.start(); o.stop(ctx.currentTime + dur);
  };
  return {
    place: () => beep(420, 0.06, "triangle"),
    invalid: () => beep(160, 0.08, "sawtooth"),
    win: () => { [660, 880, 1046].forEach((f,i)=>setTimeout(()=>beep(f,0.09,"sine"), i*80)); },
  };
};

export const App = () => {
  const [n, setN] = useState<Mode>(3);
  const [cells, setCells] = useState<Cell[]>(() => emptyBoard(3));
  const [vsAI, setVsAI] = useState(false);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const sounds = useSound();
  const win = useMemo(() => winner(cells, n), [cells, n]);
  const turn = nextPlayer(cells);
  const tiltRef = useBoardTilt();

  useEffect(() => {
    setCells(emptyBoard(n));
  }, [n]);

  // AI turn
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
      sounds.win();
      // confetti from center of winning line
      const rect = (document.querySelector(".board-wrap") as HTMLElement)?.getBoundingClientRect();
      if (rect) spawnConfetti(rect.left + rect.width/2, rect.top + rect.height/2);
      if (navigator.vibrate) navigator.vibrate([30]);
    }
  }, [win]);

  const placeAt = (i: number) => {
    if (cells[i] || win) { sounds.invalid(); return; }
    setCells(prev => prev.map((v, idx) => idx === i ? turn : v));
    sounds.place();
  };

  const reset = () => setCells(emptyBoard(n));

  // layout for board + win line geometry
  const boardPx = Math.min(110*n + 10*(n-1), 110*5 + 10*4);
  const gap = 10;
  const lineGeom = (() => {
    if (!win) return null;
    const idxs = win.line;
    const first = idxs[0], last = idxs[idxs.length-1];
    const fc = first % n, fr = Math.floor(first / n);
    const lc = last % n, lr = Math.floor(last / n);
    const cell = (boardPx - gap*(n-1))/n;
    const x = Math.min(fc, lc)* (cell+gap) + cell/2;
    const y = Math.min(fr, lr)* (cell+gap) + cell/2;
    let length = 0, angle = 0;
    if (fr === lr) { // row
      length = (cell+gap)*(n-1) + 1;
      angle = 0;
      y = fr*(cell+gap) + cell/2;
      x = 0 + cell/2;
    } else if (fc === lc) { // col
      length = (cell+gap)*(n-1) + 1;
      angle = 90;
      x = fc*(cell+gap) + cell/2;
      y = 0 + cell/2;
    } else if (fr < lr && fc < lc) { // diag       length = Math.sqrt(2) * ((cell+gap)*(n-1) + 1);
      angle = 45;
      x = 0 + cell/4; y = 0 + cell/4;
    } else { // diag /
      length = Math.sqrt(2) * ((cell+gap)*(n-1) + 1);
      angle = -45;
      x = 0 + cell/4; y = boardPx - cell/4 - 6;
    }
    return { x, y, length, angle };
  })();

  return (
    <>
      <AnimatedBg />
      <div className="container">
        <div className="header">
          <h1>Tic‑Tac‑Toe <span style={{ color: "var(--accent)" }}>Plus</span></h1>
          <div className="toolbar" role="toolbar" aria-label="Game controls">
            <select
              className="select"
              value={n}
              onChange={e => setN(Number(e.target.value) as Mode)}
              aria-label="Board size"
            >
              <option value={3}>3×3</option>
              <option value={4}>4×4</option>
              <option value={5}>5×5</option>
            </select>
            <button className="button" onClick={reset}>Reset</button>
            <label style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
              <input
                type="checkbox"
                checked={vsAI}
                onChange={e => setVsAI(e.target.checked)}
                aria-label="Play versus AI"
              />
              Vs AI
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
            ref={tiltRef}
            className="board"
            style={{
              gridTemplateColumns: `repeat(${n}, 1fr)`,
              width: "100%", height: "100%",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .3 }}
          >
            {cells.map((v, i) => (
              <Tile key={i} value={v} onClick={() => placeAt(i)} disabled={vsAI && turn === "O"} />
            ))}
          </motion.div>
          {lineGeom && (
            <WinLine
              x={lineGeom.x}
              y={lineGeom.y}
              length={lineGeom.length}
              angle={lineGeom.angle}
              show={!!win}
            />
          )}
        </div>

        <div className="footer">
          <div>Score — X: <strong>{xScore}</strong> · O: <strong>{oScore}</strong></div>
          <div className="small">Tip: hover the board for a subtle 3D tilt</div>
        </div>
      </div>
    </>
  );
};
