import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastViewport, useAchievements, useSettings, useToasts } from "@/system/os";
import { DESKTOP_ICONS, appDef, colorMap, AppId } from "@/content/apps";
import { WindowCtx } from "@/os/WindowManager";
import { Taskbar } from "@/os/Taskbar";
import { WindowFrame } from "@/os/AppRouter";

const SECRET_WORD = "krithi";

const BASE_NOTES = [
  { text: "reminder: the tabs are load-bearing", cls: "hidden md:block", style: { top: 340, right: 30, rotate: 3 } },
  { text: "sax practice today. the neighbours said 'brave'", cls: "hidden lg:block", style: { top: 470, right: 80, rotate: -2 } },
];
const CHAOS_NOTES = [
  { text: "wait — what if we refactored the refactor?", cls: "hidden xl:block", style: { top: 220, right: 130, rotate: -3 } },
  { text: "did i close that loop? which loop? THE loop?", cls: "hidden md:block", style: { top: 600, right: 40, rotate: 2 } },
  { text: "RESEARCH CASCADE IN PROGRESS. do not tidy up.", cls: "hidden lg:block", style: { top: 700, right: 120, rotate: -2 } },
];

export function Desktop({ ctx }: { ctx: WindowCtx }) {
  const { theme, sliders, play, visits } = useSettings();
  const { trackEgg } = useAchievements();
  const { push } = useToasts();
  const [starWiggle, setStarWiggle] = useState(false);
  const starPokes = useRef(0);
  const desktopRef = useRef<HTMLDivElement>(null);

  /* toast on entering desktop */
  useEffect(() => {
    if (visits > 1) {
      push({ kind: "system", title: "welcome back · last seen earlier today",
             desc: `curiosity ${sliders.curiosity} · overthinking ${sliders.overthinking} — restored.` });
      push({ kind: "system", title: "krithi.exe is running", desc: "37 tabs restored." });
    } else {
      push({ kind: "system", title: "krithi.exe is running", desc: "37 tabs restored. welcome to the desktop." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* secret knock */
  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-10);
      if (buffer.endsWith(SECRET_WORD)) trackEgg("egg_secret_knock");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trackEgg]);

  const overthinkingHigh = sliders.overthinking >= 70;
  const chaos = sliders.curiosity >= 70 && sliders.overthinking >= 70;

  const starClick = () => {
    setStarWiggle(true);
    setTimeout(() => setStarWiggle(false), 450);
    play("click");
    starPokes.current++;
    if (starPokes.current === 3) {
      trackEgg("egg_doodle_star");
      push({ kind: "egg", title: "you poked the star. three times. it found you back." });
    }
  };

  const desktopDouble = (e: React.MouseEvent) => {
    if (e.target !== desktopRef.current && (e.target as HTMLElement).dataset.desktop !== "main") return;
    trackEgg("egg_wallpaper_cleaner");
    push({ kind: "egg", title: "the empty desktop — cleaner here, isn't it? the tabs heard you and refused to leave." });
  };

  return (
    <div
      ref={desktopRef}
      className={`os-desktop theme-${theme} ${sliders.sleep >= 70 ? "bedtime" : ""}`}
      data-desktop="main"
      onDoubleClick={desktopDouble}
    >
      <div className="os-main" data-testid="desktop-main">
        <div className="topmeta">KRITHI.OS // user: krithi</div>

        <div className="hero">
          <h1>
            Hi I'm Krithi. My brain has too many tabs open so I turn them into a website.
          </h1>
          <p className="tagline">
            Applied AI engineer. Document pipelines by day, saxophone by night. Occasional victim of my own curiosity.
          </p>
          <div className="cta">
            <button className="btn btn-blue" onClick={() => ctx.open("experiments")}>open experiments</button>
            <button className="btn" onClick={() => ctx.open("resume")}>open resume</button>
          </div>
          <p className="hint">click an icon. windows open, close, minimize and stack — like your brain, but tidier.</p>
        </div>

        <div className="icon-grid">
          {DESKTOP_ICONS.map((id) => {
            const def = appDef(id);
            return (
              <button
                key={id}
                className="desk-icon"
                aria-label={`Open ${id}`}
                data-testid={`icon-${id}`}
                onClick={() => ctx.open(id)}
              >
                <div className="tile" style={{ background: colorMap[def.color], color: def.textColor ?? "var(--ink)" }}>
                  <def.icon size={26} />
                </div>
                <div className="label">{id}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* wall art */}
      {BASE_NOTES.map((n, i) => (
        <div key={i} className={`sticky-note ${n.cls}`} style={{ top: n.style.top, right: n.style.right, transform: `rotate(${n.style.rotate}deg)` }}>
          {n.text}
        </div>
      ))}
      {(overthinkingHigh || chaos) &&
        CHAOS_NOTES.map((n, i) => (
          <div key={"c" + i} className={`sticky-note ${n.cls}`} style={{ top: n.style.top, right: n.style.right, transform: `rotate(${n.style.rotate}deg)`, background: "var(--coral-soft)" }}>
            {n.text}
          </div>
        ))}

      {/* doodle star */}
      <button
        className={`doodle-star ${starWiggle ? "wiggle" : ""}`}
        aria-label="A hand-drawn star. Poke it."
        data-testid="doodle-star"
        onClick={starClick}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M32 6 L38 24 L58 26 L42 38 L47 57 L32 46 L17 57 L22 38 L6 26 L26 24 Z"
            stroke="var(--ink)" strokeWidth="2.4" fill="var(--butter)" strokeLinejoin="round" />
        </svg>
      </button>

      {/* squiggle */}
      <svg className="squiggle hidden md:block" style={{ bottom: 130, left: 30 }} width="120" height="40" viewBox="0 0 120 40" fill="none">
        <path d="M4 20 Q 14 4, 24 20 T 44 20 T 64 20 T 84 20 T 104 20" stroke="var(--lav)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </svg>

      {/* windows */}
      {ctx.windows.map((w) => (
        <WindowFrame key={w.id + JSON.stringify(ctx.focusedAppProps[w.id] ?? {})} win={w} ctx={ctx} />
      ))}

      <Taskbar ctx={ctx} openAchievements={() => ctx.open("achievements")} />
      <ToastViewport />
    </div>
  );
}
