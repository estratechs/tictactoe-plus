import type { Cell, Mark } from '../types'
import { checkWin } from '../game-core/win'

const opponent = (m: Mark) => (m === 'X' ? 'O' : 'X')

export function bestMove3x3(board: Cell[], me: Mark): number {
  let bestScore = -Infinity, bestIndex = -1
  for (let i=0; i<9; i++) {
    if (board[i]) continue
    const copy = board.slice()
    copy[i] = me
    const score = minimax(copy, me, false, me)
    if (score > bestScore) { bestScore = score; bestIndex = i }
  }
  return bestIndex
}

function minimax(board: Cell[], me: Mark, isMax: boolean, player: Mark, depth=0): number {
  const res = checkWin(board, 3, 3)
  if ('winner' in res) return res.winner === me ? 10 - depth : depth - 10
  if ('draw' in res) return 0

  let best = isMax ? -Infinity : Infinity
  for (let i=0; i<9; i++) {
    if (board[i]) continue
    const copy = board.slice()
    copy[i] = player
    const score = minimax(copy, me, !isMax, opponent(player), depth+1)
    best = isMax ? Math.max(best, score) : Math.min(best, score)
  }
  return best
}
