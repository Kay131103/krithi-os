import React, { Component, useMemo, useRef, useState } from "react";

class ErrorBoundary extends Component<{ children: React.ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) {
      return (
        <div className="boot-screen">
          <div className="boot-block" style={{ textAlign: "center" }}>
            <h1 className="font-display" style={{ fontSize: 28, marginBottom: 10 }}>the OS crashed. it happens.</h1>
            <p style={{ color: "var(--ink-soft)", marginBottom: 18 }}>a window hit an unexpected state. rebooting is safe — your progress (achievements, eggs, sliders) is saved.</p>
            <button className="btn btn-blue" onClick={() => window.location.reload()}>reboot krithi.exe</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
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
    <ErrorBoundary>
      <OSProvider>
        <Shell />
      </OSProvider>
    </ErrorBoundary>
  );
}
