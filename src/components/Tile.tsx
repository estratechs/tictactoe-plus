import { motion, AnimatePresence } from "framer-motion";
import type { Cell } from "../utils/game";
type Props = { value: Cell; onClick: () => void; disabled?: boolean; };
export const Tile = ({ value, onClick, disabled }: Props) => (
  <motion.button
    className="tile"
    disabled={disabled || !!value}
    onClick={onClick}
    initial={false}
    whileHover={{ scale: value ? 1 : 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 500, damping: 22 }}
    style={{ transformStyle: "preserve-3d" }}
    aria-label={value ? `Cell with ${value}` : "Empty cell"}
  >
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value ?? "empty"}
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -180, opacity: 0 }}
        transition={{ duration: 0.28 }}
        style={{ fontSize: "1em", fontWeight: 900, lineHeight: 1 }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);
