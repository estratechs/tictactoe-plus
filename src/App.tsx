import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tile } from "./components/Tile";
import {
  Cell,
  emptyBoard,
  isFull,
  nextPlayer,
  winner,
  aiMove,
} from "./utils/game";

type Mode = 3 | 4 | 5;

const useFlags = () => {
  const q = new URLSearchParams(location.search);
  const getBool = (k: string, d: boolean) => {
    const v = q.get(k);
    if (v === "1" || v === "true") return true;
    if (v === "0" || v === "false") return false;
    return d;
  };
  const getNum = (k: string, d: number) => {
    const v = q.get(k);
    return v ? Math.max(3, Math.min(5, Number(v))) || d : d;
  };
  return {
    n: getNum("n", 3) as Mode,
    vsAI: getBool("ai", true),
  };
};

export const App = () => {
  const { n, vsAI } = useFlags();

  const [cells, setCells] = useState<Cell[]>(() => emptyBoard(n));
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);

  // derived
  const turn = useMemo(() => nextPlayer(cells), [cells]);
  const win = useMemo(() => winner(cells, n), [cells, n]);
  const draw = !win && isFull(cells);

  // simple AI (plays as O)
  useEffect(() => {
    if (!vsAI || win || draw || turn !== "O") return;
    const idx = aiMove(cells, n);
    if (idx == null) return;
    const t = setTimeout(() => {
      setCells((prev) => prev.map((v, i) => (i === idx ? "O" : v)));
    }, 300);
    return () => clearTimeout(t);
  }, [vsAI, win, draw, turn, cells, n]);

  // scoring
  useEffect(() => {
    if (!win) return;
    if (win.player === "X") setXScore((s) => s + 1);
    else setOScore((s) => s + 1);
  }, [win]);

  const placeAt = (i: number) => {
    if (cells[i] || win) return;
    setCells((prev) => prev.map((v, idx) => (idx === i ? turn : v)));
  };

  const reset = () => setCells(emptyBoard(n));

  // board geometry
  const boardPx = Math.min(110 * n + 10 * (n - 1), 110 * 5 + 10 * 4);
  const gap = 10;

  // win line geometry
  const lineGeom = useMemo(() => {
    if (!win) return null;
    const idxs = win.line;
    const first = idxs[0],
      last = idxs[idxs.length - 1];
    const fc = first % n,
      fr = Math.floor(first / n);
    const lc = last % n,
      lr = Math.floor(last / n);
    const cell = (boardPx - gap * (n - 1)) / n;

    let x = 0,
      y = 0,
      length = 0,
      angle = 0;

    if (fr === lr) {
      // horizontal
      length = (cell + gap) * (n - 1) + 1;
      angle = 0;
      y = fr * (cell + gap) + cell / 2;
      x = cell / 2;
    } else if (fc === lc) {
      // vertical
      length = (cell + gap) * (n - 1) + 1;
      angle = 90;
      x = fc * (cell + gap) + cell / 2;
      y = cell / 2;
    } else if (fr < lr && fc < lc) {
      // diag TL → BR
      length = Math.sqrt(2) * ((cell + gap) * (n - 1) + 1);
      angle = 45;
      x = cell / 4;
      y = cell / 4;
    } else {
      // diag BL → TR
      length = Math.sqrt(2) * ((cell + gap) * (n - 1) + 1);
      angle = -45;
      x = cell / 4;
      y = boardPx - cell / 4 - 6;
    }
    return { x, y, length, angle };
  }, [win, n, boardPx, gap]);

  return (
    <div className="app">
      <div className="hud">
        <div>
          Turn: <strong>{turn}</strong>
        </div>
        <div>
          Score — X: <strong>{xScore}</strong> · O: <strong>{oScore}</strong>
        </div>
        {(win || draw) && (
          <button onClick={reset} aria-label="New game">
            New game
          </button>
        )}
      </div>

      <motion.div
        className="board"
        style={{
          width: boardPx,
          height: boardPx,
          display: "grid",
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gap,
        }}
        initial={false}
        animate={{ rotateX: 0, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        {cells.map((v, i) => (
          <Tile
            key={i}
            value={v}
            onClick={() => placeAt(i)}
            disabled={vsAI && turn === "O"}
          />
        ))}
      </motion.div>

      {lineGeom && (
        <div
          aria-hidden
          style={{
            position: "relative",
            width: boardPx,
            height: 0,
            marginTop: -boardPx,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: lineGeom.x,
              top: lineGeom.y,
              width: lineGeom.length,
              height: 6,
              transform: `rotate(${lineGeom.angle}deg) translate(-50%, -50%)`,
              transformOrigin: "0 50%",
              borderRadius: 999,
              background: "currentColor",
              opacity: 0.7,
            }}
          />
        </div>
      )}

      <div className="footer">
        <div className="small">Tip: press “New game” after a round</div>
      </div>
    </div>
  );
};
