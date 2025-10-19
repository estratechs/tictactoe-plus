export const haptics = {
  tap: () => { try { (navigator as any).vibrate?.(15); } catch {} },
  win: () => { try { (navigator as any).vibrate?.([10, 40, 10]); } catch {} }
};
