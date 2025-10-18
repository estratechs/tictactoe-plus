import { motion } from "framer-motion";

type Props = { x: number; y: number; length: number; angle: number; show: boolean; };

export const WinLine = ({ x, y, length, angle, show }: Props) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    animate={show ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    style={{
      position: "absolute",
      left: x, top: y,
      width: length, height: 6,
      transformOrigin: "left center",
      rotate: angle + "deg",
      borderRadius: 9999,
      background: "linear-gradient(90deg, rgba(255,255,255,.0), rgba(255,255,255,.9), rgba(255,255,255,.0))",
      animation: show ? "pulseGlow 1.5s ease-in-out infinite" : undefined as any
    }}
  />
);
