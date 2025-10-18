export type Player = "X" | "O";
export type Cell = Player | null;

export const emptyBoard = (n: number): Cell[] => Array(n*n).fill(null);

export const linesFor = (n: number): number[][] => {
  const lines: number[][] = [];
  // rows
  for (let r=0; r<n; r++) {
    const row: number[] = [];
    for (let c=0; c<n; c++) row.push(r*n + c);
    lines.push(row);
  }
  // cols
  for (let c=0; c<n; c++) {
    const col: number[] = [];
    for (let r=0; r<n; r++) col.push(r*n + c);
    lines.push(col);
  }
  // diag   const diag1: number[] = [];
  for (let i=0; i<n; i++) diag1.push(i*n + i);
  lines.push(diag1);
  // diag /
  const diag2: number[] = [];
  for (let i=0; i<n; i++) diag2.push(i*n + (n-1-i));
  lines.push(diag2);
  return lines;
};

export const winner = (cells: Cell[], n: number): {player: Player, line: number[]} | null => {
  const lines = linesFor(n);
  for (const L of lines) {
    const [a, ...rest] = L;
    const v = cells[a];
    if (!v) continue;
    if (rest.every(i => cells[i] === v)) return { player: v, line: L };
  }
  return null;
};

export const isFull = (cells: Cell[]) => cells.every(c => c !== null);

export const nextPlayer = (cells: Cell[]): Player => {
  const x = cells.filter(c => c === "X").length;
  const o = cells.filter(c => c === "O").length;
  return x === o ? "X" : "O";
};

export const aiMove = (cells: Cell[]): number | null => {
  const idx = cells.findIndex(c => c === null);
  return idx >= 0 ? idx : null;
};
