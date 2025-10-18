
import type { Cell, GameState, Mode } from '../types'
import { checkWin } from './win'

const kFor = (mode: Mode) => 3

export function createInitialState(mode: Mode, players?: Partial<GameState['players']>): GameState {
  const size = mode === 'classic3' ? 3 : 4
  const board = Array<Cell>(size*size).fill(null)
  return {
    mode, size, board,
    current: 'X',
    players: { p1: 'human', p2: 'human', ...(players||{}) },
    status: 'playing',
    history: [{ board: board.slice(), desc: 'start' }],
    power: mode === 'power4' ? { X: { swap:true, bomb:true, double:true }, O: { swap:true, bomb:true, double:true } } : undefined
  }
}

export function playMove(s: GameState, i: number): GameState {
  if (s.status!=='playing' || s.board[i]) return s
  const nb = s.board.slice(); nb[i] = s.current
  const res = checkWin(nb, s.size, kFor(s.mode))
  const hist = [...s.history, { board: nb, desc:`place ${s.current}@${i}` }]
  if ('winner' in res) return { ...s, board: nb, status:'win', winner: res.winner, winLine: res.line, history: hist, pending: undefined }
  if ('draw' in res)   return { ...s, board: nb, status:'draw', history: hist, pending: undefined }
  return { ...s, board: nb, current: s.current==='X'?'O':'X', history: hist, pending: undefined }
}

export function useBomb(s: GameState, i: number): GameState {
  if (s.mode!=='power4' || s.status!=='playing' || !s.power) return s
  const pack = s.power[s.current]; if (!pack?.bomb) return s
  if (!s.board[i]) return s
  const nb = s.board.slice(); nb[i] = null
  return { ...s, board: nb, power:{...s.power, [s.current]:{...pack, bomb:false}}, history:[...s.history, {board:nb, desc:'bomb'}], pending: undefined }
}

export function useSwap(s: GameState, i: number): GameState {
  if (s.mode!=='power4' || s.status!=='playing' || !s.power) return s
  const pack = s.power[s.current]; if (!pack?.swap) return s
  if (s.board[i]===null || s.board[i]===s.current) return s
  const nb = s.board.slice(); nb[i] = s.current
  return { ...s, board: nb, power:{...s.power, [s.current]:{...pack, swap:false}}, history:[...s.history, {board:nb, desc:'swap'}], pending: undefined }
}

export function useDouble(s: GameState, i1: number, i2: number): GameState {
  if (s.mode!=='power4' || s.status!=='playing' || !s.power) return s
  const pack = s.power[s.current]; if (!pack?.double) return s
  let st = s
  st = playMove(st, i1)
  if (st.status!=='playing') return st
  if (i2===i1) return st
  st = playMove(st, i2)
  return { ...st, power:{...st.power!, [s.current]:{...pack, double:false}}, pending: undefined }
}
