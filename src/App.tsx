import { useEffect, useState } from "react";
import "./styles/theme.css"; 

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }, [key, val]);
  return [val, setVal] as const;
}

export function SettingsFooter() {
  const [anim, setAnim] = useLocalStorage("t3.anim", true);
  const [sound, setSound] = useLocalStorage("t3.sound", false);
  const [theme, setTheme] =
    useLocalStorage<"dark" | "light" | "high-contrast">("t3.theme", "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f8fafc" : "#0b0f1a");
  }, [theme]);

  return (
    <div style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", fontSize: 14 }}>
      <label><input type="checkbox" checked={anim} onChange={(e) => setAnim(e.target.checked)} /> Animations</label>
      <label><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Sound</label>
      <label>Theme:
        <select value={theme} onChange={(e) => setTheme(e.target.value as any)} style={{ marginLeft: 8 }}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="high-contrast">High contrast</option>
        </select>
      </label>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>

      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
        <p>Edit <code>src/App.tsx</code> and save to test HMR</p>
      </div>

      <SettingsFooter />

      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
