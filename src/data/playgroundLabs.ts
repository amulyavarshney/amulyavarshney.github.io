export type LabCategory =
  | "Prompting"
  | "Retrieval"
  | "Protocols"
  | "Frameworks"
  | "Tools"
  | "Concepts"
  | "Evaluation"
  | "Safety";

export type LabMeta = {
  id: string;
  title: string;
  oneLiner: string;
  category: LabCategory;
  tags: string[];
  learn: string[];
};

export const LAB_CATEGORIES: LabCategory[] = [
  "Prompting",
  "Retrieval",
  "Protocols",
  "Frameworks",
  "Tools",
  "Concepts",
  "Evaluation",
  "Safety",
];


export const LABS: LabMeta[] = [
  {
    id: "prompt-anatomy",
    title: "Prompt Anatomy",
    oneLiner: "Toggle the parts of a strong prompt and watch the output shift.",
    category: "Prompting",
    tags: ["system", "few-shot", "constraints"],
    learn: [
      "The six roles a production prompt plays",
      "Why order of sections matters",
      "How constraints shape output format",
    ],
  },
  {
    id: "prompt-patterns",
    title: "Prompt Patterns",
    oneLiner: "Zero-shot, CoT, ReAct, Self-Consistency, Tree-of-Thought.",
    category: "Prompting",
    tags: ["CoT", "ReAct", "ToT"],
    learn: [
      "When each pattern earns its cost",
      "Reasoning traces visualized as trees",
      "Failure modes per pattern",
    ],
  },
  {
    id: "rag-pipeline",
    title: "RAG Pipeline",
    oneLiner: "Chunk → embed → index → retrieve → rerank → generate.",
    category: "Retrieval",
    tags: ["chunking", "top-k", "rerank"],
    learn: [
      "How chunk size changes recall",
      "Why rerankers exist",
      "Where hallucinations sneak in",
    ],
  },
  {
    id: "vector-space",
    title: "Vector Space 3D",
    oneLiner: "80 embeddings in a rotating 3D space. Search snaps to neighbors.",
    category: "Retrieval",
    tags: ["embeddings", "cosine", "kNN"],
    learn: [
      "Why similar meaning clusters",
      "Cosine vs. Euclidean intuition",
      "How ANN indexes trade recall for speed",
    ],
  },
  {
    id: "mcp-explorer",
    title: "MCP Server Explorer",
    oneLiner: "Simulated Model Context Protocol client and JSON-RPC wire log.",
    category: "Protocols",
    tags: ["MCP", "JSON-RPC", "tools/list"],
    learn: [
      "The MCP handshake",
      "tools/list and tools/call framing",
      "Why MCP separates server from client",
    ],
  },
  {
    id: "a2a-router",
    title: "A2A Message Router",
    oneLiner: "Agent-to-agent envelopes flying between Planner, Researcher, Writer.",
    category: "Protocols",
    tags: ["A2A", "task.send", "artifact"],
    learn: [
      "A2A frame shape",
      "Roles vs. skills",
      "How artifacts pass between agents",
    ],
  },
  {
    id: "a2ui-renderer",
    title: "A2UI Renderer",
    oneLiner: "Agents return UI, not just text. Edit the spec, see it render.",
    category: "Protocols",
    tags: ["A2UI", "generative UI"],
    learn: [
      "The spec-to-component contract",
      "Widget primitives you actually need",
      "Where server-driven UI shines",
    ],
  },
  {
    id: "langgraph",
    title: "LangGraph State Machine",
    oneLiner: "Step through a router → tool → retrieve → generate → critic loop.",
    category: "Frameworks",
    tags: ["state", "edges", "cycles"],
    learn: [
      "Nodes as pure functions of state",
      "Conditional edges",
      "Why cycles are a feature, not a bug",
    ],
  },
  {
    id: "langchain-composer",
    title: "LangChain LCEL Composer",
    oneLiner: "Drop runnables on a pipe. Get the LCEL code below in real time.",
    category: "Frameworks",
    tags: ["LCEL", "Runnable", "parallel"],
    learn: [
      "The pipe operator mental model",
      "Parallel vs. sequential runnables",
      "Where LCEL beats plain Python",
    ],
  },
  {
    id: "tool-use",
    title: "Tool-Use Sandbox",
    oneLiner: "Same task, three providers: Claude Tools, ChatGPT Apps, Cowork.",
    category: "Tools",
    tags: ["function-calling", "Claude", "ChatGPT", "Cowork"],
    learn: [
      "Schema differences per provider",
      "How the model actually decides to call",
      "Multi-agent tool sharing",
    ],
  },
  {
    id: "vector-db",
    title: "Vector DB Embedding",
    oneLiner: "Watch a document turn into chunks, vectors, and DB rows.",
    category: "Retrieval",
    tags: ["pgvector", "qdrant", "HNSW"],
    learn: [
      "How text becomes a row in a vector DB",
      "Index types: flat, IVF, HNSW",
      "Metadata filters vs. pure similarity",
    ],
  },
  {
    id: "model-graphs",
    title: "Model Graphs",
    oneLiner: "Compare frontier models on speed, reasoning, cost, tokens.",
    category: "Concepts",
    tags: ["benchmarks", "pareto", "$/1M"],
    learn: [
      "The speed × quality × cost triangle",
      "Why context window is a first-class axis",
      "Reading a pareto frontier",
    ],
  },
  {
    id: "transformer",
    title: "Transformer Architecture",
    oneLiner: "Click each block. See tokens flow through attention and FFN.",
    category: "Concepts",
    tags: ["attention", "residual", "layernorm"],
    learn: [
      "What Q, K, V actually do",
      "Why residual streams matter",
      "Where FFNs store 'knowledge'",
    ],
  },
  {
    id: "classification",
    title: "Text Classification",
    oneLiner: "Live sentiment + intent classifier with confidence bars.",
    category: "Concepts",
    tags: ["logits", "softmax", "confidence"],
    learn: [
      "From logits to probabilities",
      "Why 'high confidence' can still be wrong",
      "Threshold tuning trade-offs",
    ],
  },
  {
    id: "metrics",
    title: "AI Metrics Cheatsheet",
    oneLiner: "Interactive confusion matrix with precision, recall, F1, AUC.",
    category: "Evaluation",
    tags: ["precision", "recall", "F1"],
    learn: [
      "Precision vs. recall in one picture",
      "When accuracy lies",
      "Why F1 exists",
    ],
  },
  {
    id: "eval-system",
    title: "LLM Evaluation Harness",
    oneLiner: "Run a mini eval suite: exact-match, rubric, LLM-as-judge.",
    category: "Evaluation",
    tags: ["eval", "judge", "regression"],
    learn: [
      "Why you need offline evals before prod",
      "Rubric scoring vs. binary checks",
      "LLM-as-judge pitfalls",
    ],
  },
  {
    id: "responsible-ai",
    title: "Responsible AI Checklist",
    oneLiner: "Score a use case across fairness, privacy, transparency, safety.",
    category: "Safety",
    tags: ["fairness", "privacy", "accountability"],
    learn: [
      "The five pillars of responsible AI",
      "Where bias sneaks into training data",
      "What 'model card' means in practice",
    ],
  },
  {
    id: "guardrails",
    title: "Guardrails",
    oneLiner: "Send prompts through PII, jailbreak, and topic filters live.",
    category: "Safety",
    tags: ["PII", "jailbreak", "policy"],
    learn: [
      "Input vs. output guardrails",
      "Regex, classifier, and LLM checks",
      "Why layered defense wins",
    ],
  },
  {
    id: "hooks",
    title: "Pre / Post Hooks",
    oneLiner: "Visualize the full request lifecycle around a model call.",
    category: "Safety",
    tags: ["middleware", "policy", "tracing"],
    learn: [
      "Where to redact, cache, and log",
      "Cost of each hook stage",
      "Failure isolation between stages",
    ],
  },
  {
    id: "hallucination",
    title: "Hallucination Lab",
    oneLiner: "Same question, four grounding modes. Watch the truth score shift.",
    category: "Safety",
    tags: ["grounding", "citations", "verification"],
    learn: [
      "Why models confidently make things up",
      "Grounding vs. citing vs. verifying",
      "How RAG reduces (not removes) hallucination",
    ],
  },
  {
    id: "mini-terminal",
    title: "Mini Terminal",
    oneLiner: "A tiny zsh-flavored shell. Type help to see what it knows.",
    category: "Tools",
    tags: ["cli", "repl", "sandbox"],
    learn: [
      "Why CLIs are still the fastest UI for agents",
      "Command parsing and stateful REPL loops",
      "How to keep a shell sandbox safe",
    ],
  },
  {
    id: "vector-similarity",
    title: "Vector Similarity",
    oneLiner: "Type two sentences. See cosine, dot product, and Euclidean live.",
    category: "Retrieval",
    tags: ["cosine", "dot", "euclidean"],
    learn: [
      "Why cosine dominates for text search",
      "When dot product beats cosine",
      "How normalization changes the math",
    ],
  },
  {
    id: "agent-builder",
    title: "Agent Builder",
    oneLiner: "Compose role, tools, memory, and guardrails. Run a mock task.",
    category: "Frameworks",
    tags: ["planner", "tools", "memory"],
    learn: [
      "The four moving parts of an agent",
      "Where memory belongs (and doesn't)",
      "Why tool choice is the hardest step",
    ],
  },
  {
    id: "multi-model-vs-multi-agent",
    title: "Multi-Model vs Multi-Agent",
    oneLiner: "Same task, two shapes. Watch cost, latency, and quality diverge.",
    category: "Concepts",
    tags: ["orchestration", "cost", "latency"],
    learn: [
      "When routing across models beats a single call",
      "Why multi-agent adds coordination overhead",
      "How to decide between the two patterns",
    ],
  },
  {
    id: "prompt-injection",
    title: "Prompt Injection Lab",
    oneLiner: "Try direct, indirect, and tool-based injections against a mock agent.",
    category: "Safety",
    tags: ["injection", "jailbreak", "OWASP LLM01"],
    learn: [
      "The three injection surfaces (input, docs, tools)",
      "Why 'ignore previous instructions' still works",
      "Layered defenses that actually help",
    ],
  },
  {
    id: "claude-skills",
    title: "Claude Skills",
    oneLiner: "Preview a Skill's manifest, resources, and load-on-demand behavior.",
    category: "Tools",
    tags: ["Claude", "skills", "manifest"],
    learn: [
      "What a Skill is vs. a tool",
      "Progressive disclosure via SKILL.md",
      "When to ship a Skill vs. a system prompt",
    ],
  },
  {
    id: "claude-goal",
    title: "Claude Goal Loop",
    oneLiner: "Set a goal. Watch the agent plan, act, reflect, and stop.",
    category: "Frameworks",
    tags: ["Claude", "agent SDK", "loop"],
    learn: [
      "Goal → plan → act → reflect cycle",
      "How termination conditions get set",
      "Why explicit stop criteria beat token limits",
    ],
  },
  {
    id: "gpt-live",
    title: "GPT Live Session",
    oneLiner: "Simulated realtime session: audio in, tokens out, tool calls midstream.",
    category: "Protocols",
    tags: ["realtime", "streaming", "voice"],
    learn: [
      "The realtime API event shape",
      "Barge-in and turn detection",
      "Where to inject tool calls mid-stream",
    ],
  },
];

