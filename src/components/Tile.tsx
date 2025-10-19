import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Cell } from "../utils/game";
import { cx } from "../utils/cx";

type Props = {
  value: Cell;
  onClick: () => void;
  disabled?: boolean;
};

export const Tile = memo(({ value, onClick, disabled }: Props) => {
  return (
    <button
      className="tile"
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          className={cx("mark", value === "X" && "x", value === "O" && "o")}
          key={value ?? "empty"}
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -180, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.6 }}
        >
          {value ?? ""}
        </motion.span>
      </AnimatePresence>
    </button>
  );
});
