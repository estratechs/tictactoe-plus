
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "./index.css";

function ensureRoot(): HTMLElement {
  const ids = ["root", "app", "mount"];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el as HTMLElement;
  }
  const el = document.createElement("div");
  el.id = "root";
  document.body.appendChild(el);
  return el;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: any}> {
  constructor(props:any){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error:any){ return { hasError: true, error }; }
  componentDidCatch(error:any, info:any){ console.error("App crashed:", error, info); }
  render(){
    if(this.state.hasError){
      return (
        <div style={{padding:24, color:"#fff", fontFamily:"sans-serif"}}>
          <h2>Something went wrong loading the app.</h2>
          <p>Open the browser console for details. If this persists, try the hotfix <code>main.tsx</code> or check your root div id in <code>index.html</code>.</p>
        </div>
      );
    }
    return this.props.children as any;
  }
}

const rootEl = ensureRoot();

// Support React 17 and 18:
const anyReactDOM: any = ReactDOM as any;
if (anyReactDOM.createRoot) {
  anyReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  // React 17 fallback
  anyReactDOM.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
    rootEl
  );
}

console.log("[TTT+] Mounted into", rootEl.id);
