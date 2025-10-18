import type { Cell, Mark } from '../types'

export function linesFor(size: number, k: number): number[][] {
  // return all index-lines of length k that represent a possible 3-in-row on NxN (rows, cols, diags)
  const lines: number[][] = []
  const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < size && c < size
  const idx = (r: number, c: number) => r * size + c

  // rows & cols windows of length k
  for (let r=0; r<size; r++) for (let c=0; c<=size-k; c++)
    lines.push([...Array(k)].map((_,i)=> idx(r, c+i)))
  for (let c=0; c<size; c++) for (let r=0; r<=size-k; r++)
    lines.push([...Array(k)].map((_,i)=> idx(r+i, c)))

  // diags
  for (let r=0; r<=size-k; r++) for (let c=0; c<=size-k; c++)
    lines.push([...Array(k)].map((_,i)=> idx(r+i, c+i)))
  for (let r=0; r<=size-k; r++) for (let c=k-1; c<size; c++)
    lines.push([...Array(k)].map((_,i)=> idx(r+i, c-i)))

  return lines
}

export function checkWin(board: Cell[], size: number, k: number) {
  const L = linesFor(size, k)
  for (const line of L) {
    const [a,b,c] = line.map(i => board[i])
    if (a && line.every(i => board[i] === a)) return { winner: a as Mark, line }
  }
  if (board.every(c => c)) return { draw: true }
  return {}
}
