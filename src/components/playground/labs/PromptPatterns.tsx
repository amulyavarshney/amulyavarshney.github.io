import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

type Pattern = {
  id: string;
  name: string;
  template: string;
  when: string;
  cost: string;
  tree?: string[][];
};

const PATTERNS: Pattern[] = [
  {
    id: "zero",
    name: "Zero-shot",
    template: "Instruction → Answer",
    when: "Simple, well-known tasks",
    cost: "1×",
    tree: [["ask"], ["answer"]],
  },
  {
    id: "few",
    name: "Few-shot",
    template: "Instruction + Examples → Answer",
    when: "Format-sensitive tasks",
    cost: "1×",
    tree: [["ask"], ["examples"], ["answer"]],
  },
  {
    id: "cot",
    name: "Chain-of-Thought",
    template: "Instruction + \"think step by step\" → Reasoning + Answer",
    when: "Multi-step logic, math, planning",
    cost: "~2×",
    tree: [["ask"], ["step 1"], ["step 2"], ["step 3"], ["answer"]],
  },
  {
    id: "react",
    name: "ReAct",
    template: "Thought → Action → Observation → ...",
    when: "Anything with tools",
    cost: "N tool calls",
    tree: [["thought"], ["action"], ["observe"], ["thought"], ["answer"]],
  },
  {
    id: "sc",
    name: "Self-Consistency",
    template: "Sample N CoT paths → Majority vote",
    when: "Ambiguous math/reasoning",
    cost: "N×",
    tree: [["ask"], ["path A", "path B", "path C"], ["vote"], ["answer"]],
  },
  {
    id: "tot",
    name: "Tree-of-Thought",
    template: "Branch, evaluate, prune, expand",
    when: "Search-shaped problems",
    cost: "large",
    tree: [["root"], ["branch 1", "branch 2", "branch 3"], ["expand 1a", "expand 2a"], ["best"]],
  },
];

export const PromptPatterns = () => {
  const [sel, setSel] = useState(PATTERNS[2].id);
  const p = PATTERNS.find((x) => x.id === sel)!;

  return (
    <LabShell meta={LABS[1]} onReset={() => setSel(PATTERNS[2].id)}>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {PATTERNS.map((x) => (
          <button
            key={x.id}
            onClick={() => setSel(x.id)}
            className={cn(
              "text-xs font-mono px-2.5 py-1 rounded-full border transition-colors",
              sel === x.id
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-2 text-xs">
          <div className="rounded-lg bg-muted/40 p-3 font-mono">
            <div className="text-[10px] uppercase text-primary tracking-widest">template</div>
            <div className="mt-1 text-foreground/90">{p.template}</div>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <div className="text-[10px] uppercase text-muted-foreground tracking-widest">when</div>
            <div className="mt-1">{p.when}</div>
          </div>
          <div className="rounded-lg border border-border/60 p-3">
            <div className="text-[10px] uppercase text-muted-foreground tracking-widest">cost vs. baseline</div>
            <div className="mt-1 font-mono">{p.cost}</div>
          </div>
        </div>

        <div className="rounded-lg bg-background/50 border border-border/60 p-4 relative overflow-hidden min-h-[220px]">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            reasoning trace
          </div>
          <div className="space-y-3">
            {p.tree?.map((row, i) => (
              <div key={i} className="flex items-center justify-center gap-2 flex-wrap">
                {row.map((cell, j) => (
                  <div
                    key={j}
                    className="px-3 py-1.5 rounded-md text-xs font-mono glass"
                    style={{
                      animation: `fade-in 400ms ${i * 120}ms both`,
                    }}
                  >
                    {cell}
                  </div>
                ))}
                {i < (p.tree?.length ?? 0) - 1 && (
                  <div className="w-full flex justify-center text-primary/60 -my-1">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LabShell>
  );
};
