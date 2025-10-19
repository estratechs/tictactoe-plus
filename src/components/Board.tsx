
import React from 'react'
import { motion } from 'framer-motion'
import type { Cell } from '../types'

export default function Board({ size, board, onClick, winLine }:{
  size: number, board: Cell[], onClick: (i:number)=>void, winLine?: number[]
}) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`}} role="grid" aria-label="Game board">
      {board.map((c, i) => {
        const winning = winLine?.includes(i)
        return (
          <motion.button
            key={i}
            role="gridcell"
            aria-label={`Cell ${Math.floor(i/size)+1}, ${i%size+1} ${c?`occupied ${c}`:'empty'}`}
            className={`cell ${winning ? 'cell-win' : ''} aria-live="polite"`}
            onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){(e.target as HTMLElement).click();}}} onClick={() => onClick(i)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: c ? 1 : 0, rotate: 0, opacity: c ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`mark ${c === 'X' ? 'x' : 'o'}`}
            >
              {c || '·'}
            </motion.span>
          </motion.button>
        )
      })}
    </button>
  )
}
