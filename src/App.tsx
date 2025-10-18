import React, { useEffect } from 'react'
import { useStore } from './state/store'
import Board from './components/Board'
import Modal from './components/Modal'
import { HUD } from './components/HUD'
import type { Mode } from './types'
import { bestMove3x3 } from './ai/minimax'
import { casualMove } from './ai/casual'

export default function App() {
  const { state, newGame, move, bomb, swap, doubleMove, undo, setTimer } = useStore()

  // AI move effect
  useEffect(() => {
    const { players, current, mode, size, board, status } = state
    if (status !== 'playing') return
    const isAI = (current === 'X' ? players.p1 : players.p2) === 'ai'
    if (!isAI) return

    const doMove = () => {
      let index = -1
      if (mode === 'classic3') index = bestMove3x3(board, current)
      else index = casualMove(board, size, current)
      if (index >= 0) move(index)
    }
    const id = setTimeout(doMove, 350)
    return () => clearTimeout(id)
  }, [state, move])

  const onMode = (m: Mode) => newGame(m, state.players)

  return (
    <div className="app">
      <HUD
        mode={state.mode}
        current={state.current}
        onNew={() => newGame(state.mode, state.players)}
        onUndo={undo}
        onMode={onMode}
      />

      {state.mode === 'power4' && state.power && (
        <section className="powerbar" aria-label="Power-ups">
          {(['swap','bomb','double'] as const).map(p => (
            <button
              key={p}
              disabled={!state.power[state.current as 'X'|'O']?.[p]}
              onClick={() => {}}
              title={p}
              className="chip"
            >
              {p} {state.power[state.current as 'X'|'O']?.[p] ? '✓' : '—'}
            </button>
          ))}
          {/* For UX: you can wire modal pickers for swap/double targets. For brevity,
              useBomb/useSwap/useDouble are exposed; trigger them from board UI or small dialogs. */}
        </section>
      )}

      <main className="stage">
        <Board
          size={state.size}
          board={state.board}
          winLine={state.winLine}
          onClick={(i) => move(i)}
        />
      </main>

      <Modal open={state.status !== 'playing'} onClose={() => newGame(state.mode, state.players)}>
        <div className="result">
          {state.status === 'win' ? (
            <h2><span className="badge">🏆</span> Winner: {state.winner}</h2>
          ) : (
            <h2>It’s a draw!</h2>
          )}
          <div className="row">
            <button className="primary" onClick={() => newGame(state.mode, state.players)}>Play again</button>
            <button className="ghost" onClick={() => onMode('classic3')}>Switch to Classic</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
