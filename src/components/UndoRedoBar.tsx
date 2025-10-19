import * as React from "react";
type Props = { canUndo: boolean; canRedo: boolean; onUndo: ()=>void; onRedo: ()=>void; };
export const UndoRedoBar: React.FC<Props> = ({canUndo, canRedo, onUndo, onRedo}) => {
  return (
    <div style={{display:"flex", gap:12, justifyContent:"center", marginTop:12}}>
      <button type="button" onClick={onUndo} disabled={!canUndo} aria-label="Undo last move">⟲ Undo</button>
      <button type="button" onClick={onRedo} disabled={!canRedo} aria-label="Redo move">⟳ Redo</button>
    </div>
  );
};
