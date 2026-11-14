import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { Info, Egg, Trophy } from "lucide-react";
import { ACHIEVEMENTS, EGGS } from "@/content/achievements";

const NS = "krithios";

/* ---------------- safe localStorage ---------------- */
export function lsGet(key: string): any {
  try { const v = localStorage.getItem(`${NS}:${key}`); return v ? JSON.parse(v) : null; } catch { return null; }
}
export function lsSet(key: string, value: any) {
  try { localStorage.setItem(`${NS}:${key}`, JSON.stringify(value)); } catch { /* storage blocked */ }
}

/* ---------------- sound ---------------- */
type SoundName = "open" | "close" | "click" | "success" | "egg";
const SOUND_SPEC: Record<SoundName, { f0: number; f1: number; dur: number; type: OscillatorType }> = {
  open: { f0: 500, f1: 700, dur: 0.12, type: "sine" },
  close: { f0: 520, f1: 300, dur: 0.12, type: "sine" },
  click: { f0: 760, f1: 760, dur: 0.05, type: "square" },
  success: { f0: 523, f1: 784, dur: 0.18, type: "sine" },
  egg: { f0: 392, f1: 988, dur: 0.24, type: "triangle" },
};

/* ---------------- toast ---------------- */
export type Toast = {
  id: number;
  kind: "system" | "egg" | "achievement" | "mode";
  title: string;
  desc?: string;
};
type ToastCtx = { toasts: Toast[]; push: (t: Omit<Toast, "id">) => void; dismiss: (id: number) => void };
const ToastContext = createContext<ToastCtx>(null as any);
export const useToasts = () => useContext(ToastContext);

/* ---------------- settings ---------------- */
export type Sliders = { curiosity: number; overthinking: number; sleep: number; tolerance: number };
export const DEFAULT_SLIDERS: Sliders = { curiosity: 70, overthinking: 69, sleep: 30, tolerance: 60 };
export type Theme = "cream" | "butter" | "lavender";

type SettingsCtx = {
  sliders: Sliders;
  setSlider: (k: keyof Sliders, v: number) => void;
  setSliders: (s: Sliders) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  sound: boolean;
  setSound: (v: boolean) => void;
  play: (name: SoundName) => void;
  visits: number;
};
const SettingsContext = createContext<SettingsCtx>(null as any);
export const useSettings = () => useContext(SettingsContext);

/* ---------------- achievements ---------------- */
type AchState = {
  unlocked: string[];
  folders: string[];
  tabs: string[];
  stages: number[];
  terminalCount: number;
  eggs: string[];
};
const DEFAULT_ACH: AchState = { unlocked: [], folders: [], tabs: [], stages: [], terminalCount: 0, eggs: [] };
type AchCtx = {
  state: AchState;
  trackEgg: (id: string) => void;
  unlock: (id: string) => void;
  markFolder: (id: string) => void;
  markTab: (id: string) => void;
  markStage: (i: number) => void;
  bumpTerminal: () => void;
};
const AchievementsContext = createContext<AchCtx>(null as any);
export const useAchievements = () => useContext(AchievementsContext);

/* ---------------- provider ---------------- */
export function OSProvider({ children }: { children: React.ReactNode }) {
  /* sound */
  const soundOn = useState(() => lsGet("sound") ?? true);
  const [sound] = soundOn;
  const audioRef = useRef<AudioContext | null>(null);
  const play = useCallback((name: SoundName) => {
    if (!sound) return;
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioRef.current;
      const spec = SOUND_SPEC[name];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = spec.type;
      osc.frequency.setValueAtTime(spec.f0, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(spec.f1, ctx.currentTime + spec.dur);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + spec.dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + spec.dur + 0.02);
    } catch { /* no audio */ }
  }, [sound]);

  /* visits */
  const visits = useMemo(() => {
    const v = lsGet("visits") ?? { count: 0, last: null as any };
    const nv = { count: v.count + 1, last: Date.now() };
    lsSet("visits", nv);
    return nv.count;
  }, []);

  /* settings */
  const [sliders, setSlidersState] = useState<Sliders>(() => ({ ...DEFAULT_SLIDERS, ...(lsGet("sliders") ?? {}) }));
  const [theme, setThemeState] = useState<Theme>(() => lsGet("theme") ?? "cream");
  const setSlider = useCallback((k: keyof Sliders, v: number) => {
    setSlidersState((s) => { const n = { ...s, [k]: v }; lsSet("sliders", n); return n; });
  }, []);
  const setSliders = useCallback((s: Sliders) => { setSlidersState(s); lsSet("sliders", s); }, []);
  const setTheme = useCallback((t: Theme) => { setThemeState(t); lsSet("theme", t); }, []);
  const setSound = useCallback((v: boolean) => { soundOn[1](v); lsSet("sound", v); }, [soundOn]);

  /* toasts */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = ++toastId.current;
    setToasts((all) => [...all.slice(-2), { ...t, id }]);
    setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  /* achievements */
  const [ach, setAch] = useState<AchState>(() => ({ ...DEFAULT_ACH, ...(lsGet("achievements") ?? {}) }));
  const achRef = useRef(ach); achRef.current = ach;
  const update = useCallback((fn: (s: AchState) => AchState) => {
    setAch((s) => { const n = fn(s); lsSet("achievements", n); return n; });
  }, []);
  const unlock = useCallback((id: string) => {
    const s = achRef.current;
    if (s.unlocked.includes(id)) return;
    const def = ACHIEVEMENTS.find((a) => a.id === id)!;
    update((cur) => ({ ...cur, unlocked: [...cur.unlocked, id] }));
    push({ kind: "achievement", title: `Achievement unlocked — ${def.name}`, desc: def.description });
  }, [update, push]);
  const trackEgg = useCallback((id: string) => {
    const s = achRef.current;
    if (s.eggs.includes(id)) return;
    update((cur) => {
      const eggs = [...cur.eggs, id];
      return { ...cur, eggs };
    });
    push({ kind: "egg", title: `Easter egg found (${achRef.current.eggs.length + 1}/11)`, desc: "somewhere, a checkbox ticks. keep digging." });
    play("egg");
    setTimeout(() => {
      if (!achRef.current.unlocked.includes("no_stone_unturned") && achRef.current.eggs.length >= EGGS.length) {
        unlock("no_stone_unturned");
      }
    }, 100);
  }, [update, push, play, unlock]);
  const markFolder = useCallback((id: string) => {
    update((cur) => ({ ...cur, folders: cur.folders.includes(id) ? cur.folders : [...cur.folders, id] }));
  }, [update]);
  const markTab = useCallback((id: string) => {
    update((cur) => ({ ...cur, tabs: cur.tabs.includes(id) ? cur.tabs : [...cur.tabs, id] }));
  }, [update]);
  const markStage = useCallback((i: number) => {
    update((cur) => ({ ...cur, stages: cur.stages.includes(i) ? cur.stages : [...cur.stages, i] }));
  }, [update]);
  const bumpTerminal = useCallback(() => {
    update((cur) => ({ ...cur, terminalCount: cur.terminalCount + 1 }));
  }, [update]);

  /* folder → achievement */
  useEffect(() => {
    const ofInterest = ["my_brain", "experiments", "outside_the_terminal", "unnecessary_thoughts"];
    if (ach.folders.filter((f) => ofInterest.includes(f)).length >= 3) unlock("curious_humans");
    if (ach.tabs.length >= 6) unlock("certified_overthinker");
    if (ach.stages.length >= 4) unlock("bug_hunter");
    if (ach.terminalCount >= 3) unlock("terminally_curious");
  }, [ach, unlock]);

  const toastApi = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);
  const settingsApi = useMemo(() => ({
    sliders, setSlider, setSliders, theme, setTheme, sound, setSound, play, visits,
  }), [sliders, setSlider, setSliders, theme, setTheme, sound, setSound, play, visits]);
  const achApi = useMemo(() => ({
    state: ach, trackEgg, unlock, markFolder, markTab, markStage, bumpTerminal,
  }), [ach, trackEgg, unlock, markFolder, markTab, markStage, bumpTerminal]);

  return (
    <ToastContext.Provider value={toastApi}>
      <SettingsContext.Provider value={settingsApi}>
        <AchievementsContext.Provider value={achApi}>
          {children}
        </AchievementsContext.Provider>
      </SettingsContext.Provider>
    </ToastContext.Provider>
  );
}

/* ---------------- toast viewport ---------------- */
export function ToastViewport() {
  const { toasts, dismiss } = useToasts();
  return (
    <div className="toast-stack no-print">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind === "mode" ? "mode-banner" : ""}`} data-testid={`toast-${t.kind}`}>
          <div className="t-ico">
            {t.kind === "system" && <Info size={15} />}
            {t.kind === "egg" && <Egg size={15} />}
            {t.kind === "achievement" && <Trophy size={15} />}
            {t.kind === "mode" && <Info size={15} />}
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-title">{t.title}</div>
            {t.desc && <div className="t-desc">{t.desc}</div>}
          </div>
          <button className="t-close" aria-label="Dismiss notification" onClick={() => dismiss(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
