import { useEffect, useRef } from "react";

export const useBoardTilt = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
      const dy = (e.clientY - cy) / rect.height;
      const rotX = dy * -10;
      const rotY = dx *  10;
      el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    };
    const onLeave = () => { el.style.transform = "rotateX(0) rotateY(0)"; };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return ref;
};
