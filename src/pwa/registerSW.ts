
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/tictactoe-plus/sw.js').catch(console.error);
    });
  }
}
