export type Player = "X" | "O";
export type Cell = Player | null;

export const emptyBoard = (n: number): Cell[] => Array(n * n).fill(null);

export const linesFor = (n: number): number[][] => {
  const lines: number[][] = [];

  // rows
  for (let r = 0; r < n; r++) {
    const row: number[] = [];
    for (let c = 0; c < n; c++) row.push(r * n + c);
    lines.push(row);
  }
  // cols
  for (let c = 0; c < n; c++) {
    const col: number[] = [];
    for (let r = 0; r < n; r++) col.push(r * n + c);
    lines.push(col);
  }
  // diagonals
  const d1: number[] = [];
  const d2: number[] = [];
  for (let i = 0; i < n; i++) {
    d1.push(i * n + i);
    d2.push(i * n + (n - 1 - i));
  }
  lines.push(d1, d2);

  return lines;
};

export const winner = (
  cells: Cell[],
  n: number
): { player: Player; line: number[] } | null => {
  const lines = linesFor(n);
  for (const L of lines) {
    const first = cells[L[0]];
    if (!first) continue;
    if (L.every((i) => cells[i] === first)) {
      return { player: first, line: L };
    }
  }
  return null;
};

export const isFull = (cells: Cell[]) => cells.every((c) => c !== null);

export const nextPlayer = (cells: Cell[]): Player => {
  const x = cells.filter((c) => c === "X").length;
  const o = cells.filter((c) => c === "O").length;
  return x === o ? "X" : "O";
};

/** Dumb AI: take center > corner > first empty. */
export const aiMove = (
  cells: Cell[],
  n = Math.sqrt(cells.length)
): number | null => {
  const N = typeof n === "number" ? n : Math.floor(n as any);
  const emptyIdxs = cells.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  if (emptyIdxs.length === 0) return null;

  const center = Math.floor((N * N) / 2);
  if (cells[center] === null) return center;

  const corners = [0, N - 1, N * (N - 1), N * N - 1];
  for (const c of corners) if (cells[c] === null) return c;

  return emptyIdxs[0];
};
