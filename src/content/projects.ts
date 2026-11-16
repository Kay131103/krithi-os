export type Experiment = {
  id: string;
  name: string;
  tagline: string;
  tech: string[];
  role: string;
  github?: string;
  problem: string;
  approach: string;
  contribution: string;
  challenges: string;
  learned: string;
  demo: {
    scenarios: { label: string; steps: string[]; result: string }[];
  };
};

export const experiments: Experiment[] = [
  {
    id: "ai_price_list_extraction",
    name: "ai_price_list_extraction",
    tagline: "Danish construction price lists → structured, reviewable data",
    tech: ["AWS Bedrock", "Claude Vision", "FastAPI", "PostgreSQL", "pgvector", "React"],
    role: "Backend & pipeline engineer",
    problem:
      "Construction price lists arrive as hundreds of PDF pages across three trades — plumbing (VVS), masonry, painting. Reading them manually is slow and error-prone; every downstream estimate depends on getting every price right.",
    approach:
      "A resumable, multi-stage pipeline: render pages, preprocess, extract with Claude vision on AWS Bedrock using trade-specific prompts, filter, deduplicate, resolve cross-references, and surface everything in a page-level review UI.",
    contribution:
      "Built the pipeline end to end: page rendering and preprocessing, Bedrock extraction with per-trade prompts, grid-row number synthesis, collision handling, VVS surcharge classification and linking, plus per-job token and cost tracking.",
    challenges:
      "Every supplier formats price lists differently. Grid rows bleed across pages, numbers collide after deduplication, and surcharges reference rows dozens of pages away.",
    learned:
      "Extraction quality is a data problem, not a model problem. Deterministic post-processing and review tooling moved the needle more than any prompt tweak.",
    demo: {
      scenarios: [
        {
          label: "how does it parse a grid row?",
          steps: ["render page", "preprocess + deskew", "claude vision extract", "synthesize grid rows"],
          result: "Row parsed: item 2.1, VVS pipe Ø25 — unit price 41.50 DKK, quantity 12, surcharge link → 5.3. flagged for review: none.",
        },
        {
          label: "what if two rows collide?",
          steps: ["detect duplicate key", "compare page context", "collision resolution", "flag or merge"],
          result: "collision: item 2.1 appears on pages 12 and 14. kept page 14 (revision marker newer). page 12 copy flagged for human review.",
        },
      ],
    },
  },
  {
    id: "construction_cost_estimation",
    name: "construction_cost_estimation",
    tagline: "Six product areas of an estimation platform, from tender to calculation",
    tech: ["Angular 21", ".NET 10", "xUnit", "PostgreSQL"],
    role: "Full-stack developer",
    problem:
      "Estimators juggle tender imports, product libraries, company settings and a live calculation canvas — each a separate product area with its own rules and edge cases.",
    approach:
      "Contribute across Customer, Library, Company Settings, Tender Import, Estimate Canvas and the calculation interface — including an AI-assisted tender import for PDF and Excel documents.",
    contribution:
      "Built tender-import flows, UI/UX improvements and .NET 10 estimation features; supported functional testing and debugging within a platform carrying 200+ frontend unit-test files and 5 xUnit test projects.",
    challenges:
      "Import documents that 'almost' match the expected schema — a missing column, a merged cell, a currency switch mid-sheet.",
    learned:
      "On a mature platform, the hardest part isn't writing features — it's not breaking the 200 test files that already encode the business.",
    demo: {
      scenarios: [
        {
          label: "importing an excel tender",
          steps: ["parse workbook", "map columns", "validate rules", "stage for review"],
          result: "94 rows imported. 3 rows flagged: unit mismatch on row 41, unknown product code on row 58, price missing on row 77.",
        },
        {
          label: "recalculating an estimate",
          steps: ["load canvas", "apply quantity changes", "cascade surcharges", "persist snapshot"],
          result: "recalculation complete. 2,417 line items updated, 38 surcharge chains resolved, snapshot saved.",
        },
      ],
    },
  },
  {
    id: "product_alternative_discovery",
    name: "product_alternative_discovery",
    tagline: "Finding viable VVS product alternatives in a heavily skewed dataset",
    tech: ["Python", "Jaccard Similarity", "Pandas", "Feedback Loops"],
    role: "Data analyst",
    problem:
      "A product dataset so skewed that most categories have one dominant product and dozens of near-empty ones — how do you recommend a viable alternative?",
    approach:
      "Analyse the skew first, then apply Jaccard similarity against a defined threshold, with a feedback loop that refined recommendation relevance over time.",
    contribution:
      "Designed the similarity threshold, analysed the skew, built the feedback loop that kept recommendations relevant instead of collapsing into the dominant products.",
    challenges:
      "Popularity bias: a naive recommender suggests the same top product for every query.",
    learned:
      "On skewed data, the interesting engineering is in what you exclude, not what you score.",
    demo: {
      scenarios: [
        {
          label: "finding an alternative",
          steps: ["load category", "compute jaccard", "apply threshold", "rank candidates"],
          result: "3 alternatives above threshold 0.42. top pick: 0.68 similarity, non-dominant product, in-stock.",
        },
        {
          label: "what if the query is vague?",
          steps: ["parse attributes", "expand terms", "recompute jaccard", "present options"],
          result: "query 'pipe 25' expanded to Ø25 PVC pressure pipe family. 5 candidates, sorted by similarity and availability.",
        },
      ],
    },
  },
  {
    id: "rag_chatbot",
    name: "docbrain",
    tagline: "Streaming cited answers with query rewriting over ChromaDB",
    tech: ["LangGraph", "ChromaDB", "FastAPI", "React", "SSE", "Docker"],
    role: "Builder — end to end",
    github: "https://github.com/Kay131103/rag-chatbot",
    problem:
      "Chatbots hallucinate confidently when the answer isn't in their weights. A doc-grounded assistant needs to retrieve, rewrite vague follow-ups, and cite everything.",
    approach:
      "LangGraph pipeline: rewrite the question into a standalone query from conversation history, retrieve top-k from ChromaDB, generate a streamed answer with citations — or admit no context was found.",
    contribution:
      "Built the graph, the ingestion (chunking + embeddings), the SSE streaming API and the React frontend with markdown rendering and inline [n] citations.",
    challenges:
      "Follow-up questions like 'and what about the second one?' break naive RAG. Also: citations that the model invents.",
    learned:
      "Query rewriting and an honest 'no context found' path matter more than chunk-size tuning.",
    demo: {
      scenarios: [
        {
          label: "how does it cite sources?",
          steps: ["question", "query rewrite", "chromadb retrieval", "grounded answer + citations"],
          result: "Answer streamed with inline [1] [2] citations, each linking to the exact chunk. 2 sources shown below the message.",
        },
        {
          label: "what if my query is vague?",
          steps: ["question", "history rewrite", "standalone query", "retrieval"],
          result: "'and the second one?' rewritten to: 'what is the second limitation of the retrieval step?' — retrieved 3 relevant chunks.",
        },
      ],
    },
  },
  {
    id: "realtime_voice_agent",
    name: "voxbox",
    tagline: "Speech-to-speech assistant with barge-in, on Gemini Live",
    tech: ["Gemini Live", "WebSockets", "Next.js", "FastAPI", "Web Audio API", "TypeScript"],
    role: "Builder — end to end",
    github: "https://github.com/Kay131103/realtime-voiceagent",
    problem:
      "Text chat is fine, but a real assistant should be interruptible mid-sentence — barge-in, gapless playback, and instant reconnection when the network hiccups.",
    approach:
      "Stream 16 kHz mic capture over WebSockets to Gemini Live, play 24 kHz audio gaplessly via the Web Audio API, with automatic reconnection and an ephemeral token service.",
    contribution:
      "Built the full stack: FastAPI token backend, Next.js frontend, audio graph, interruption handling and reconnect logic.",
    challenges:
      "Echo (the model hearing itself), audio jitter on reconnect, and keeping sessions ephemeral so tokens never live in the browser long.",
    learned:
      "Realtime audio is a systems problem: buffering, backpressure and reconnection dwarf the model integration.",
    demo: {
      scenarios: [
        {
          label: "interruption (barge-in)",
          steps: ["model speaking", "user starts talking", "pause playback", "process new input"],
          result: "playback cut in 80 ms mid-sentence. model acknowledged the interruption and answered the new question.",
        },
        {
          label: "connection drop mid-chat",
          steps: ["detect close frame", "backoff + retry", "resume session", "restore transcript"],
          result: "reconnected in 1.2 s. transcript restored, audio stream resumed without losing the last exchange.",
        },
      ],
    },
  },
  {
    id: "ai_code_review_agent",
    name: "ai_code_review_agent",
    tagline: "Deterministic checks + optional LLM review on every pull request",
    tech: ["Python", "GitHub API", "Docker", "LLM Integration"],
    role: "Builder — end to end",
    github: "https://github.com/Kay131103/pr-review-agent",
    problem:
      "Human review is the bottleneck. But LLM-only reviewers hallucinate line numbers and miss mechanical issues.",
    approach:
      "Two passes: deterministic rule-based checks (committed secrets, merge markers, debuggers, large files) always run; an optional LLM pass anchors every finding to a real diff line.",
    contribution:
      "Built the diff parser, rule engine, GitHub review/status posting, webhook + polling modes and the SQLite dedup so restarts never double-review.",
    challenges:
      "Anchoring LLM findings to commentable lines — if it picks a line GitHub can't comment on, fall back to the summary.",
    learned:
      "Deterministic-first design means the LLM failing (rate limit, outage) never blocks a review.",
    demo: {
      scenarios: [
        {
          label: "a PR with a leaked key",
          steps: ["fetch diff", "rule checks", "optional llm pass", "post review"],
          result: "1 blocking finding: AWS access key in src/config.py line 14. commit status set to failure. LLM pass skipped (deterministic verdict).",
        },
        {
          label: "a clean PR",
          steps: ["fetch diff", "rule checks", "llm review", "approve summary"],
          result: "0 rule findings. LLM left 1 nit: 'consider memoizing this lookup'. status: success.",
        },
      ],
    },
  },
  {
    id: "video_captioning_research",
    name: "video_captioning_research",
    tagline: "NITK research: from visual frames to natural-language description",
    tech: ["Python", "Deep Learning", "Computer Vision", "Research"],
    role: "Research intern",
    problem:
      "How much does a captioning model actually understand of the visual frame sequence — and can generated captions feed structured knowledge graphs?",
    approach:
      "Evaluate the relationship between visual-frame understanding and caption quality; prototype feeding generated captions into structured, searchable graph representations.",
    contribution:
      "Literature survey, model evaluation pipeline, and the caption→graph prototype exploring entity-relation extraction from descriptions.",
    challenges:
      "Captions that are fluent but visually wrong — fluency is a terrible proxy for grounding.",
    learned:
      "Structured outputs expose model failures that free text hides beautifully.",
    demo: {
      scenarios: [
        {
          label: "caption to graph",
          steps: ["frame sampling", "caption generation", "entity extraction", "graph insertion"],
          result: "caption: 'a person in a red jacket skiing down a slope'. nodes: person, jacket, ski slope. edges: wears, located-on. confidence 0.81.",
        },
        {
          label: "grounding check",
          steps: ["captions vs frames", "object-detection crosscheck", "flag mismatches", "score"],
          result: "grounding score 0.64. flagged: caption mentions 'helmet' absent from 4/6 sampled frames.",
        },
      ],
    },
  },
  {
    id: "knowledge_graph_search",
    name: "knowledge_graph_search",
    tagline: "Searchable, relationship-aware graphs from unstructured text",
    tech: ["Knowledge Graphs", "Python", "NLP", "Embeddings"],
    role: "Research prototype",
    problem:
      "Documents know things, but not relationships. Search returns pages, not answers with structure.",
    approach:
      "Extract entities and relations into a graph, combine graph traversal with embedding similarity for retrieval, and expose relationship-aware queries.",
    contribution:
      "Prototyped the extraction → graph → hybrid search loop as a research exploration tied to the NITK captioning work.",
    challenges:
      "Entity resolution: 'Kubernetes', 'k8s' and 'the orchestrator' are one node in reality.",
    learned:
      "A small, clean graph beats a large noisy one — traversal quality collapses with edge noise.",
    demo: {
      scenarios: [
        {
          label: "relationship query",
          steps: ["parse query", "resolve entities", "traverse graph", "compose answer"],
          result: "'what depends on the auth service?' → 2-hop traversal: gateway → auth, billing → auth. 4 supporting documents attached.",
        },
        {
          label: "hybrid retrieval",
          steps: ["embedding search", "graph expansion", "rerank", "return"],
          result: "7 hits: 3 from pure vector similarity, 4 expanded via graph neighbours. merged and reranked.",
        },
      ],
    },
  },
  {
    id: "swara_lab",
    name: "swara_lab",
    tagline: "Upload a recording — get the notes, MIDI and a raga shortlist",
    tech: ["PHP", "Python", "librosa pYIN", "PostgreSQL", "Vercel Container"],
    role: "Builder — end to end",
    problem:
      "Practice recordings vanish into the void. Turning a hummed phrase into written swaras, MIDI and a raga shortlist normally means paid desktop tools and manual transcription.",
    approach:
      "A container-deployed pipeline: pYIN pitch extraction, note segmentation, an alto-saxophone written-scale transposition, sargam grouped beatwise in the carnatic style, and a tala auto-detected from the audio's onsets.",
    contribution:
      "Built the whole pipeline — upload, pitch analysis, sargam rendering, raga matching against a scale library, and a Postgres-backed library of past analyses.",
    challenges:
      "Pitch trackers lie on transitions, and the tala is whatever the player's hand is doing, not what a beat-tracker guesses. Honest UI beats confident guesses.",
    learned:
      "The last 5% of an audio pipeline is presentation: showing swaras the way a carnatic musician reads them matters more than another decimal of F1 score.",
    demo: {
      scenarios: [
        {
          label: "what does an upload return?",
          steps: ["upload wav", "pYIN pitch track", "segment notes", "match ragas"],
          result: "Sargam sheet + MIDI download + ranked raga shortlist. Sargam shown in the alto's written scale (A# base).",
        },
        {
          label: "what about the tala?",
          steps: ["onset detection", "beat tracking", "anga inference"],
          result: "Tala auto-detected from the audio. The sargam is grouped beatwise so the counts line up.",
        },
      ],
    },
  },
  {
    id: "tala_lab",
    name: "tala_lab",
    tagline: "All 35 carnatic talas, performed by a rigged 3D hand",
    tech: ["Three.js", "Web Audio API", "GLTF", "Vite"],
    role: "Builder — end to end",
    problem:
      "Learning tala means watching a teacher's hand. Apps show dots and numbers; nothing demonstrates the gestures — the strike, the finger counts, the palm flip.",
    approach:
      "Build every tala from its angas, animate a rigged 3D hand through the authentic gestures — wrist strike, fingers folding in counting order (little, ring, middle, index, thumb), the palm turn-over for drutham — with a synthesized Sa-Pa tanpura drone and gati subdivisions.",
    contribution:
      "The tala engine, the 3D hand rig and its gesture system, the tanpura synth, and the 35-tala family/jaathi matrix.",
    challenges:
      "Finger motion is where fake hands give themselves away — the curl had to run joint by joint (knuckle-led, base-to-tip cascade) with the thumb sweeping across the palm. Turn-overs had to be sequenced, not overlapped.",
    learned:
      "Authenticity is choreography: the gestures are the product. Numbers on a grid teach nothing about where the beat lives in the hand.",
    demo: {
      scenarios: [
        {
          label: "what does adi talam look like?",
          steps: ["clap strike", "little, ring, middle fold", "wave: turn over and strike"],
          result: "The hand strikes, folds three fingers in order, then turns palm-over for the drutham — 8 aksharas, in time.",
        },
        {
          label: "longer jaathis?",
          steps: ["misra: 7 counts", "sankeerna: 9 counts"],
          result: "The index and the thumb join the count before wrapping — every jaathi handled.",
        },
      ],
    },
  },
];
