import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Trophy } from "lucide-react";
import { APPS, AppId, appDef } from "@/content/apps";
import { WindowCtx } from "@/os/WindowManager";
import { useAchievements, useSettings, useToasts } from "@/system/os";

export function Taskbar({ ctx, openAchievements }: {
  ctx: WindowCtx; openAchievements: () => void;
}) {
  const { play, sound, setSound, sliders } = useSettings();
  const { state, trackEgg } = useAchievements();
  const { push } = useToasts();
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [chaosMode, setChaosMode] = useState(false);

  /* clock */
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tick();
    const iv = setInterval(tick, 15000);
    return () => clearInterval(iv);
  }, []);

  /* egg counters */
  const logoPokes = useRef(0);
  const clockPokes = useRef(0);

  const onLogoClick = () => {
    play("click");
    setStartOpen((v) => !v);
    logoPokes.current++;
    if (logoPokes.current === 5) {
      trackEgg("egg_logo_poker");
      push({ kind: "egg", title: "the K has feelings. five pokes. it wiggles accordingly." });
    }
  };

  const onClockClick = () => {
    play("click");
    clockPokes.current++;
    if (clockPokes.current === 3) {
      trackEgg("egg_clock_watcher");
      push({ kind: "egg", title: "it's just a clock. it has been keeping time the whole time. respect it." });
    }
  };

  /* listen for chaos mode chip */
  useEffect(() => {
    const handler = () => { setChaosMode(true); setTimeout(() => setChaosMode(false), 60000); };
    (window as any).__chaosBus = handler;
    return () => { delete (window as any).__chaosBus; };
  }, []);

  const openApp = (id: AppId) => { setStartOpen(false); ctx.open(id); };

  return (
    <>
      {startOpen && (
        <div className="start-menu no-print" data-testid="start-menu">
          {APPS.map((a) => (
            <button key={a.id} onClick={() => openApp(a.id)}>
              <span className="sm-ico"><a.icon size={15} /></span>
              <span className="sm-title">{a.id}</span>
              <span>{a.title.split("//")[0].trim()}</span>
            </button>
          ))}
          <button onClick={() => openAchievements()}>
            <span className="sm-ico"><Trophy size={15} /></span>
            <span className="sm-title">achievements</span>
            <span>progress tracker</span>
          </button>
        </div>
      )}

      <div className="taskbar no-print" data-testid="taskbar">
        <button
          className={`start-btn ${logoPokes.current >= 4 ? "wiggle" : ""}`}
          aria-label="All apps"
          aria-expanded={startOpen}
          data-testid="taskbar-start"
          onClick={onLogoClick}
        >K</button>

        <button
          className="icon-btn"
          aria-label="Open resume"
          data-testid="taskbar-resume"
          onClick={() => { play("open"); ctx.open("resume"); }}
        >
          {React.createElement(appDef("resume").icon, { size: 15 })}
        </button>

        {ctx.windows.map((w) => {
          const def = appDef(w.id);
          const active = ctx.focusedId === w.id && !w.minimized;
          return (
            <button
              key={w.id}
              className={`chip-btn ${active ? "active" : ""}`}
              aria-label={active ? `Window ${def.title}` : `Restore ${def.title}`}
              onClick={() => (active ? ctx.minimize(w.id) : ctx.focus(w.id))}
            >
              {w.id.slice(0, 14)}
              <span
                role="button"
                aria-label={`Close ${def.title}`}
                onClick={(e) => { e.stopPropagation(); ctx.close(w.id); play("close"); }}
                style={{ fontWeight: 700 }}
              >×</span>
            </button>
          );
        })}

        {chaosMode && <span className="chip-btn mode">CHAOS MODE</span>}
        {sliders.sleep >= 70 && <span className="chip-btn mode">bedtime</span>}
        {sliders.tolerance <= 30 && <span className="chip-btn mode">impatient</span>}
        {ctx.windows.some((w) => w.id.startsWith("perf:")) && <span className="chip-btn mode">perf</span>}

        <button className="clock" aria-label="System clock" data-testid="taskbar-clock" onClick={onClockClick}>{clock}</button>

        <button
          className="icon-btn"
          aria-label={sound ? "Mute sounds" : "Enable sounds"}
          data-testid="taskbar-sound"
          onClick={() => { setSound(!sound); play("click"); }}
        >
          {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        <button
          className="icon-btn"
          aria-label="Achievements"
          data-testid="taskbar-achievements"
          onClick={() => { play("open"); openAchievements(); }}
          style={{ position: "relative" }}
        >
          <Trophy size={15} />
          {state.unlocked.length > 0 && <span className="trophy-badge">{state.unlocked.length}</span>}
        </button>
      </div>
    </>
  );
}
