export type FeatureFlags = {
  sounds: boolean;
  confetti: boolean;
  tilt: boolean;
  animations: boolean;
};

const fromQuery = (key: string, def: boolean) => {
  try {
    const url = new URL(window.location.href);
    const v = url.searchParams.get(key);
    if (v === "1" || v === "true") return true;
    if (v === "0" || v === "false") return false;
  } catch {}
  return def;
};

export const flags: FeatureFlags = {
  sounds: fromQuery("sounds", true),
  confetti: fromQuery("confetti", true),
  tilt: fromQuery("tilt", true),
  animations: fromQuery("anim", true),
};
