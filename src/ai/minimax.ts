
import type { Cell, Mark } from '../types'
import { checkWin } from '../game-core/win'
const opp = (m:Mark)=> m==='X'?'O':'X'

export function bestMove3x3(board: Cell[], me: Mark): number {
  let best=-Infinity, idx=-1
  for (let i=0;i<9;i++) if(!board[i]){
    const copy=board.slice(); copy[i]=me
    const score=minimax(copy, me, false, opp(me), 0)
    if (score>best){ best=score; idx=i }
  }
  return idx
}

function minimax(board:Cell[], me:Mark, isMax:boolean, player:Mark, depth:number): number {
  const r=checkWin(board,3,3)
  if ('winner' in r) return r.winner===me ? 10-depth : depth-10
  if ('draw' in r) return 0
  let best=isMax?-Infinity:Infinity
  for (let i=0;i<9;i++) if(!board[i]){
    const copy=board.slice(); copy[i]=player
    const sc=minimax(copy, me, !isMax, opp(player), depth+1)
    best = isMax? Math.max(best,sc): Math.min(best,sc)
  }
  return best
}
