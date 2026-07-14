import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/Seo";
import { ConceptMap3D } from "@/components/playground/ConceptMap3D";
import { Glossary } from "@/components/playground/Glossary";
import { LABS, LAB_CATEGORIES, type LabCategory } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

import { PromptAnatomy } from "@/components/playground/labs/PromptAnatomy";
import { PromptPatterns } from "@/components/playground/labs/PromptPatterns";
import { RagPipeline } from "@/components/playground/labs/RagPipeline";
import { VectorSpace3D } from "@/components/playground/labs/VectorSpace3D";
import { McpExplorer } from "@/components/playground/labs/McpExplorer";
import { A2ARouter } from "@/components/playground/labs/A2ARouter";
import { A2UIRenderer } from "@/components/playground/labs/A2UIRenderer";
import { LangGraphStateMachine } from "@/components/playground/labs/LangGraphStateMachine";
import { LangChainComposer } from "@/components/playground/labs/LangChainComposer";
import { ToolUseSandbox } from "@/components/playground/labs/ToolUseSandbox";
import { VectorDB } from "@/components/playground/labs/VectorDB";
import { ModelGraphs } from "@/components/playground/labs/ModelGraphs";
import { Transformer } from "@/components/playground/labs/Transformer";
import { Classification } from "@/components/playground/labs/Classification";
import { Metrics } from "@/components/playground/labs/Metrics";
import { EvalSystem } from "@/components/playground/labs/EvalSystem";
import { ResponsibleAI } from "@/components/playground/labs/ResponsibleAI";
import { Guardrails } from "@/components/playground/labs/Guardrails";
import { Hooks } from "@/components/playground/labs/Hooks";
import { Hallucination } from "@/components/playground/labs/Hallucination";
import { MiniTerminal } from "@/components/playground/labs/MiniTerminal";
import { VectorSimilarity } from "@/components/playground/labs/VectorSimilarity";
import { AgentBuilder } from "@/components/playground/labs/AgentBuilder";
import { MultiModelVsAgent } from "@/components/playground/labs/MultiModelVsAgent";
import { PromptInjection } from "@/components/playground/labs/PromptInjection";
import { ClaudeSkills } from "@/components/playground/labs/ClaudeSkills";
import { ClaudeGoal } from "@/components/playground/labs/ClaudeGoal";
import { GPTLive } from "@/components/playground/labs/GPTLive";

const RENDERERS: Record<string, () => JSX.Element> = {
  "prompt-anatomy": PromptAnatomy,
  "prompt-patterns": PromptPatterns,
  "rag-pipeline": RagPipeline,
  "vector-space": VectorSpace3D,
  "mcp-explorer": McpExplorer,
  "a2a-router": A2ARouter,
  "a2ui-renderer": A2UIRenderer,
  "langgraph": LangGraphStateMachine,
  "langchain-composer": LangChainComposer,
  "tool-use": ToolUseSandbox,
  "vector-db": VectorDB,
  "model-graphs": ModelGraphs,
  "transformer": Transformer,
  "classification": Classification,
  "metrics": Metrics,
  "eval-system": EvalSystem,
  "responsible-ai": ResponsibleAI,
  "guardrails": Guardrails,
  "hooks": Hooks,
  "hallucination": Hallucination,
  "mini-terminal": MiniTerminal,
  "vector-similarity": VectorSimilarity,
  "agent-builder": AgentBuilder,
  "multi-model-vs-multi-agent": MultiModelVsAgent,
  "prompt-injection": PromptInjection,
  "claude-skills": ClaudeSkills,
  "claude-goal": ClaudeGoal,
  "gpt-live": GPTLive,
};


const PlaygroundPage = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<LabCategory | "All">("All");

  const visible = useMemo(
    () => LABS.filter((l) => filter === "All" || l.category === filter),
    [filter]
  );

  return (
    <div className="pt-24">
      <Seo
        title={t("seo.playground.title")}
        description={t("seo.playground.description")}
        path="/playground"
      />

      {/* Hero */}
      <section className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
            /ai-engineering-lab
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Twenty-eight labs. One stack. <span className="text-primary">Try it live.</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Interactive playgrounds for prompt engineering, RAG, MCP, A2A, A2UI,
            LangChain, LangGraph, and tool-use across Claude, ChatGPT, and Cowork.
            No accounts. No keys. Just the moving parts, exposed.
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {LABS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
              >
                {l.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Concept map */}
      <section className="container mx-auto px-4 mt-14">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 pt-4 pb-2 flex items-baseline gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-primary">
              /concept-map
            </span>
            <span className="text-xs text-muted-foreground">
              The AI stack as a rotating sphere. Click a node to trace its links.
            </span>
          </div>
          <ConceptMap3D />
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 mt-12">
        <div className="flex flex-wrap gap-2">
          {(["All", ...LAB_CATEGORIES] as (LabCategory | "All")[]).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "text-xs font-mono px-3 py-1.5 rounded-full border transition-colors",
                filter === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Labs — masonry via CSS columns */}
      <section className="container mx-auto px-4 mt-6 pb-16">
        <div className="columns-1 lg:columns-2 gap-5 [column-fill:_balance]">
          {visible.map((lab) => {
            const R = RENDERERS[lab.id];
            if (!R) return null;
            return (
              <div
                key={lab.id}
                id={lab.id}
                className="mb-5 break-inside-avoid scroll-mt-28"
              >
                <R />
              </div>
            );
          })}
        </div>
      </section>

      {/* Glossary */}
      <section className="container mx-auto px-4 pb-24">
        <Glossary />
      </section>
    </div>
  );
};

export default PlaygroundPage;
