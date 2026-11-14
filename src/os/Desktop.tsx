import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, RefreshCw, LayoutGrid, ExternalLink } from "lucide-react";
import { ToastViewport, useAchievements, useSettings, useToasts } from "@/system/os";
import { DESKTOP_ICONS, appDef, colorMap, AppId } from "@/content/apps";
import { WindowCtx } from "@/os/WindowManager";
import { Taskbar } from "@/os/Taskbar";
import { WindowFrame } from "@/os/AppRouter";

const SECRET_WORD = "krithi";
const KONAMI = ["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"];

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
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [walkingFolder, setWalkingFolder] = useState<{ x: number; y: number } | null>(null);
  const [shake, setShake] = useState(false);

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

  /* konami code → developer mode */
  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      seq = [...seq, e.key.toLowerCase()].slice(-KONAMI.length);
      if (seq.join(",") === KONAMI.join(",")) {
        seq = [];
        trackEgg("egg_konami_dev");
        ctx.open("dev_mode.exe");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /* right-click context menu (desktop background only) */
  const onContextMenu = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest(".os-window") || t.closest(".taskbar") || t.closest("button") || t.closest("a") || t.closest("input")) return;
    e.preventDefault();
    setCtxMenu({ x: Math.min(e.clientX, window.innerWidth - 190), y: Math.min(e.clientY, window.innerHeight - 210) });
  };
  const closeCtxMenu = () => setCtxMenu(null);
  const ctxAction = (action: string) => {
    closeCtxMenu();
    if (action === "newtab") {
      push({ kind: "system", title: "tab budget exhausted", desc: "the OS is at 37/37 tab capacity. a new tab would destabilize reality." });
    } else if (action === "refresh") {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      push({ kind: "system", title: "desktop refreshed", desc: "nothing changed. the desktop was already clean. suspicious." });
    } else if (action === "display") {
      ctx.open("personality_settings.exe");
    } else if (action === "newfolder") {
      setWalkingFolder({ x: Math.min(ctxMenu!.x, window.innerWidth - 140), y: Math.min(ctxMenu!.y, window.innerHeight - 160) });
      trackEgg("egg_right_click_new_folder");
      push({ kind: "egg", title: "a new folder has been created.", desc: "the OS named it new_folder(37). of course it did." });
    }
  };

  return (
    <div
      ref={desktopRef}
      className={`os-desktop theme-${theme} ${sliders.sleep >= 70 ? "bedtime" : ""} ${shake ? "shake" : ""}`}
      data-desktop="main"
      onDoubleClick={desktopDouble}
      onContextMenu={onContextMenu}
      onClick={closeCtxMenu}
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

      {/* right-click context menu */}
      <AnimatePresence>
        {ctxMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.12 }}
            className="ctx-menu"
            style={{ left: ctxMenu.x, top: ctxMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => ctxAction("newtab")}>new tab</button>
            <button onClick={() => ctxAction("refresh")}><RefreshCw size={12} /> refresh desktop</button>
            <button onClick={() => ctxAction("newfolder")}><Folder size={12} /> new folder</button>
            <div className="ctx-sep" />
            <button onClick={() => ctxAction("display")}><LayoutGrid size={12} /> display settings</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the folder that walks away */}
      <AnimatePresence>
        {walkingFolder && (
          <motion.div
            className="walking-folder"
            initial={{ opacity: 0, scale: 0.5, x: walkingFolder.x, y: walkingFolder.y, rotate: 0 }}
            animate={{ opacity: [0, 1, 1, 1], scale: 1, rotate: [0, -6, 6, -4, 0], x: [walkingFolder.x, walkingFolder.x + 60, walkingFolder.x + 140, window.innerWidth + 90], y: [walkingFolder.y, walkingFolder.y - 18, walkingFolder.y - 6, walkingFolder.y - 30] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.4, times: [0, 0.12, 0.4, 1], ease: "easeInOut" }}
            onAnimationComplete={() => setWalkingFolder(null)}
          >
            <Folder size={34} />
            <span>new_folder(37)</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Taskbar ctx={ctx} openAchievements={() => ctx.open("achievements")} />
      <ToastViewport />
    </div>
  );
}
