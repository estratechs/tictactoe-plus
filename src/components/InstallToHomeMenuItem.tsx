import * as React from "react";
import { usePWAInstall } from "../utils/pwaInstall";

type Props = { onInstalled?: ()=>void };
export const InstallToHomeMenuItem: React.FC<Props> = ({ onInstalled }) => {
  const { canInstall, install, installed } = usePWAInstall();
  if (installed) return null;
  return (
    <button type="button" onClick={async () => {
      const ok = await install();
      if (ok) onInstalled?.();
    }} disabled={!canInstall} title={canInstall ? "Install app to Home Screen" : "Install unavailable"}>
      Install App to Home Screen
    </button>
  );
};
