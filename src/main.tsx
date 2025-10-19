import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

const ensureRoot = () => {
  const ids = ["root", "app", "mount"];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el as HTMLElement;
  }
  const el = document.createElement("div");
  el.id = "root";
  document.body.appendChild(el);
  return el;
};

const rootEl = ensureRoot();
createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("[TTT+] Mounted into", rootEl.id);
