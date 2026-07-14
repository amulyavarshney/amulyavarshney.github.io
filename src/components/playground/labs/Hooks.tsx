import { useEffect, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

type Stage = { id: string; label: string; kind: "pre" | "model" | "post"; ms: number; note: string };
const STAGES: Stage[] = [
  { id: "auth",     label: "auth",           kind: "pre",   ms: 4,   note: "verify JWT, load user scopes" },
  { id: "quota",    label: "rate-limit",     kind: "pre",   ms: 2,   note: "check per-org quota" },
  { id: "redact",   label: "redact PII",     kind: "pre",   ms: 12,  note: "strip emails, SSNs, cards" },
  { id: "cache",    label: "cache lookup",   kind: "pre",   ms: 6,   note: "semantic hash miss? continue" },
  { id: "guard-in", label: "input guardrail",kind: "pre",   ms: 18,  note: "policy classifier" },
  { id: "model",    label: "LLM call",       kind: "model", ms: 820, note: "GPT-5 · 340 tok out" },
  { id: "guard-out",label: "output guardrail",kind: "post", ms: 15,  note: "toxicity + topic check" },
  { id: "cite",     label: "citation check", kind: "post",  ms: 22,  note: "each claim → source id" },
  { id: "log",      label: "trace + log",    kind: "post",  ms: 5,   note: "OTel span, redacted payload" },
  { id: "respond",  label: "respond",        kind: "post",  ms: 2,   note: "stream to client" },
];

const HUE: Record<Stage["kind"], string> = {
  pre:   "199 89% 55%",
  model: "262 83% 65%",
  post:  "168 76% 50%",
};

export const Hooks = () => {
  const [i, setI] = useState(-1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (i >= STAGES.length - 1) { setPlaying(false); return; }
    const id = setTimeout(() => setI((x) => x + 1), 320);
    return () => clearTimeout(id);
  }, [playing, i]);

  const totalMs = STAGES.reduce((s, x) => s + x.ms, 0);

  return (
    <LabShell meta={LABS.find((l) => l.id === "hooks")!} onReset={() => { setI(-1); setPlaying(false); }}>
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => { setI(0); setPlaying(true); }}
          className="font-mono text-xs px-3 py-1 rounded bg-primary text-primary-foreground"
        >
          ▶ Trace request
        </button>
        <span className="text-[11px] font-mono text-muted-foreground ml-auto">total budget: {totalMs}ms</span>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/50 p-3 space-y-1.5">
        {STAGES.map((s, k) => {
          const active = k === i;
          const done = k <= i;
          const pct = (s.ms / totalMs) * 100;
          return (
            <div key={s.id} className={cn("grid grid-cols-[80px_1fr_60px] gap-2 items-center transition-opacity", !done && "opacity-30")}>
              <span className="text-[10px] font-mono uppercase" style={{ color: `hsl(${HUE[s.kind]})` }}>{s.kind}</span>
              <div>
                <div className="flex justify-between text-xs font-mono">
                  <span className={active ? "text-primary" : "text-foreground/90"}>{s.label}</span>
                  <span className="text-[10px] text-muted-foreground">{s.note}</span>
                </div>
                <div className="h-1 rounded bg-muted mt-1 overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${Math.min(100, pct * 3)}%`, background: `hsl(${HUE[s.kind]})` }} />
                </div>
              </div>
              <span className="text-[10px] font-mono text-right text-muted-foreground">{s.ms}ms</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-mono">
        {(["pre", "model", "post"] as const).map((k) => {
          const ms = STAGES.filter((s) => s.kind === k).reduce((a, b) => a + b.ms, 0);
          return (
            <div key={k} className="rounded-md border border-border/60 p-2 text-center" style={{ background: `hsl(${HUE[k]} / 0.08)` }}>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: `hsl(${HUE[k]})` }}>{k}-hook</div>
              <div className="text-foreground">{ms}ms · {Math.round(ms / totalMs * 100)}%</div>
            </div>
          );
        })}
      </div>
    </LabShell>
  );
};
