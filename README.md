# 🖥️ KRITHI.OS

A personal portfolio disguised as a playful desktop operating system. "Error 404:
Standard Resume Not Found" — the resume exists though, it's just not standard.

Built from scratch with **React 18 + Vite + Tailwind CSS + Framer Motion + lucide-react**.
No backend, no router. All content lives in typed data files (`src/content/*.ts`),
all progress in `localStorage`.

## What's inside
- **Boot sequence** with warm-boot visit counter → "Error 404" splash → desktop
- **Window manager**: draggable, stackable, minimizable windows (bottom sheets on mobile)
- **11 apps**: resume (real HTML resume + print CSS), my_brain, bugs_i_fixed (animated
  case study), experiments (8 projects with simulated demos), outside_the_terminal,
  unnecessary_thoughts, future.exe, recycle bin, terminal (fake shell with `neofetch`),
  37_tabs_open (simulated browser), personality_settings (4 sliders that change the whole OS)
- **Gamification**: 7 achievements + 11 easter eggs (pokable star, secret knock, hidden tab…)
- **Derived modes**: CHAOTIC RESEARCH MODE, bedtime, impatient loading screens
- Synthesized UI sounds via Web Audio (no audio files)

## Editing content
Everything personal lives in `src/content/`:
| File | What's in it |
|---|---|
| `resume.ts` | the resume shown in the resume app |
| `projects.ts` | the 8 experiments (problem/approach/contribution/demo) |
| `brainFiles.ts` | the my_brain folder |
| `tabs.ts` | the 37_tabs_open browser simulation |
| `achievements.ts` | achievements + egg IDs |
| `apps.ts` | desktop icons + window titles |

Sliders/defaults: `src/system/os.tsx` (`DEFAULT_SLIDERS`). Secret knock word: `SECRET_WORD` in `src/os/Desktop.tsx`.

## Dev / build
```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # → dist/
```
Put the real resume at `public/resume.pdf` so "Download PDF" works.

## Deploy
GitHub Actions deploys to Cloudflare Pages on every push to `main`
(secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).
