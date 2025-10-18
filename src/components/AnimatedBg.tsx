export const AnimatedBg = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: -1 }} aria-hidden>
    <div style={{
      position: "absolute", inset: 0,
      animation: "spin 20s linear infinite"
    }}>
      <div style={{
        width: "140vmax", height: "140vmax",
        margin: "auto",
        borderRadius: "9999px",
        filter: "blur(60px)",
        opacity: .35,
        background: "conic-gradient(from var(--angle), #7dd3fc, #a78bfa, #fca5a5, #7dd3fc)"
      }} />
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
