export type Mark = 'X' | 'O'
export type Cell = Mark | null
export type PlayerKind = 'human' | 'ai'
export type Mode = 'classic3' | 'plus4' | 'power4'

export interface PowerPack {
  swap: boolean
  bomb: boolean
  double: boolean
}

export interface Players {
  p1: PlayerKind
  p2: PlayerKind
}

export interface GameState {
  mode: Mode
  size: number
  board: Cell[]
  current: Mark
  players: Players
  status: 'playing' | 'win' | 'draw'
  winner?: Mark
  winLine?: number[]   // indices that formed the win
  power?: Record<Mark, PowerPack>
  timer?: { enabled: boolean; perTurnMs: number; startedAt?: number }
  history: { board: Cell[]; desc: string }[]
}
