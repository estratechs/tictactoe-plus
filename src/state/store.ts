
import { create } from 'zustand'
import type { GameState, Mode } from '../types'
import { createInitialState, playMove, useBomb, useDouble, useSwap } from '../game-core/rules'
import { record } from '../utils/stats'

interface Store {
  state: GameState
  newGame: (mode: Mode, players?: Partial<GameState['players']>) => void
  move: (i: number) => void
  request: (type: 'swap'|'bomb'|'double') => void
  selectCell: (i: number) => void
  undo: () => void
}

export const useStore = create<Store>((set, get) => ({
  state: createInitialState('classic3'),
  newGame: (mode, players) => set({ state: createInitialState(mode, players) }),

  move: (i) => set(s => ({ state: playMove(s.state, i) })),

  request: (type) => set(s => ({ state: { ...s.state, pending: { type } } })),

  selectCell: (i) => set(s => {
    const st = s.state
    if (!st.pending) return s
    if (st.pending.type==='bomb') return { state: useBomb(st, i) }
    if (st.pending.type==='swap') return { state: useSwap(st, i) }
    if (st.pending.type==='double'){
      if (st.pending.first === undefined) return { state: { ...st, pending: { type:'double', first: i } } }
      return { state: useDouble(st, st.pending.first, i) }
    }
    return s
  }),

  undo: () => set(s => {
    const h=s.state.history
    if (h.length<2) return s
    const prev=h[h.length-2]
    return { state:{ ...s.state, board: prev.board, history:h.slice(0,-1), status:'playing', winner:undefined, winLine:undefined, pending: undefined } }
  }),
}))

// record stats when match ends
useStore.subscribe((ns, ps) => {
  if (ps?.state.status==='playing' && ns.state.status!=='playing'){
    if (ns.state.status==='win') record(ns.state.mode, 'win')
    else if (ns.state.status==='draw') record(ns.state.mode, 'draw')
    else record(ns.state.mode, 'loss')
  }
})
