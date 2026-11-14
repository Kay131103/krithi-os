import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { appDef, colorMap, AppId } from "@/content/apps";
import { useSettings } from "@/system/os";

export type WinState = { id: AppId; z: number; minimized: boolean; x: number; y: number };
export type WindowCtx = {
  windows: WinState[];
  focusedId: AppId | null;
  open: (id: AppId, props?: Record<string, any>) => void;
  close: (id: AppId) => void;
  minimize: (id: AppId) => void;
  focus: (id: AppId) => void;
  focusedAppProps?: Record<string, any>;
};

export function OsWindow({
  win, ctx, children,
}: {
  win: WinState; ctx: WindowCtx; children: React.ReactNode;
}) {
  const def = appDef(win.id);
  const focused = ctx.focusedId === win.id;
  const controls = useDragControls();
  const { play, sliders } = useSettings();
  const isMobile = useRef(typeof window !== "undefined" && window.innerWidth < 768).current;

  return (
    <AnimatePresence>
      {!win.minimized && (
        <motion.div
          key={win.id + String(ctx.focusedAppProps ? JSON.stringify(Object.keys(ctx.focusedAppProps || {})) : "")}
          className={`os-window ${focused ? "focused" : ""}`}
          role="dialog"
          aria-label={def.title}
          data-testid={`window-${win.id}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          drag={!isMobile}
          dragListener={false}
          dragMomentum={false}
          dragControls={controls}
          dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 120, bottom: window.innerHeight - 80 }}
          style={{
            left: win.x, top: win.y,
            zIndex: 1000 + win.z,
            ...(win.id === "focusedFile" ? {} : {}),
          }}
          onPointerDown={() => ctx.focus(win.id)}
        >
          <motion.div
            className="os-window-header"
            data-testid={`window-header-${win.id}`}
            onPointerDown={(e) => { if (!isMobile) controls.start(e); }}
          >
            <div className="app-ico" style={{ background: colorMap[def.color], color: def.textColor ?? "var(--ink)" }}>
              <def.icon size={14} />
            </div>
            <div className="win-title">
              {def.title}
              {def.subtitle ? ` // ${def.subtitle}` : ""}
            </div>
            <button
              className="win-ctl min"
              aria-label={`Minimize ${def.title}`}
              data-testid={`window-min-${win.id}`}
              onClick={(e) => { e.stopPropagation(); ctx.minimize(win.id); play("close"); }}
            />
            <button
              className="win-ctl close"
              aria-label={`Close ${def.title}`}
              data-testid={`window-close-${win.id}`}
              onClick={(e) => { e.stopPropagation(); ctx.close(win.id); play("close"); }}
            />
          </motion.div>
          <div className="os-window-body">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useWindowManager(): WindowCtx {
  const [windows, setWindows] = useState<WinState[]>([]);
  const [focusedId, setFocused] = useState<AppId | null>(null);
  const [focusedAppProps, setFocusedAppProps] = useState<Record<string, any>>({});
  const zCounter = useRef(100);
  const openCount = useRef(0);
  const { play } = useSettings();

  const open = useCallback((id: AppId, props?: Record<string, any>) => {
    play("open");
    setWindows((ws) => {
      const existing = ws.find((w) => w.id === id);
      if (existing) {
        setFocused(id);
        return ws.map((w) => (w.id === id ? { ...w, minimized: false, z: ++zCounter.current } : w));
      }
      const n = openCount.current++;
      const x = 210 + ((n * 36) % Math.max(120, window.innerWidth - 820));
      const y = 48 + ((n * 34) % 220);
      return [...ws, { id, z: ++zCounter.current, minimized: false, x, y }];
    });
    setFocused(id);
    setFocusedAppProps((prev) => ({ ...prev, [id]: props ?? {} }));
  }, [play]);

  const close = useCallback((id: AppId) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setFocused((f) => (f === id ? null : f));
  }, []);
  const minimize = useCallback((id: AppId) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);
  const focus = useCallback((id: AppId) => {
    setFocused(id);
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++zCounter.current, minimized: false } : w)));
  }, []);

  return { windows, focusedId, open, close, minimize, focus, focusedAppProps };
}

/* keyboard: Escape closes the focused window */
export function useEscapeHandler(ctx: WindowCtx) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ctx.focusedId) ctx.close(ctx.focusedId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ctx]);
}
