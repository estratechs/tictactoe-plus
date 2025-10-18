import type { Cell, GameState, Mark, Mode, Players } from '../types'
import { checkWin } from './win'

export function createInitialState(mode: Mode, players?: Partial<Players>): GameState {
  const size = mode === 'classic3' ? 3 : 4
  const k = mode === 'classic3' ? 3 : 3
  const board = Array<Cell>(size * size).fill(null)
  const p: Players = { p1: 'human', p2: 'human', ...players }
  return {
    mode, size, board,
    current: 'X',
    players: p,
    status: 'playing',
    history: [{ board: board.slice(), desc: 'start' }],
    power: mode === 'power4' ? { X: { swap:true, bomb:true, double:true }, O: { swap:true, bomb:true, double:true } } : undefined,
  }
}

const kFor = (mode: Mode) => 3

export function playMove(s: GameState, i: number): GameState {
  if (s.status !== 'playing' || s.board[i]) return s
  const nextBoard = s.board.slice()
  nextBoard[i] = s.current
  const res = checkWin(nextBoard, s.size, kFor(s.mode))
  const history = [...s.history, { board: nextBoard, desc: `place ${s.current}@${i}` }]

  if ('winner' in res) return { ...s, board: nextBoard, status: 'win', winner: res.winner, winLine: res.line, history }
  if ('draw' in res) return { ...s, board: nextBoard, status: 'draw', history }

  return { ...s, board: nextBoard, current: s.current === 'X' ? 'O' : 'X', history }
}

export function useBomb(s: GameState, i: number): GameState {
  if (s.mode !== 'power4' || s.status !== 'playing' || !s.power) return s
  const pack = s.power[s.current]; if (!pack?.bomb) return s
  if (!s.board[i]) return s
  const next = s.board.slice(); next[i] = null
  return { ...s, board: next, power: { ...s.power, [s.current]: { ...pack, bomb:false } }, history: [...s.history, { board: next, desc:'bomb' }] }
}

export function useSwap(s: GameState, i: number): GameState {
  if (s.mode !== 'power4' || s.status !== 'playing' || !s.power) return s
  const pack = s.power[s.current]; if (!pack?.swap) return s
  if (s.board[i] === null || s.board[i] === s.current) return s
  const next = s.board.slice(); next[i] = s.current
  return { ...s, board: next, power: { ...s.power, [s.current]: { ...pack, swap:false } }, history: [...s.history, { board: next, desc:'swap' }] }
}

export function useDouble(s: GameState, i1: number, i2: number): GameState {
  if (s.mode !== 'power4' || s.status !== 'playing' || !s.power) return s
  const pack = s.power[s.current]; if (!pack?.double) return s

  let state = s
  state = playMove(state, i1)
  if (state.status !== 'playing') return state // if win on first
  if (i2 === i1) return state
  state = playMove(state, i2)
  // consume power if we actually placed two
  return { ...state, power: { ...state.power!, [s.current]: { ...pack, double:false } } }
}
