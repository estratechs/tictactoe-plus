import { create } from 'zustand'
import type { GameState, Mode, Mark, Cell, Players } from '../types'
import { createInitialState, playMove, useBomb, useSwap, useDouble } from '../game-core/rules'

interface Store {
  state: GameState
  newGame: (mode: Mode, players?: Partial<Players>) => void
  move: (index: number) => void
  bomb: (index: number) => void
  swap: (index: number) => void
  doubleMove: (i1: number, i2: number) => void
  undo: () => void
  setTimer: (enabled: boolean, perTurnMs?: number) => void
}

export const useStore = create<Store>((set, get) => ({
  state: createInitialState('classic3'),
  newGame: (mode, players) => set({ state: createInitialState(mode, players) }),
  move: (i) => set(s => ({ state: playMove(s.state, i) })),
  bomb: (i) => set(s => ({ state: useBomb(s.state, i) })),
  swap: (i) => set(s => ({ state: useSwap(s.state, i) })),
  doubleMove: (i1, i2) => set(s => ({ state: useDouble(s.state, i1, i2) })),
  undo: () => set(s => {
    const h = s.state.history
    if (h.length < 2) return s
    const prev = h[h.length - 2]
    return { state: { ...s.state, board: prev.board, history: h.slice(0, -1), status: 'playing', winner: undefined, winLine: undefined }}
  }),
  setTimer: (enabled, perTurnMs=8000) => set(s => ({ state: { ...s.state, timer: { enabled, perTurnMs } } }))
}))
