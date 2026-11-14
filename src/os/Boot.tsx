import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSettings, useToasts, useAchievements } from "@/system/os";

const BOOT_LINES = [
  "krithi.os v7.0 — cold boot",
  "checking memory .......... 37 tabs found",
  "2,000+ applications detected.",
];

export function BootScreen({ onDone }: { onDone: (openResume?: boolean) => void }) {
  const { visits, sliders } = useSettings();
  const { trackEgg } = useAchievements();
  const { push } = useToasts();
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"boot" | "splash">("boot");
  const [wiggle, setWiggle] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (stage !== "boot") return;
    const warm = visits > 1;
    const lines = warm
      ? [
          "warm boot (visit #" + visits + ")",
          "welcome back. last session: " + new Date().toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
          "restoring personality ... curiosity " + sliders.curiosity + " · overthinking " + sliders.overthinking + " · sleep " + sliders.sleep + " · patience " + sliders.tolerance,
        ]
      : BOOT_LINES;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setLines(lines.slice(0, i));
      setProgress(Math.min(100, i * 33));
      if (i >= lines.length) {
        clearInterval(iv);
        setTimeout(() => setStage("splash"), 500);
      }
    }, 700);
    const skip = (e: KeyboardEvent) => { if (e.key === "Enter") setStage("splash"); };
    window.addEventListener("keydown", skip);
    return () => { clearInterval(iv); window.removeEventListener("keydown", skip); };
  }, [stage, visits]);

  if (stage === "boot") {
    return (
      <div className="boot-screen">
        <button className="skip-pill" data-testid="skip-intro" onClick={() => setStage("splash")}>skip intro</button>
        <div className="boot-block">
          <div className="boot-logo">
            <div className="logo-tile">K.<span className="logo-dot" /></div>
            <span>KRITHI.OS</span>
          </div>
          {lines.map((l, i) => <div key={i} className="boot-line">{l}</div>)}
          <div className="boot-line">booting<span className="boot-caret" /></div>
          <div className="boot-bar"><div style={{ width: progress + "%" }} /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="splash">
      <div className="splash-inner">
        <div className="sysmsg">
          SYSTEM MESSAGE{visits > 1 ? ` · SESSION RESTORED (VISIT #${visits})` : ""}
        </div>
        <h1 className="font-display">
          ERROR{" "}
          <span
            className={`err404 ${wiggle ? "wiggle" : ""}`}
            data-testid="boot-egg-404"
            role="button"
            aria-label="404 — poke it"
            onClick={() => {
              setWiggle(true);
              setTimeout(() => setWiggle(false), 500);
              trackEgg("egg_boot_404");
            }}
          >404</span>
        </h1>
        <p className="sub">
          Standard <span className="underline-coral">resume</span> not found.
        </p>
        <p className="small">the resume exists though — it's just not standard. two ways in:</p>
        <div className="cta">
          <button
            className="btn btn-blue"
            data-testid="open-exe"
            onClick={() => { if (!done.current) { done.current = true; onDone(false); } }}
          >
            {visits > 1 ? `Resume krithi.exe` : "Open krithi.exe"}
          </button>
          <button
            className="btn"
            data-testid="show-resume"
            onClick={() => { if (!done.current) { done.current = true; onDone(true); } }}
          >
            Just show me the resume
          </button>
        </div>
        <p className="small" style={{ marginTop: 18 }}>tip: press Enter to skip</p>
      </div>
    </div>
  );
}
