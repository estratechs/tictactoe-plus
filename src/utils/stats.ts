
type ModeKey = 'classic3'|'plus4'|'power4'
interface Stat { wins:number; losses:number; draws:number; streak:number; maxStreak:number }
interface Stats { [k in ModeKey]: Stat }

const key='t3.stats'
const defaultStat = ():Stat => ({wins:0, losses:0, draws:0, streak:0, maxStreak:0})
const empty:Stats = { classic3: defaultStat(), plus4: defaultStat(), power4: defaultStat() }

export function loadStats(): Stats {
  try { return { ...empty, ...(JSON.parse(localStorage.getItem(key) || 'null')||{}) } } catch { return empty }
}
export function saveStats(s:Stats){ localStorage.setItem(key, JSON.stringify(s)) }
export function record(mode:ModeKey, result:'win'|'loss'|'draw'){
  const s=loadStats(); const st=s[mode]
  if (result==='win'){ st.wins++; st.streak++; st.maxStreak=Math.max(st.maxStreak, st.streak) }
  if (result==='loss'){ st.losses++; st.streak=0 }
  if (result==='draw'){ st.draws++; }
  saveStats(s)
}
