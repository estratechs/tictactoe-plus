import * as React from "react";
export const HintDot: React.FC<{visible:boolean}> = ({visible}) => (
  <span aria-hidden="true" style={{
    position:"absolute", inset:0, display: visible ? "block" : "none",
    pointerEvents:"none", borderRadius:8, outline:"3px dashed var(--accent)", opacity:0.6
  }}/>
);
