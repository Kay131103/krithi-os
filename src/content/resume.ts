export const resume = {
  name: "Krithi U K",
  title: "Applied AI Engineer · Software Developer · Full-Stack Engineering",
  location: "Mangaluru, Karnataka, India",
  email: "krithidps2003@gmail.com",
  phone: "+91 94496 89659",
  github: "https://github.com/Kay131103",
  linkedin: "https://www.linkedin.com/in/krithi-u-k-6076b1163/",
  updated: "2026",
  summary:
    "Applied AI and software developer experienced in building document-intelligence pipelines, LLM-powered workflows and cloud-deployed applications. Combines Python/FastAPI, .NET and modern web development with prompt engineering, data-quality controls, testing and deployment.",
  experience: [
    {
      role: "Junior Software Developer",
      org: "EG India",
      period: "April 2025 – 30 Oct 2026",
      bullets: [
        "AI price-list extraction platform: built a resumable, multi-stage document pipeline that converts Danish construction price lists across three trades — plumbing (VVS), masonry and painting — into structured, reviewable data, covering page rendering and preprocessing, Claude vision extraction on AWS Bedrock, trade-specific prompts, filtering, deduplication, reference resolution and job-stage controls.",
        "Improved extraction quality through grid-row number synthesis, collision handling, cross-reference price resolution and VVS surcharge classification and linking; added per-job Bedrock token and cost tracking.",
        "Authored 85+ pull requests in a codebase with 170+ merged pull requests and 60+ backend test modules.",
        "Developed FastAPI services and PostgreSQL/pgvector integrations, plus Next.js and React workflows for PDF upload, page-level review, row editing, document comparison, rule management and Excel export.",
        "Supported Docker and ECS Fargate deployment, CloudFormation infrastructure and GitHub Actions CI/CD across separate development and production environments.",
        "VVS product-alternative discovery: analysed a highly skewed product dataset to identify viable alternatives across categories, applying Jaccard similarity against a defined threshold and a feedback loop that refined recommendation relevance.",
        "Construction cost-estimation platform: contributed to six product areas — Customer, Library, Company Settings, Tender Import, Estimate Canvas and the calculation interface — including the AI-assisted tender-import workflow for PDF and Excel documents alongside UI/UX and .NET 10 estimation features.",
        "Supported functional testing and debugging within an Angular 21 and .NET 10 platform (5 xUnit test projects, 200+ frontend unit-test files), helping identify and resolve approximately 70 product issues.",
        "Maintained and enhanced a legacy Danish Microsoft Access application, handling ongoing maintenance and bug fixes, and optimised key workflows to reduce processing time from 2–3 minutes to under 10 seconds.",
      ],
    },
    {
      role: "Research Intern",
      org: "National Institute of Technology Karnataka (NITK)",
      period: "January – April 2025",
      bullets: [
        "Research areas: video captioning, knowledge graphs.",
        "Researched video captioning models and the relationship between visual-frame understanding and natural-language description, exploring how generated captions could feed structured knowledge graphs.",
      ],
    },
  ],
  projects: [
    { name: "Real-time voice agent", desc: "Gemini Live voice assistant with WebSocket-based real-time audio streaming and interruption handling (Next.js, TypeScript, FastAPI)." },
    { name: "RAG chatbot", desc: "Retrieval-augmented chatbot with query rewriting, cited and streamed answers, and multi-provider LLM support (LangGraph, ChromaDB, FastAPI)." },
    { name: "PR review agent", desc: "GitHub pull-request review automation combining deterministic checks with optional LLM-generated feedback (Python, GitHub API, Docker)." },
    { name: "Video captioning & knowledge graphs", desc: "NITK research on describing video and structuring the output as searchable, relationship-aware graphs." },
  ],
  education: [
    {
      degree: "Bachelor of Engineering — Computer Science and Engineering",
      school: "NMAM Institute of Technology",
      period: "2021 – 2025 · CGPA 8.93 / 10",
    },
  ],
  skills: {
    Languages: "Python, C#, JavaScript, TypeScript, SQL, Java, C/C++",
    "AI & data": "LLMs, vision-language models, prompt engineering, RAG, embeddings, vector search, document AI, knowledge graphs",
    "Backend & frontend": "FastAPI, ASP.NET Core / .NET 10, REST APIs, Next.js, React, Angular, Tailwind CSS",
    "Cloud & engineering": "AWS Bedrock, ECS Fargate, S3, EC2, Amplify, PostgreSQL, pgvector, Docker, GitHub Actions, CloudFormation, Git",
  },
  certifications: [
    "Google AI Essentials",
    "Google Prompting Essentials",
    "Microsoft Azure AI Essentials",
    "Generative AI: Introduction to Large Language Models",
    "Artificial Intelligence Foundations: Neural Networks",
    "PostgreSQL Essential Training",
    "Introduction to Deep Learning",
  ],
};

export const caseStats = [
  { value: "85+", label: "pull requests authored" },
  { value: "170+", label: "merged PRs in codebase" },
  { value: "60+", label: "backend test modules" },
  { value: "~70", label: "product issues found" },
  { value: "200+", label: "frontend unit-test files" },
  { value: "5", label: "xUnit test projects" },
  { value: "3", label: "trades parsed (VVS/masonry/painting)" },
];
