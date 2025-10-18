
import React, { useState } from 'react'

type Cell = 'X' | 'O' | null;
const size = 3;

export default function App() {
  const [board, setBoard] = useState<Cell[]>(Array(size*size).fill(null));
  const [turn, setTurn] = useState<'X'|'O'>('X');

  function clickCell(i: number) {
    if (board[i]) return;
    const next = board.slice();
    next[i] = turn;
    setBoard(next);
    setTurn(turn === 'X' ? 'O' : 'X');
  }

  return (
    <div style={{fontFamily:'system-ui, sans-serif', display:'grid', placeItems:'center', minHeight:'100vh'}}>
      <h1>TicTacToe+</h1>
      <p>Turn: {turn}</p>
      <div style={{display:'grid', gridTemplateColumns:`repeat(${size}, 80px)`, gap:'8px'}}>
        {board.map((c, i) => (
          <button key={i} onClick={() => clickCell(i)} style={{width:80, height:80, fontSize:32}}>
            {c ?? ''}
          </button>
        ))}
      </div>
    </div>
  )
}
