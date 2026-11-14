import React, { useState, useEffect, useRef } from "react";
import {
  FileText, FileCode, FileSearch, FileQuestion, Heart, Sparkles, FlaskConical,
  Music, Bug, Brain, FolderHeart, Trash2, Terminal as TerminalIcon, Globe,
  SlidersHorizontal, Trophy, Download, Printer, Ban, Lightbulb, Wrench, Skull,
  Play, ExternalLink, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OsWindow, WinState, WindowCtx } from "@/os/WindowManager";
import { appDef, colorMap } from "@/content/apps";
import { useAchievements, useSettings, useToasts } from "@/system/os";
import { brainFiles } from "@/content/brainFiles";
import { baseTabs, curiosityTabs, hiddenTab, TAB_FOOTER } from "@/content/tabs";
import { experiments } from "@/content/projects";
import { resume, caseStats } from "@/content/resume";
import { ACHIEVEMENTS, EGGS } from "@/content/achievements";

/* ============================ RESUME ============================ */
function ResumeApp() {
  const { trackEgg } = useAchievements();
  return (
    <div>
      <div className="no-print" style={{ display: "flex", gap: 9, flexWrap: "wrap", marginBottom: 14 }}>
        <a className="btn btn-blue" href="/resume.pdf" download data-testid="resume-download"
          onClick={() => trackEgg("egg_paper_trail")}>
          <Download size={15} /> Download PDF
        </a>
        <button className="btn" data-testid="resume-print"
          onClick={() => { window.print(); trackEgg("egg_paper_trail"); }}>
          <Printer size={15} /> Print this page
        </button>
        <span className="chip">real pdf · 1 page · updated {resume.updated}</span>
      </div>

      <div className="resume-page print-target">
        <h2 style={{ color: "var(--ink)", letterSpacing: 0, fontFamily: "'Plus Jakarta Sans'", fontSize: 26, border: "none" }}>
          {resume.name}
        </h2>
        <div className="res-meta">{resume.location} · {resume.phone} · <a href={`mailto:${resume.email}`}>{resume.email}</a></div>
        <div className="res-meta"><a href={resume.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> · <a href="https://portfolio.krithiuk.space" target="_blank" rel="noreferrer">Portfolio</a> · <a href={resume.github} target="_blank" rel="noreferrer">GitHub</a></div>
        <div className="res-meta" style={{ marginTop: 6 }}>{resume.title}</div>

        <h2>SUMMARY</h2>
        <ul>{resume.summary.map((b: string, i: number) => <li key={i}>{b}</li>)}</ul>

        <h2>CORE EXPERTISE</h2>
        <p style={{ fontSize: 12.5 }}>{resume.coreExpertise.join(" | ")}</p>

        <h2>TECHNICAL SKILLS</h2>
        <ul>{Object.entries(resume.skills).map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}</ul>

        <h2>PROFESSIONAL EXPERIENCE</h2>
        {resume.experience.map((x: any, i: number) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <h3>{x.org} | {x.role}</h3>
            <div className="res-meta">{x.period}</div>
            {x.projects.map((pj: any, j: number) => (
              <div key={j} style={{ marginTop: 6 }}>
                <b style={{ fontSize: 13 }}>{pj.name}</b>
                <ul>{pj.bullets.map((b: string, k: number) => <li key={k}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
        ))}

        <h2>SELECTED PROJECTS</h2>
        <ul>{resume.selectedProjects.map((p: any, i: number) => <li key={i}><b>{p.name}:</b> {p.desc}</li>)}</ul>

        <h2>EDUCATION</h2>
        <div>
          <h3>{resume.education.degree}</h3>
          <div className="res-meta">{resume.education.school} | {resume.education.period}</div>
        </div>

        <h2>PROFESSIONAL CERTIFICATIONS</h2>
        <ul>{resume.certifications.map((c: string, i: number) => <li key={i}>{c}</li>)}</ul>
      </div>
    </div>
  );
}

/* ============================ MY BRAIN ============================ */
function BrainApp({ ctx }: { ctx: WindowCtx }) {
  const { state } = useAchievements();
  const { sliders } = useSettings();
  const files = brainFiles.filter((f) => !f.curiosityLocked || sliders.curiosity >= 70);
  return (
    <div>
      <div className="mono-sub">
        {files.length} files · ({state.eggs.length}/11 easter eggs found so far.)
        {sliders.curiosity >= 70 && <span style={{ color: "var(--elec)" }}> curiosity-gated file unlocked.</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {files.map((f) => (
          <button key={f.id} className="file-row" onClick={() => (f.special === "tabs_app" ? ctx.open("37_tabs_open") : ctx.open("file:" + f.id, { file: f }))}>
            <div className="f-ico" style={{ background: "var(--lav-soft)" }}>
              {f.kind.includes("markdown") ? <FileCode size={16} /> : <FileText size={16} />}
            </div>
            <div style={{ flex: 1 }}>
              <div className="f-name">{f.name}</div>
              <div className="f-meta">{f.kind} · modified: {f.modified}</div>
            </div>
            <span className="chip chip-lav">open</span>
          </button>
        ))}
        {sliders.curiosity < 70 && (
          <div className="mono-sub">1 more file… (curiosity ≥ 70. the slider knows where.)</div>
        )}
      </div>
      <p className="mono-sub" style={{ marginTop: 14 }}>
        rumor: a reward file appears here once every easter egg in the OS is found.
        {state.eggs.length >= EGGS.length && <span style={{ color: "var(--elec)" }}> it's real now.</span>}
      </p>
      {state.eggs.length >= EGGS.length && (
        <button className="file-row" onClick={() => ctx.open("file:reward.txt", { file: {
          id: "reward.txt", name: "reward.txt", kind: "text · legendary", meta: "you earned this", modified: "now",
          body: "## reward.txt\n\nyou found all 11 eggs. you clicked 3 stars, read the recycle bin's secrets,\ntyped 'krithi' into the void, and ran `coffee` in a fake terminal.\n\nthe reward is this: the session on this desktop is now\nofficially a good omen. go be someone's favourite candidate.\n\n— krithi\n",
        } })}>
          <div className="f-ico" style={{ background: "var(--butter)" }}><Star size={16} /></div>
          <div style={{ flex: 1 }}>
            <div className="f-name">reward.txt</div>
            <div className="f-meta">text · legendary · you earned this</div>
          </div>
        </button>
      )}
    </div>
  );
}

function FileViewerApp({ file }: { file: any }) {
  const { sliders } = useSettings();
  return (
    <div>
      <div className="mono-sub">{file.name} · {file.meta}</div>
      <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7 }}>
        {file.body}
        {sliders.overthinking >= 70 && (
          <p className="mono-sub" style={{ marginTop: 12 }}>alternative take (overthinking mode): did you fully read that? skim-readers never prosper. probably. maybe.</p>
        )}
      </div>
    </div>
  );
}

/* ============================ BUGS ============================ */
const CASE_STAGES = [
  {
    tab: "1. the problem",
    body: "A legacy Danish Microsoft Access application took 2–3 minutes to process key workflows. Operators ran it dozens of times a day. That's not a bug — that's a tax on every user, every time.",
  },
  {
    tab: "2. the investigation",
    body: "Profiled the whole flow. Found redundant table scans, queries inside loops, and recomputation of values that never change mid-run. Classic death by a thousand small queries.",
  },
  {
    tab: "3. the solution",
    body: "Restructured the workflow: batch the reads, hoist loop-invariant lookups, cache the heavy intermediate results. No rewrite — surgical changes only.",
  },
  {
    tab: "4. the lesson",
    body: "Performance work is archaeology: the real cause is rarely where the symptom is. Measure first, suspect everything, change as little as possible.",
  },
];

function BugsApp({ ctx }: { ctx: WindowCtx }) {
  const { markStage } = useAchievements();
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(0);
  return (
    <div>
      <div className="mono-sub">
        <span className="chip chip-coral">case_001 // performance</span> <span className="chip chip-sage">status: solved</span>
      </div>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 20, margin: "4px 0 10px" }}>The Two-Minute Problem.</h3>

      <div className="bar-row">
        <div className="bar-track"><div className="bar-fill" style={{ width: "96%", background: "var(--coral)", color: "#fff" }}>BEFORE · 2–3 minutes</div></div>
      </div>
      <div className="bar-row">
        <div className="bar-track"><div className="bar-fill" style={{ width: "5%", background: "var(--sage)" }}>AFTER · &lt;10 s</div></div>
      </div>

      {!open ? (
        <button className="btn" style={{ marginTop: 12 }} onClick={() => setOpen(true)}>
          <Wrench size={15} /> Investigate the case.
        </button>
      ) : (
        <div style={{ marginTop: 12 }}>
          <div className="step-tabs">
            {CASE_STAGES.map((s, i) => (
              <button key={i} className={`step-tab ${stage === i ? "active" : ""}`} data-testid={`case-stage-${i}`}
                onClick={() => { setStage(i); markStage(i); }}>{s.tab}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={stage} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}
              style={{ border: "2px solid var(--ink)", borderRadius: 10, padding: "12px 14px", background: "var(--sand-soft)", fontSize: 14 }}>
              {CASE_STAGES[stage].body}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="section-label">THE REST OF THE CASE FILES</div>
      <div className="stat-tiles">
        {caseStats.map((s, i) => (
          <div key={i} className="stat-tile">
            <div className="v">{s.value}</div>
            <div className="l">{s.label}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => ctx.open("experiments")}>
        <FlaskConical size={14} /> see the experiments
      </button>
    </div>
  );
}

/* ============================ EXPERIMENTS ============================ */
function ExperimentsApp({ ctx }: { ctx: WindowCtx }) {
  return (
    <div>
      <div className="mono-sub">
        {experiments.length} labs · each opens with problem, approach, tech, contribution, challenges and lessons.
        demos are simulations — nothing here pretends to be live.
      </div>
      <div className="proj-grid">
        {experiments.map((p) => (
          <button key={p.id} className="proj-card" data-testid={`experiment-${p.id}`} onClick={() => ctx.open("exp:" + p.id, { project: p })}>
            <div className="p-name">{p.name}</div>
            <div className="p-tag">{p.tagline}</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {p.tech.slice(0, 3).map((t) => <span key={t} className="chip chip-blue">{t}</span>)}
              {p.tech.length > 3 && <span className="chip">+{p.tech.length - 3}</span>}
            </div>
            <div className="p-demo">interactive demo</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ExperimentDetailApp({ project }: { project: any }) {
  const [scenario, setScenario] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [step, setStep] = React.useState(-1);
  const [result, setResult] = React.useState("");
  const steps = project.demo.scenarios[scenario].steps;

  const run = () => {
    setRunning(true); setStep(-1); setResult("");
    let i = 0;
    const iv = setInterval(() => {
      setStep(i);
      i++;
      if (i >= steps.length) {
        clearInterval(iv);
        setTimeout(() => {
          setResult(project.demo.scenarios[scenario].result);
          setRunning(false);
        }, 900);
      }
    }, 900);
  };

  return (
    <div>
      <span className="chip chip-blue">{project.role}</span>
      <div className="section-label">PROBLEM</div>
      <p style={{ margin: 0, fontSize: 14 }}>{project.problem}</p>
      <div className="section-label">APPROACH</div>
      <p style={{ margin: 0, fontSize: 14 }}>{project.approach}</p>
      <div className="section-label">TECHNOLOGIES</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {project.tech.map((t: string) => <span key={t} className="chip">{t}</span>)}
      </div>
      <div className="section-label">MY CONTRIBUTION</div>
      <p style={{ margin: 0, fontSize: 14 }}>{project.contribution}</p>
      <div className="section-label">CHALLENGES</div>
      <div className="quote-block">{project.challenges}</div>
      <div className="section-label">WHAT I LEARNED</div>
      <p style={{ margin: 0, fontSize: 14 }}>
        <Lightbulb size={14} style={{ display: "inline", verticalAlign: -2, color: "var(--butter-dark)" }} /> {project.learned}
      </p>

      <div className="section-label">INTERACTIVE DEMO</div>
      <div className="step-tabs">
        {project.demo.scenarios.map((s: any, i: number) => (
          <button key={i} className={`step-tab ${scenario === i ? "active" : ""}`} onClick={() => { setScenario(i); setStep(-1); setResult(""); }}>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-blue" onClick={run} disabled={running}><Play size={14} /> Run pipeline</button>
        <div>{steps.map((_: string, i: number) => (
          <span key={i} className={`pipe-step ${i <= step ? "on" : ""}`}>{i + 1}</span>
        ))}</div>
      </div>
      {step >= 0 && (
        <div className="mono-sub" style={{ marginTop: 8 }}>{steps[Math.min(step, steps.length - 1)]}</div>
      )}
      {result && (
        <div style={{ border: "2px solid var(--ink)", borderRadius: 10, background: "var(--sage-soft)", padding: "10px 13px", fontSize: 13, marginTop: 8 }}>
          {result}
        </div>
      )}
      <div className="mono-sub" style={{ marginTop: 10 }}>sample flow — simulation, not a live model.</div>
      {project.github && (
        <a className="btn btn-ghost" style={{ marginTop: 6 }} href={project.github} target="_blank" rel="noreferrer">
          <ExternalLink size={13} /> view the repo
        </a>
      )}
    </div>
  );
}

/* ============================ OUTSIDE THE TERMINAL ============================ */
function OutsideApp() {
  const { trackEgg, unlock } = useAchievements();
  const [showHidden, setShowHidden] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  return (
    <div>
      <div className="mono-sub">2 image cards · 1 childhood curriculum · 1 quote · 1 badly hidden file · some side quests</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {[
          { img: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&q=70", title: "saxophone", desc: "loud, patient, impossible to fake. practice today — the neighbours said 'brave'." },
          { img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=70", title: "food + mukbang", desc: "watching strangers eat gloriously at 2x speed. a lifestyle." },
        ].map((c, i) => (
          <div key={i} style={{ border: "2px solid var(--ink)", borderRadius: 12, overflow: "hidden", background: "var(--paper)", boxShadow: "var(--shadow-win)" }}>
            <img src={c.img} alt={c.title} style={{ width: "100%", height: 130, objectFit: "cover" }} />
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontWeight: 700 }}>{c.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-label">the childhood curriculum</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["drawing", "karate", "keyboard", "chess", "cricket", "yoga", "abacus", "swimming"].map((c) => (
          <span key={c} className="chip chip-lav">{c}</span>
        ))}
      </div>

      <div className="quote-block" style={{ marginTop: 14 }}>
        toastmasters taught me the scariest part of any talk is the first 20 seconds. everything after that is momentum.
      </div>

      <div style={{ border: "2px dashed var(--ink)", borderRadius: 10, padding: "10px 13px", marginTop: 14, background: "var(--sand-soft)" }}>
        <div style={{ fontSize: 13.5 }}>this folder contains 1 hidden file. it's not hiding well.</div>
        <button className="btn" style={{ marginTop: 8 }} onClick={() => setShowHidden((v) => !v)}>
          {showHidden ? "hide hidden files" : "show hidden files (1)"}
        </button>
        {showHidden && (
          <div style={{ marginTop: 10 }}>
            <button className="file-row" onClick={() => { if (!storyOpen) { trackEgg("egg_sax_file"); unlock("beyond_keyboard"); } setStoryOpen(true); }}>
              <div className="f-ico" style={{ background: "var(--coral-soft)" }}><FileQuestion size={16} /></div>
              <div style={{ flex: 1 }}>
                <div className="f-name">:something_not_written_in_python.md3</div>
                <div className="f-meta">extension? unknown. contents? personal.</div>
              </div>
            </button>
            <AnimatePresence>
              {storyOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ overflow: "hidden" }}>
                  <p style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 10 }}>
                    The saxophone was my first instrument that <em>pushed back</em>. Code waits for you;
                    a reed doesn't. Every practice session is a negotiation between breath, angle and
                    ego. I'm still losing it, most nights — which is exactly why I keep showing up.
                    (Also: nothing about playing sax was ever written in Python. The file name is the truth.)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="section-label">side quests</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {[
          { q: "main quest: ship software", s: "active", d: "document pipelines, agents, tools people actually use." },
          { q: "saxophone grade exam", s: "in progress", d: "theory is fine. embouchure is humbling." },
          { q: "read 12 technical books", s: "ongoing", d: "currently 3 deep. all have bookmarks at chapter 5." },
          { q: "morning run", s: "daily", d: "the running app judges silently. i respect it." },
          { q: "publish the writing folder", s: "completed", d: "three essays live. evals, cost curves, hybrid search." },
        ].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, border: "1.5px solid var(--ink)", borderRadius: 10, padding: "8px 12px", background: "var(--paper)" }}>
            <span className={`chip ${x.s === "active" ? "chip-coral" : x.s === "completed" ? "chip-sage" : "chip-butter"}`} style={{ flexShrink: 0 }}>{x.s}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{x.q}</div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{x.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ THOUGHTS / FUTURE / RECYCLE ============================ */
function ThoughtsApp() {
  const [joke, setJoke] = useState<string | null>(null);
  const files = [
    { name: "perfect_first_attempt.zip", type: "archive · 0 bytes", joke: "file empty. as the name promised." },
    { name: "bug_free_code.exe", type: "executable · not found in the wild", joke: "rumoured to exist. verified sightings: zero." },
    { name: "i_will_sleep_early.txt", type: "text · last modified 2:47 AM", joke: "modified at 2:47 AM. i rest my case." },
    { name: "life_plan_final.pdf", type: "pdf · 14 revisions", joke: "'final' is doing a lot of work in that filename." },
    { name: "one_small_project_that_stays_small.zip", type: "archive · 37 subfolders", joke: "currently contains 37 subfolders and a roadmap." },
    { name: "why_is_this_tab_open.md", type: "markdown · 1 page", joke: "the answer is always: research. it's always research." },
  ];
  return (
    <div>
      <div className="mono-sub">six fictional files. none of them open, all of them honest.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {files.map((f) => (
          <button key={f.name} className="file-row" onClick={() => setJoke(`<${f.name}> unavailable. reason: ${f.joke}`)}>
            <div className="f-ico" style={{ background: "var(--coral-soft)" }}><Ban size={15} /></div>
            <div style={{ flex: 1 }}>
              <div className="f-name">{f.name}</div>
              <div className="f-meta">{f.type}</div>
            </div>
          </button>
        ))}
      </div>
      {joke && <div className="quote-block">{joke}</div>}
    </div>
  );
}

function FutureApp() {
  const sections = [
    { h: "problems_i_enjoy_solving", b: "Document pipelines that almost-work. Data with one foot in chaos. Anything where the fix is 20% model and 80% systems thinking." },
    { h: "tech_to_explore", b: "Knowledge-graph retrieval in production. Structured outputs with guaranteed schemas. Anything that makes streaming audio less of a systems puzzle." },
    { h: "skills_to_improve", b: "Distributed systems depth. Design for edge cases I haven't been burned by yet. The discipline to leave a project alone once it works." },
    { h: "projects_i_might_build", b: "An agent that maintains its own test suite. A graph-based search over engineering org knowledge. A music theory practice app that yells at my fingering." },
    { h: "the_engineer_i_want_to_become", b: "Someone whose systems outlive their employment. Deterministic where possible, honest where not. The person you ask when the answer matters more than the speed." },
  ];
  return (
    <div>
      <div className="mono-sub">status: under construction, on purpose.</div>
      {sections.map((s) => (
        <div key={s.h}>
          <div className="section-label">{s.h}</div>
          <p style={{ margin: 0, fontSize: 14 }}>{s.b}</p>
        </div>
      ))}
    </div>
  );
}

function RecycleBinApp() {
  const { trackEgg } = useAchievements();
  const { push } = useToasts();
  const [joke, setJoke] = useState<string | null>(null);
  const items = [
    { name: "resume_v1.pdf", joke: "one of several standard-format resumes… see also: error 404" },
    { name: "i_will_stop_at_one_tab.exe", joke: "executed once. immediately opened two more." },
    { name: "sleep_schedule.sys", joke: "corrupted file. unrecoverable. sorry." },
    { name: "todo.txt.bak", joke: "a backup of a list. the list was 'make a backup of the list'." },
    { name: "definitely_not_an_easter_egg.txt", joke: "", egg: true },
  ];
  return (
    <div>
      <div className="mono-sub">5 items. deletion here is mostly theatrical.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((f) => (
          <button key={f.name} className="file-row" onClick={() => {
            if (f.egg) { trackEgg("egg_recycle_secret"); setJoke("you read it anyway. incredible."); }
            else setJoke(`<${f.name}> — ${f.joke}`);
          }}>
            <div className="f-ico" style={{ background: "var(--sand)" }}><Trash2 size={15} /></div>
            <div style={{ flex: 1 }}>
              <div className="f-name">{f.name}</div>
              <div className="f-meta">{f.egg ? "system file · do not read. seriously." : "deleted · resting"}</div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 12 }}>
        <button className="btn" onClick={() => push({ kind: "system", title: "restored!", desc: "nothing was restored. they live here now." })}>Restore all</button>
        <button className="btn btn-coral" onClick={() => push({ kind: "system", title: "bin emptied", desc: "the items applauded politely and stayed." })}>Empty recycle bin</button>
      </div>
      {joke && <div className="quote-block">{joke}</div>}
    </div>
  );
}

/* ============================ TERMINAL ============================ */
function TerminalApp({ ctx }: { ctx: WindowCtx }) {
  const { state, bumpTerminal, trackEgg } = useAchievements();
  const { sliders, setSlider, theme, setTheme } = useSettings();
  const { push } = useToasts();
  const [lines, setLines] = useState<string[]>([
    "krithi.os terminal v2.4 — type 'help'. nothing here can break; it's all pretend.",
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, 1e9); }, [lines]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const out = (s: string) => setLines((l) => [...l, s]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHIdx(-1);
    out(`krithi@krithi-os:~$ ${cmd}`);
    const [c, ...args] = cmd.toLowerCase().split(/\s+/);
    const arg = args.join(" ");
    bumpTerminal();

    switch (c) {
      case "help":
        out("commands: help · who am i · neofetch · projects · contact · certs · skills · ls · ls brain/ · cat <file> · pwd · coffee · sudo sleep · sudo hire · achievements · resume · open <app> · theme <cream|butter|lavender> · clear · exit");
        break;
      case "who": case "whoami":
        out("Krithi U K — applied AI engineer. document pipelines by day, saxophone by night. currently: open to new opportunities.");
        break;
      case "neofetch": {
        out("  ┌──────┐   OS: krithi.os v7.0");
        out("  │  ▲   │   stack: React · TS · Framer Motion · no backend");
        out("  │ ─┼─  │   CPU: curiosity " + sliders.curiosity + "%");
        out("  │ ─┴─  │   GPU: overthinking " + sliders.overthinking + "%");
        out("  └──────┘   Sleep daemon: " + sliders.sleep + "%");
        out("             Patience: " + sliders.tolerance + "%");
        out("             Tabs: 37 open, 0 closable");
        out(`             Eggs found: ${state.eggs.length}/11`);
        break;
      }
      case "projects":
        experiments.forEach((p, i) => out(`${i + 1}. ${p.name} — ${p.tagline}${p.github ? " (repo: " + p.github + ")" : ""}`));
        break;
      case "contact":
        out(`email: ${resume.email} · phone: ${resume.phone}`);
        out(`github: ${resume.github} · linkedin: ${resume.linkedin}`);
        break;
      case "certs":
        resume.certifications.forEach((x) => out("• " + x));
        break;
      case "skills":
        Object.entries(resume.skills).forEach(([k, v]) => out(`${k}: ${v}`));
        break;
      case "ls":
        if (arg.startsWith("brain")) brainFiles.forEach((f) => out(f.name));
        else out("my_brain/  bugs_i_fixed/  experiments/  outside_the_terminal/  unnecessary_thoughts/  future.exe  resume.pdf  recycle_bin/  terminal.exe  37_tabs_open/  personality_settings.exe");
        break;
      case "cat": {
        const f = brainFiles.find((x) => x.name.toLowerCase() === arg || x.id === arg);
        out(f ? f.body : `cat: ${arg}: no such file. try ls brain/`);
        break;
      }
      case "pwd":
        out("/home/krithi/brain (37 subfolders, all load-bearing)");
        break;
      case "coffee":
        out("0% coffee, 100% tabs.");
        trackEgg("egg_terminal_coffee");
        break;
      case "sudo":
        if (arg === "sleep") out("permission denied. sleep is controlled by the Sleep Optimization slider. try personality_settings.exe.");
        else if (arg === "hire") out("you are not in the sudoers file. yet.");
        else out(`sudo: ${arg || "…"}: not a real command, but respect the ambition.`);
        break;
      case "achievements":
        out(`achievements: ${state.unlocked.length}/7 · easter eggs: ${state.eggs.length}/11`);
        out("opening the tracker…");
        ctx.open("achievements");
        break;
      case "resume": ctx.open("resume"); break;
      case "open": {
        const app = args.join(" ");
        const target = ["my_brain","bugs_i_fixed","experiments","outside_the_terminal","unnecessary_thoughts","future.exe","resume","recycle bin","terminal.exe","37_tabs_open","personality_settings.exe","achievements"].find((a) => a.toLowerCase() === app);
        if (target) { ctx.open(target); out(`opening ${target}…`); }
        else out(`open: unknown app '${app}'. try 'ls'.`);
        break;
      }
      case "theme":
        if (["cream", "butter", "lavender"].includes(arg)) { setTheme(arg as any); out(`wallpaper set to ${arg}.`); }
        else out("theme: cream | butter | lavender");
        break;
      case "clear": setLines([]); break;
      case "exit": ctx.close("terminal.exe"); break;
      default:
        out(`command not found: ${c}`);
        out("type 'help'. don't worry — nothing here executes anything real.");
    }
  };

  return (
    <div>
      <div className="term" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
        {lines.map((l, i) => (
          <div key={i} style={l.startsWith("krithi@") ? { color: "#4ade80" } : undefined}>{l}</div>
        ))}
        <div className="term-input-row">
          <span className="prompt">krithi@krithi-os:~$ </span>
          <input
            ref={inputRef}
            className="term-input"
            aria-label="Terminal input"
            data-testid="terminal-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { run(value); setValue(""); }
              else if (e.key === "ArrowUp") { e.preventDefault(); const n = Math.min(hIdx + 1, history.length - 1); if (history[n]) { setHIdx(n); setValue(history[n]); } }
              else if (e.key === "ArrowDown") { e.preventDefault(); const n = Math.max(hIdx - 1, -1); setHIdx(n); setValue(n === -1 ? "" : history[n]); }
            }}
          />
        </div>
      </div>
      <div className="term-chips">
        {["help", "who am i", "neofetch", "projects", "contact", "coffee", "resume"].map((c) => (
          <button key={c} onClick={() => run(c)}>{c}</button>
        ))}
      </div>
    </div>
  );
}

/* ============================ 37 TABS BROWSER ============================ */
function TabsApp({ ctx }: { ctx: WindowCtx }) {
  const { sliders } = useSettings();
  const { markTab, trackEgg } = useAchievements();
  const [closed, setClosed] = useState<string[]>([]);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("t1");
  const tabs = [
    ...baseTabs.filter((t) => !closed.includes(t.id)),
    ...(sliders.curiosity >= 70 ? curiosityTabs.filter((t) => !closed.includes(t.id)) : []),
    ...(hidden ? [hiddenTab] : []),
  ];
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div className="mono-sub">simulated browser · tabs are decorative AND load-bearing</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", borderBottom: "2px solid var(--ink)", paddingBottom: 8, marginBottom: 12 }}>
        {tabs.map((t) => (
          <span key={t.id} className={`chip ${t.id === active ? "chip-butter" : ""}`} style={{ cursor: "pointer" }}
            onClick={() => { setActive(t.id); markTab(t.id); if (t.id === hiddenTab.id) trackEgg("egg_hidden_tab"); }}>
            {t.title}
            <span role="button" aria-label={`Close tab: ${t.title}`} style={{ fontWeight: 700 }}
              onClick={(e) => { e.stopPropagation(); setClosed((c) => [...c, t.id]); }}>&times;</span>
          </span>
        ))}
        <button className="chip" aria-label="Reveal one more tab" data-testid="reveal-tab"
          onClick={() => { setHidden(true); trackEgg("egg_hidden_tab"); }}>+</button>
      </div>
      {current && (
        <div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 17, margin: "0 0 8px" }}>{current.title}</h3>
          <p style={{ fontSize: 14, margin: 0 }}>{current.body}</p>
          {current.action && (
            <button className="btn" style={{ marginTop: 10 }} onClick={() => ctx.open(current.action!.openApp as any)}>
              {current.action.label}
            </button>
          )}
        </div>
      )}
      <div className="mono-sub" style={{ marginTop: 14 }}>{TAB_FOOTER}</div>
    </div>
  );
}

/* ============================ SETTINGS ============================ */
function SettingsApp({ ctx }: { ctx: WindowCtx }) {
  const { sliders, setSlider, theme, setTheme, setSliders, play } = useSettings();
  const { push } = useToasts();
  const { unlock } = useAchievements();
  const prev = useRef({ chaos: false, impatient: false });

  useEffect(() => {
    const impatient = sliders.tolerance <= 30;
    if (impatient && !prev.current.impatient) { ctx.open("perf:analysis", { perf: true }); }
    prev.current.impatient = impatient;
    const c = sliders.curiosity >= 70 && sliders.overthinking >= 70;
    if (c && !prev.current.chaos) {
      unlock("chaos_engineer");
      push({ kind: "mode", title: "CHAOTIC RESEARCH MODE", desc: "curiosity and overthinking reached a dangerous agreement. extra tabs deployed." });
      (window as any).__chaosBus?.();
    }
    prev.current.chaos = c;
  }, [sliders, unlock, push]);

  const bands = (v: number) => (v >= 70 ? "HIGH" : v <= 30 ? "LOW" : "mid");
  const statusLine: Record<string, (v: number) => string> = {
    curiosity: (v) => bands(v) === "HIGH" ? "extra files, secret tabs and side doors unlocked." : bands(v) === "LOW" ? "closed tabs. locked doors. peaceful, suspicious calm." : "open tabs: manageable. barely.",
    overthinking: (v) => bands(v) === "HIGH" ? "sticky notes and a decision simulator deployed." : bands(v) === "LOW" ? "surprisingly zen. suspiciously zen." : "mild second-guessing. healthy-ish.",
    sleep: (v) => bands(v) === "HIGH" ? "the OS is yawning — theme softened, motion calmed." : bands(v) === "LOW" ? "late-night build energy." : "mostly-rested runtime.",
    tolerance: (v) => bands(v) === "LOW" ? "simulated loading screens incoming." : bands(v) === "HIGH" ? "infinite patience. apps love you." : "mild toe-tapping permitted.",
  };

  const presets = [
    { name: "chaotic research", v: { curiosity: 100, overthinking: 90, sleep: 10, tolerance: 0 } },
    { name: "bedtime conflict", v: { curiosity: 80, overthinking: 40, sleep: 95, tolerance: 50 } },
    { name: "performance impatience", v: { curiosity: 60, overthinking: 80, sleep: 40, tolerance: 10 } },
  ];

  return (
    <div>
      <div className="mono-sub">
        humorous interface controls, not psychological measurements. changes apply across the OS immediately.
        thresholds: high ≥ 70, low ≤ 30.
      </div>
      {(Object.keys(sliders) as (keyof typeof sliders)[]).map((k) => (
        <div key={k} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{k}</span>
            <span className="chip">{sliders[k]}</span>
          </div>
          <input type="range" min={0} max={100} value={sliders[k]} data-testid={`slider-${k}`}
            onChange={(e) => setSlider(k, +e.target.value)} style={{ width: "100%", accentColor: "var(--elec)" }} />
          <div className="mono-sub">{statusLine[k](sliders[k])}</div>
        </div>
      ))}

      <div className="section-label">WALLPAPER</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {(["cream", "butter", "lavender"] as const).map((t) => (
          <button key={t} className={`chip ${theme === t ? "chip-butter" : ""}`} onClick={() => setTheme(t)}>
            {t} {theme === t ? "✓" : ""}
          </button>
        ))}
        <span className="mono-sub">or whisper 'theme lavender' to terminal.exe</span>
      </div>

      <div className="section-label">PRESETS</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {presets.map((p) => (
          <button key={p.name} className="btn" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => setSliders(p.v)}>
            {p.name}
          </button>
        ))}
        <button className="btn btn-ghost" style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => { setSliders({ curiosity: 70, overthinking: 69, sleep: 30, tolerance: 60 }); play("click"); }}>
          Reset to defaults
        </button>
      </div>

      {sliders.tolerance <= 30 && (
        <button className="btn" style={{ marginTop: 14 }} onClick={() => ctx.open("perf:analysis", { perf: true })}>
          <Skull size={14} /> open performance_analysis.exe
        </button>
      )}
    </div>
  );
}

function PerformanceApp({ ctx }: { ctx: WindowCtx }) {
  const { setSlider } = useSettings();
  const rows = [
    { p: "switching between tabs", u: "84%", n: "chronic. incurable. load-bearing." },
    { p: "rerendering decisions", u: "61/s", n: "each one confident. each one revised." },
    { p: "pretending to read docs", u: "37%", n: "skim-read. skim-retained." },
    { p: "actual compiling", u: "12%", n: "the machine's job, honestly." },
    { p: "sleep daemon", u: "0%", n: "not found." },
  ];
  return (
    <div>
      <div className="mono-sub">profiler output — subject: you.</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textAlign: "left" }}>
          <th style={{ padding: 6, borderBottom: "2px solid var(--ink)" }}>process</th>
          <th style={{ padding: 6, borderBottom: "2px solid var(--ink)" }}>usage</th>
          <th style={{ padding: 6, borderBottom: "2px solid var(--ink)" }}>notes</th>
        </tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5 }}>{r.p}</td>
              <td style={{ padding: 6, fontWeight: 700 }}>{r.u}</td>
              <td style={{ padding: 6, color: "var(--ink-soft)" }}>{r.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="quote-block">verdict: the bottleneck is you (affectionate).</div>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
        <button className="btn" onClick={() => ctx.open("bugs_i_fixed")}>Investigate the real optimization story</button>
        <button className="btn btn-ghost" onClick={() => setSlider("tolerance", 60)}>recalibrate tolerance</button>
      </div>
    </div>
  );
}

/* ============================ ACHIEVEMENTS ============================ */
function AchievementsApp() {
  const { state } = useAchievements();
  return (
    <div>
      <div className="mono-sub">progress is saved in your browser. no accounts, no tracking — just badges.</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
        {state.unlocked.length}/7 achievements · {state.eggs.length}/11 easter eggs
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {ACHIEVEMENTS.map((a) => {
          const got = state.unlocked.includes(a.id);
          return (
            <div key={a.id} style={{ border: "2px solid var(--ink)", borderRadius: 10, padding: "10px 13px", background: got ? "var(--sage-soft)" : "var(--sand-soft)", opacity: got ? 1 : 0.75 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Trophy size={15} style={{ color: got ? "var(--butter-dark)" : "var(--ink-faint)" }} />
                <b>{a.name}</b>
                <span className={`chip ${got ? "chip-sage" : ""}`}>{got ? "unlocked" : "locked"}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 4 }}>
                {got ? a.description : `hint: ${a.hint}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ LOADING MODAL (tolerance LOW) ============================ */
export function LoadingModal({ onDone, onInvestigate }: { onDone: () => void; onInvestigate?: () => void }) {
  const { sliders } = useSettings();
  const [p, setP] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setP((v) => Math.min(100, v + 7)), 180);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="load-modal no-print">
      <div className="load-card">
        <div className="font-display" style={{ fontWeight: 800, fontSize: 18 }}>reallocating attention …</div>
        <div className="load-bar"><div style={{ width: p + "%" }} /></div>
        <div className="mono-sub">(tolerance for slow apps is low. the OS noticed.)</div>
        <div style={{ display: "flex", gap: 9, justifyContent: "center", marginTop: 10 }}>
          <button className="btn btn-blue" onClick={onInvestigate}>Investigate the case</button>
          <button className="btn" onClick={onDone}>wait it out</button>
        </div>
      </div>
    </div>
  );
}

/* ============================ ROUTER ============================ */
export function WindowFrame({ win, ctx }: { win: WinState; ctx: any }) {
  const props = ctx.focusedAppProps[win.id] ?? {};
  let content: React.ReactNode;
  switch (true) {
    case win.id === "resume": content = <ResumeApp />; break;
    case win.id === "my_brain": content = <BrainApp ctx={ctx} />; break;
    case win.id === "bugs_i_fixed": content = <BugsApp ctx={ctx} />; break;
    case win.id === "experiments": content = <ExperimentsApp ctx={ctx} />; break;
    case win.id === "outside_the_terminal": content = <OutsideApp />; break;
    case win.id === "unnecessary_thoughts": content = <ThoughtsApp />; break;
    case win.id === "future.exe": content = <FutureApp />; break;
    case win.id === "recycle bin": content = <RecycleBinApp />; break;
    case win.id === "terminal.exe": content = <TerminalApp ctx={ctx} />; break;
    case win.id === "37_tabs_open": content = <TabsApp ctx={ctx} />; break;
    case win.id === "personality_settings.exe": content = <SettingsApp ctx={ctx} />; break;
    case win.id === "achievements": content = <AchievementsApp />; break;
    case win.id.startsWith("exp:"): content = <ExperimentDetailApp project={props.project} />; break;
    case win.id.startsWith("file:"): content = <FileViewerApp file={props.file} />; break;
    case win.id.startsWith("perf:"): content = <PerformanceApp ctx={ctx} />; break;
    default: content = <div className="mono-sub">…</div>;
  }
  return (
    <OsWindow win={win} ctx={ctx}>
      {content}
    </OsWindow>
  );
}
