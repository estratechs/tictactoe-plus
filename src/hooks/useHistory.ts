export function useHistory<T>(initial: T) {
  const [stack, setStack] = React.useState<T[]>([initial]);
  const [idx, setIdx] = React.useState(0);
  const value = stack[idx];
  const canUndo = idx > 0;
  const canRedo = idx < stack.length - 1;
  const push = (next: T) => {
    setStack(prev => [...prev.slice(0, idx + 1), next]);
    setIdx(i => i + 1);
  };
  const undo = () => setIdx(i => (i > 0 ? i - 1 : i));
  const redo = () => setIdx(i => (i < stack.length - 1 ? i + 1 : i));
  const reset = (v: T) => { setStack([v]); setIdx(0); };
  return { value, canUndo, canRedo, push, undo, redo, reset, stack, idx };
}
import * as React from "react";
