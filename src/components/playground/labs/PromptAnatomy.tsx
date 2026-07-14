import { useMemo, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "system", label: "System", hue: "199 89% 55%", text: "You are a senior payroll assistant. Reply in tight, cited bullets." },
  { id: "role", label: "Role", hue: "262 83% 65%", text: "The user is an HR admin who trusts numbers over prose." },
  { id: "few", label: "Few-shot", hue: "168 76% 50%", text: "Q: FICA cap 2025? A: $168,600 [src:irs.gov/pub-15]" },
  { id: "task", label: "Instruction", hue: "24 96% 60%", text: "Explain the 2025 Social Security wage base change." },
  { id: "cons", label: "Constraints", hue: "330 80% 65%", text: "≤ 80 words. Cite every number. No hedging." },
  { id: "fmt", label: "Format", hue: "187 92% 60%", text: "Return JSON: { answer, citations[] }" },
];

export const PromptAnatomy = () => {
  const [on, setOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECTIONS.map((s) => [s.id, true]))
  );

  const mock = useMemo(() => {
    const parts: string[] = [];
    if (on.system && on.role) parts.push("Precise, admin-tone answer.");
    else if (on.system) parts.push("Generic assistant answer.");
    if (on.few) parts.push("Cited numbers included.");
    else parts.push("Numbers cited only sometimes.");
    if (on.cons) parts.push("Under 80 words. No hedging.");
    else parts.push("May ramble. Hedges appear.");
    if (on.fmt) parts.push("Structured JSON returned.");
    else parts.push("Free-form paragraph returned.");
    if (!on.task) parts.push("(no task — model asks a clarifying question)");
    return parts.join(" ");
  }, [on]);

  return (
    <LabShell
      meta={LABS[0]}
      onReset={() => setOn(Object.fromEntries(SECTIONS.map((s) => [s.id, true])))}
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setOn((o) => ({ ...o, [s.id]: !o[s.id] }))}
              className={cn(
                "w-full text-left rounded-lg p-2.5 border transition-all text-xs font-mono",
                on[s.id] ? "opacity-100" : "opacity-40"
              )}
              style={{
                borderColor: `hsl(${s.hue} / ${on[s.id] ? 0.6 : 0.2})`,
                background: `hsl(${s.hue} / ${on[s.id] ? 0.08 : 0.02})`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="uppercase tracking-widest" style={{ color: `hsl(${s.hue})` }}>
                  {s.label}
                </span>
                <span className="text-[10px] text-muted-foreground">{on[s.id] ? "on" : "off"}</span>
              </div>
              <div className="text-foreground/80 leading-snug">{s.text}</div>
            </button>
          ))}
        </div>
        <div className="rounded-lg bg-background/60 border border-border/60 p-3 font-mono text-xs space-y-2 min-h-[180px]">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            simulated output
          </div>
          <div className="text-foreground/90 leading-relaxed">{mock}</div>
          <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground">
            {Object.values(on).filter(Boolean).length} / {SECTIONS.length} sections active
          </div>
        </div>
      </div>
    </LabShell>
  );
};
