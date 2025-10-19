let ctx: AudioContext | null = null;
try { ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch {}
export function blip(freq=660, dur=0.07){
  if(!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.value = freq; o.type="sine"; o.connect(g); g.connect(ctx.destination);
  const t = ctx.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.3, t+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  o.start(t); o.stop(t+dur);
}
