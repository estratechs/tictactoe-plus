
import type { Cell, Mark } from '../types'

export function linesFor(size: number, k: number): number[][] {
  const lines: number[][] = []
  const idx = (r: number, c: number) => r * size + c
  for (let r=0; r<size; r++) for (let c=0; c<=size-k; c++)
    lines.push(Array.from({length:k}, (_,i)=> idx(r, c+i)))
  for (let c=0; c<size; c++) for (let r=0; r<=size-k; r++)
    lines.push(Array.from({length:k}, (_,i)=> idx(r+i, c)))
  for (let r=0; r<=size-k; r++) for (let c=0; c<=size-k; c++)
    lines.push(Array.from({length:k}, (_,i)=> idx(r+i, c+i)))
  for (let r=0; r<=size-k; r++) for (let c=k-1; c<size; c++)
    lines.push(Array.from({length:k}, (_,i)=> idx(r+i, c-i)))
  return lines
}

export function checkWin(board: Cell[], size: number, k: number) {
  const L = linesFor(size, k)
  for (const line of L) {
    const a = board[line[0]]
    if (a && line.every(i => board[i] === a)) return { winner: a as Mark, line }
  }
  if (board.every(c => c)) return { draw: true }
  return {}
}
