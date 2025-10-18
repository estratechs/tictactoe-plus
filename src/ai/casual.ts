import type { Cell, Mark } from '../types'

const centerPref = (size:number) => {
  const c = Math.floor(size/2)
  const prefs = [c*size + c]
  // add corners then others
  prefs.push(0, size-1, size*(size-1), size*size-1)
  return prefs
}

export function casualMove(board: Cell[], size: number, me: Mark): number {
  // block immediate opponent 2-in-row, try make 2-in-row, else prefer center/corners
  const empty = board.map((v,i)=> v ? -1 : i).filter(i=> i>=0)
  // trivial: center preference
  const prefs = centerPref(size).filter(i => board[i] === null)
  return empty.find(i => prefs.includes(i)) ?? empty[0]
}
