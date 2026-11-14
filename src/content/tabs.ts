export type TabDef = {
  id: string;
  title: string;
  curiosityLocked?: boolean;
  body: string;
  action?: { label: string; openApp: string };
};

export const baseTabs: TabDef[] = [
  { id: "t1", title: "why is this tab open", body: "honest answer: it was open 40 minutes ago, and closing it felt like admitting something." },
  { id: "t2", title: "stack overflow — answered 2019", body: "the answer is deprecated, the question isn't, and i refuse to let go." },
  { id: "t3", title: "docs: embeddings", body: "read 4 times. understood 0.4 times. keeping it open until it clicks." },
  {
    id: "t4",
    title: "rag_chatbot — source",
    body: "the streaming RAG chatbot with citations. it actually works. wanna see?",
    action: { label: "open the rag_chatbot project", openApp: "experiments" },
  },
  {
    id: "t5",
    title: "doc_processing — the pipeline",
    body: "the danish price-list pipeline. 200+ pages per document, three trades, one very tired PDF renderer.",
    action: { label: "open the doc_processing project", openApp: "experiments" },
  },
  { id: "t6", title: "gh: notifications (9)", body: "nine notifications. one is a bot i wrote reviewing my own code. it had opinions." },
  { id: "t7", title: "restaurant near me", body: "research phase of the mukbang lifestyle. strictly academic." },
  { id: "t8", title: "saxophone fingering chart", body: "late-night practice reference. the neighbours said 'brave'." },
  { id: "t9", title: "pexels — unsplash alternatives", body: "for a portfolio that describes itself as a website inside a website." },
];

export const curiosityTabs: TabDef[] = [
  { id: "c1", title: "+ does the model know that?", body: "probing LLM confidence vs accuracy. results: confidently both." },
  { id: "c2", title: "+ arxiv: knowledge graphs", body: "14 open papers. read: 2.5. the half one counts." },
  { id: "c3", title: "+ the estimate canvas bug", body: "a calculation that rounds differently at 2am. unfixed. unfixable? watch me." },
];

export const hiddenTab: TabDef = {
  id: "hidden",
  title: "the_tab_i_never_close",
  body: "you found it. this tab has been open since 2021. it contains: nothing. it contains everything.",
};

export const TAB_FOOTER = "showing 12 of 37 tabs — the rest are load-bearing.";
