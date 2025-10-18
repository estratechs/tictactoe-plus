export const spawnConfetti = (x: number, y: number, duration = 120) => {
  const c = document.createElement("canvas");
  Object.assign(c.style, { position: "fixed", left: 0, top: 0, pointerEvents: "none", zIndex: 9999 });
  c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
  const ctx = c.getContext("2d")!;
  const parts = Array.from({ length: 90 }, () => ({
    x, y,
    vx: (Math.random()-0.5)*9,
    vy: (Math.random()*-7)-4,
    g: 0.28,
    life: 60 + Math.random()*40,
    s: 2 + Math.random()*3,
    hue: Math.floor(Math.random()*360)
  }));
  let frame = 0;
  const tick = () => {
    ctx.clearRect(0,0,c.width,c.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.life--;
      ctx.globalAlpha = Math.max(p.life/90, 0);
      ctx.fillStyle = `hsl(${p.hue} 90% 60%)`;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    });
    frame++; if (frame < duration) requestAnimationFrame(tick); else c.remove();
  };
  tick();
};
