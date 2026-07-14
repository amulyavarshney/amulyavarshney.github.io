// Long-form case studies for featured projects.
// Kept in one place for easy editing; page renders from this data.

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  period: string;
  stack: string[];
  problem: string;
  approach: string[];
  architecture: { title: string; description: string }[];
  metrics: { label: string; value: string; sub?: string }[];
  learnings: string[];
  links?: { label: string; href: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "payroll-intelligence-agent",
    title: "Payroll Intelligence Agent",
    tagline:
      "Multi-agent copilot for enterprise payroll. Routes, resolves, and evaluates queries with full LLM traceability.",
    role: "Software Engineer 2 — Applied AI, Intuit",
    period: "2025 — Present",
    stack: [
      "LangGraph",
      "Python",
      "FastAPI",
      "Langfuse",
      "PostgreSQL",
      "RAG",
      "LLMOps",
    ],
    problem:
      "Support agents were drowning in long-tail payroll questions. Each one needed policy docs, tax rules, and per-tenant configuration stitched together. A single-prompt LLM hallucinated on edge cases and left us with no way to reproduce, evaluate, or gate regressions.",
    approach: [
      "Modeled the workflow as a LangGraph state machine: intent routing, skill selection, tool-calling, RAG retrieval, guarded response synthesis.",
      "Added a judge-model eval loop with golden datasets, so every prompt or graph change ships behind a pass/fail gate.",
      "Wired Langfuse traces into every node so on-call engineers can replay a full session end to end.",
      "Introduced tenant-scoped embeddings and hybrid retrieval so answers stay grounded in the caller's own configuration.",
    ],
    architecture: [
      {
        title: "Router node",
        description:
          "Classifies intent and urgency, picks one of N skills, and falls back to a general-QA agent when confidence is low.",
      },
      {
        title: "Skill agents",
        description:
          "Isolated LangGraph subgraphs per capability (payroll runs, tax, compliance) with their own tools and prompts.",
      },
      {
        title: "RAG layer",
        description:
          "Hybrid BM25 plus dense retrieval over a versioned policy corpus, with per-tenant filters and re-ranking.",
      },
      {
        title: "Eval and trace",
        description:
          "Langfuse for tracing. Nightly regression suite runs judge models against golden turns and blocks bad prompts at PR time.",
      },
    ],
    metrics: [
      { label: "Median latency", value: "-38%", sub: "vs. single-prompt baseline" },
      { label: "Answer accuracy", value: "+22%", sub: "on golden eval set" },
      { label: "Trace coverage", value: "100%", sub: "every turn replayable" },
      { label: "Regression gate", value: "PR-blocking", sub: "nightly and on demand" },
    ],
    learnings: [
      "Evals are a product feature. You can't ship agent changes safely without a judged, versioned dataset.",
      "Small, well-scoped skill graphs beat one god-graph. Routing errors are cheaper to fix than tangled state.",
      "Tracing has to be zero-config for developers. Otherwise it silently rots.",
    ],
  },
  {
    slug: "ray-fintech-concierge",
    title: "Ray — Fintech AI Concierge",
    tagline:
      "LLM-powered merchant support that turns hours-long tickets into second-level answers.",
    role: "Software Development Engineer, Razorpay",
    period: "2024 — 2025",
    stack: ["Python", "FastAPI", "LangGraph", "Golang", "LLMs", "Multi-Agent"],
    problem:
      "Merchant support was slow, expensive, and inconsistent. Tickets needed context from payments data, product docs, and prior conversations. Humans context-switched constantly and SLAs slipped during peak load.",
    approach: [
      "Built Ray as a multi-agent concierge. An orchestrator delegates to specialist agents for payments, disputes, KYC, and product Q&A.",
      "Shipped a Go eval engine that runs prompt suites on every merge, tracking accuracy, refusal rate, and cost per resolution.",
      "Added context-aware ticket resolution with dynamic priority scoring so urgent cases jump the queue automatically.",
      "Rolled out gradually behind feature flags, with human-in-the-loop review before full automation.",
    ],
    architecture: [
      {
        title: "Orchestrator",
        description:
          "LangGraph supervisor that plans, dispatches to specialist agents, and merges their outputs before responding.",
      },
      {
        title: "Specialist agents",
        description:
          "Independent Python services with tightly-scoped tools (payment lookup, refund, KYC status). Each one evaluated on its own.",
      },
      {
        title: "Eval engine (Go)",
        description:
          "Concurrent prompt runner with judge models and rule checks. Posts diff reports on every PR.",
      },
      {
        title: "Priority scorer",
        description:
          "Signals from ticket content and merchant tier feed a scoring function that reorders the queue in real time.",
      },
    ],
    metrics: [
      { label: "First response", value: "hours → seconds", sub: "on auto-resolved tickets" },
      { label: "Auto-resolution", value: "large share", sub: "of common workflows" },
      { label: "Eval throughput", value: "10x faster", sub: "vs. sequential Python runner" },
      { label: "Rollout safety", value: "flag-gated", sub: "human in the loop" },
    ],
    learnings: [
      "Concurrency matters for evals. A fast Go runner unlocks daily prompt iteration.",
      "Specialist agents with narrow tools are easier to trust and roll back than one broad agent.",
      "Priority scoring is a product lever, not just an engineering one. It directly shapes merchant experience.",
    ],
  },
];

export const caseStudySlugs = caseStudies.map((c) => c.slug);
