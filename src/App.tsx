import React, { useMemo, useRef, useState } from "react";
import { OSProvider, ToastViewport, useSettings, useToasts, Toast } from "@/system/os";
import { BootScreen } from "@/os/Boot";
import { Desktop } from "@/os/Desktop";
import { useWindowManager, useEscapeHandler } from "@/os/WindowManager";
import { LoadingModal } from "@/os/AppRouter";

function Shell() {
  const wm = useWindowManager();
  const { sliders } = useSettings();
  const { push } = useToasts();
  const [booted, setBooted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEscapeHandler(wm);

  /* tolerance LOW → simulated loading screen on app open */
  const wmWithLoading = useMemo(() => {
    const base = wm;
    return {
      ...base,
      open: (id: string, props?: Record<string, any>) => {
        base.open(id, props);
        if (sliders.tolerance <= 30 && !base.windows.some((w) => w.id === id)) {
          setLoading(true);
          setTimeout(() => setLoading(false), 2600);
        }
      },
    } as typeof base;
  }, [wm, sliders.tolerance]);

  if (!booted) {
    return <BootScreen onDone={(openResume) => { setBooted(true); if (openResume) setTimeout(() => wmWithLoading.open("resume"), 300); }} />;
  }

  return (
    <>
      <Desktop ctx={wmWithLoading} />
      {loading && <LoadingModal onDone={() => setLoading(false)} />}
    </>
  );
}

export default function App() {
  return (
    <OSProvider>
      <Shell />
    </OSProvider>
  );
}
