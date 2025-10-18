
import type { Cell, Mark } from '../types'
export function casualMove(board:Cell[], size:number, me:Mark): number {
  const empty = board.map((v,i)=> v ? -1 : i).filter(i=> i>=0)
  const center = Math.floor(size/2)*size + Math.floor(size/2)
  if (board[center]===null) return center
  const corners=[0,size-1,size*(size-1), size*size-1].filter(i=> board[i]===null)
  if (corners.length) return corners[0]
  return empty[0] ?? -1
}
