
import React from 'react'
import type { Mode, Mark } from '../types'

export function HUD({ mode, current, onNew, onUndo, onMode }:{
  mode: Mode, current: Mark, onNew: ()=>void, onUndo: ()=>void, onMode:(m:Mode)=>void
}) {
  return (
    <header className="hud">
      <div className="brand">TicTacToe+</div>
      <div className="status" aria-live="polite">
        Turn: <strong>{current}</strong> • Mode:
        <select aria-label="Mode select" value={mode} onChange={e=>onMode(e.target.value as Mode)}>
          <option value="classic3">Classic 3×3</option>
          <option value="plus4">Plus 4×4</option>
          <option value="power4">Power 4×4</option>
        </select>
      </div>
      <div className="actions">
        <button onClick={onUndo} className="ghost">Undo</button>
        <button onClick={onNew} className="primary">New Game</button>
      </div>
    </header>
  )
}
