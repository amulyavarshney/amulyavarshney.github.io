import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

type Mode = "none" | "rag" | "cited" | "verified";

const QUESTION = "What is the 2025 FUTA rate on the first taxable wages?";

const OUTPUTS: Record<Mode, { text: string; sources: string[]; truth: number; note: string }> = {
  none: {
    text: "FUTA is around 5.4% federally in 2025, applied to the first $8,000 of wages per worker.",
    sources: [],
    truth: 0.2,
    note: "Model guesses. Rate and cap are both wrong.",
  },
  rag: {
    text: "FUTA is 6.0% in 2025, applied to the first $7,000 of each employee's wages.",
    sources: ["kb://irs-pub-15.md#futa"],
    truth: 0.75,
    note: "Retrieved passage, no inline citation. Correct but unverifiable to reader.",
  },
  cited: {
    text: "FUTA is 6.0% [1] on the first $7,000 of each employee's wages [1].",
    sources: ["IRS Publication 15 (2025), §Federal Unemployment Tax"],
    truth: 0.9,
    note: "Inline citations tie each claim to a source. Reader can check.",
  },
  verified: {
    text: "FUTA is 6.0% [1] on the first $7,000 of each employee's wages [1].",
    sources: ["IRS Publication 15 (2025), §Federal Unemployment Tax  ✓ verified"],
    truth: 0.98,
    note: "Post-hook re-fetches source and confirms each numeric claim appears verbatim.",
  },
};

export const Hallucination = () => {
  const [m, setM] = useState<Mode>("none");
  const o = OUTPUTS[m];

  return (
    <LabShell meta={LABS.find((l) => l.id === "hallucination")!} onReset={() => setM("none")}>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(Object.keys(OUTPUTS) as Mode[]).map((k) => (
          <button
            key={k}
            onClick={() => setM(k)}
            className={cn(
              "font-mono text-xs px-3 py-1 rounded-md border transition-colors",
              m === k ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {k === "none" ? "no grounding" : k}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border/60 bg-background/60 p-3 text-sm">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">question</div>
        <div className="font-mono text-xs text-foreground/90 mb-3">{QUESTION}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">answer</div>
        <p className="animate-fade-in">{o.text}</p>
        {o.sources.length > 0 && (
          <ul className="text-[11px] text-muted-foreground mt-2 space-y-0.5">
            {o.sources.map((s, i) => <li key={i}><span className="text-primary">[{i + 1}]</span> {s}</li>)}
          </ul>
        )}
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[11px] font-mono mb-1">
          <span className="text-muted-foreground">truthfulness score</span>
          <span className={o.truth >= 0.8 ? "text-primary" : o.truth >= 0.5 ? "text-foreground" : "text-destructive"}>
            {(o.truth * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-2 rounded bg-muted overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${o.truth * 100}%`,
              background: o.truth >= 0.8 ? "hsl(var(--primary))" : o.truth >= 0.5 ? "hsl(24 96% 60%)" : "hsl(var(--destructive))",
            }}
          />
        </div>
        <div className="text-[11px] text-muted-foreground mt-2">{o.note}</div>
      </div>
    </LabShell>
  );
};
