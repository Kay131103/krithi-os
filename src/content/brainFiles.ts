export type BrainFile = {
  id: string;
  name: string;
  kind: string;
  meta: string;
  modified: string;
  special?: "tabs_app";
  curiosityLocked?: boolean;
  body: string;
};

export const brainFiles: BrainFile[] = [
  {
    id: "37_tabs_open.txt",
    name: "37_tabs_open.txt",
    kind: "text · 37 forks",
    meta: "size: escalating",
    modified: "always",
    special: "tabs_app",
    body: "this file doesn't open here — it IS the browser. click it.",
  },
  {
    id: "things_i_overthink.md",
    name: "things_i_overthink.md",
    kind: "markdown · 4.2 KB",
    meta: "size: growing",
    modified: "3 minutes ago",
    body:
      "## things i overthink\n\n" +
      "- whether the error message i just wrote will outlive me\n" +
      "- whether `2 + 2` should be a constant. it feels like it wants to be.\n" +
      "- that one code review comment from 8 months ago that said 'nit:' but in a tone\n" +
      "- whether my abstractions are load-bearing or just decorative scaffolding\n" +
      "- if the linter is mad at me in a way it hasn't told me about\n" +
      "- how many tabs is too many tabs. (current working theory: no such number)\n" +
      "- whether deleting dead code counts as a personality change\n" +
      "- database migrations. just, in general. as a category.\n" +
      "- whether 'works on my machine' is an excuse or a deployment strategy\n" +
      "- the fact that `null` was a billion-dollar mistake and we shipped it anyway",
  },
  {
    id: "current_side_quest.txt",
    name: "current_side_quest.txt",
    kind: "text · 2.1 KB",
    meta: "status: multiple",
    modified: "today",
    body:
      "## current side quests\n\n" +
      "> main quest: shipping software that survives contact with users.\n\n" +
      "1. **rag_chatbot** — done, streamed, cited. currently: adding hybrid retrieval.\n" +
      "2. **realtime_voice_agent** — done. currently: latency tuning on the reconnect path.\n" +
      "3. **ai_code_review_agent** — done, watching PRs. currently: more deterministic rules.\n" +
      "4. **krithi.os** — you're inside it. currently: this sentence.\n" +
      "5. next up: something with structured outputs and knowledge graphs. the NITK itch never went away.",
  },
  {
    id: "origin_story.md",
    name: "origin_story.md",
    kind: "markdown · 3.4 KB",
    meta: "origin: true",
    modified: "2021 — ongoing",
    body:
      "## origin story\n\n" +
      "Mangaluru, Karnataka. Started with the usual childhood curriculum: drawing, karate, " +
      "keyboard, chess, cricket, yoga, abacus, and swimming — each one teaching a different " +
      "kind of patience.\n\n" +
      "Then a computer science degree at **NMAM Institute of Technology (2021–2025)**, " +
      "graduating with a **CGPA 8.93/10** and a growing suspicion that the most interesting " +
      "problems live between machine learning and actual product code.\n\n" +
      "Along the way: a research internship at **NITK** (video captioning + knowledge graphs), " +
      "a content internship at **Cantilever Labs**, a training internship, and then a real " +
      "job building document-intelligence pipelines at **EG India** — where 'the PDF is " +
      "slightly rotated' became a personality trait.\n\n" +
      "Currently: applied AI engineer. Document pipelines by day, saxophone by night.",
  },
  {
    id: "things_that_make_me_me.txt",
    name: "things_that_make_me_me.txt",
    kind: "text · 1.8 KB",
    meta: "accuracy: high",
    modified: "recently",
    body:
      "## things that make me me\n\n" +
      "- **saxophone.** loud, patient, and impossible to fake. like good code review.\n" +
      "- **food + mukbang videos.** watching strangers eat gloriously at 2x speed.\n" +
      "- **toastmasters.** i voluntarily speak in public. on purpose.\n" +
      "- chess. cricket. abacus muscle memory that still computes change faster than the cashier.\n" +
      "- the specific joy of a test suite going green after 40 minutes of denial.",
  },
  {
    id: "more_questions_than_answers.txt",
    name: "more_questions_than_answers.txt",
    kind: "text · 2.6 KB",
    meta: "answers: pending",
    modified: "continuously",
    curiosityLocked: true,
    body:
      "## more questions than answers\n\n" +
      "- if an LLM extracts a price list and no human reviews it, is it in the estimate?\n" +
      "- why do the best abstractions read like apology letters?\n" +
      "- is curiosity a slider or a ratchet? (the OS seems to think it's a slider. i disagree.)\n" +
      "- at what point does a side quest become the main quest?\n" +
      "- if the model is confident and wrong, who is responsible — the model, the prompt, or the person who shipped it?\n" +
      "- why does every 'final' folder contain a v2?",
  },
];
