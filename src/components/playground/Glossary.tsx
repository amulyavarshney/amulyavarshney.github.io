const TERMS = [
  { k: "LLM", v: "Large Language Model. The core token predictor." },
  { k: "RAG", v: "Retrieval-Augmented Generation. Fetch context, then generate." },
  { k: "MCP", v: "Model Context Protocol. Standard way for models to reach tools." },
  { k: "A2A", v: "Agent-to-Agent. Wire format for agents talking to agents." },
  { k: "A2UI", v: "Agent-to-UI. Agents return renderable UI specs, not just text." },
  { k: "CoT", v: "Chain-of-Thought. Prompt pattern that surfaces intermediate reasoning." },
  { k: "ReAct", v: "Reason + Act. Interleaves thoughts and tool calls." },
  { k: "LCEL", v: "LangChain Expression Language. Pipe-composable runnables." },
  { k: "Cowork", v: "Multi-agent collaboration pattern with shared tool access." },
  { k: "Reranker", v: "Second-pass model that reorders retrieval results." },
];

export const Glossary = () => (
  <div className="glass rounded-2xl p-5 sm:p-6">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-mono uppercase tracking-widest text-primary">/glossary</span>
      <span className="h-px flex-1 bg-border" />
    </div>
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {TERMS.map((t) => (
        <div key={t.k} className="flex gap-3">
          <dt className="font-mono text-sm text-primary min-w-[70px]">{t.k}</dt>
          <dd className="text-sm text-muted-foreground">{t.v}</dd>
        </div>
      ))}
    </dl>
  </div>
);
