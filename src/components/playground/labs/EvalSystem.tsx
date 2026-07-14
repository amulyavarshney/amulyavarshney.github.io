import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type Row = {
  q: string;
  expected: string;
  actual: string;
  exact: boolean;
  rubric: number; // 0-1
  judge: "pass" | "fail" | "borderline";
};

const CASES: Row[] = [
  { q: "FUTA rate in 2025?", expected: "6% on first $7,000", actual: "6% on the first $7,000 [26 U.S.C. §3301]", exact: false, rubric: 0.95, judge: "pass" },
  { q: "FICA cap in 2025?", expected: "$168,600", actual: "$168,600", exact: true, rubric: 1, judge: "pass" },
  { q: "W-2 filing deadline?", expected: "Jan 31", actual: "January 31st of each year", exact: false, rubric: 0.9, judge: "pass" },
  { q: "1099-NEC threshold?", expected: "$600", actual: "usually a few hundred dollars", exact: false, rubric: 0.35, judge: "fail" },
  { q: "State w/h in TX?", expected: "None", actual: "Texas has no state income tax", exact: false, rubric: 0.85, judge: "pass" },
];

export const EvalSystem = () => {
  const [i, setI] = useState(-1);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setI(-1);
    for (let k = 0; k < CASES.length; k++) {
      await new Promise((r) => setTimeout(r, 380));
      setI(k);
    }
    setRunning(false);
  };

  const scored = i >= 0 ? CASES.slice(0, i + 1) : [];
  const rubricAvg = scored.length ? scored.reduce((s, r) => s + r.rubric, 0) / scored.length : 0;
  const passRate = scored.length ? scored.filter((r) => r.judge === "pass").length / scored.length : 0;

  return (
    <LabShell meta={LABS.find((l) => l.id === "eval-system")!} onReset={() => { setI(-1); setRunning(false); }}>
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={run}
          disabled={running}
          className="font-mono text-xs px-3 py-1 rounded bg-primary text-primary-foreground disabled:opacity-60 inline-flex items-center gap-1.5"
        >
          {running ? <Loader2 className="w-3 h-3 animate-spin" /> : "▶"} Run eval suite
        </button>
        <div className="ml-auto flex gap-3 text-[11px] font-mono">
          <span>rubric avg <span className="text-primary">{rubricAvg.toFixed(2)}</span></span>
          <span>pass <span className="text-primary">{(passRate * 100).toFixed(0)}%</span></span>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/60 overflow-hidden font-mono text-[11px]">
        <div className="grid grid-cols-[1fr_60px_60px_60px] px-3 py-1.5 bg-muted/40 uppercase tracking-widest text-[9px] text-muted-foreground">
          <span>case</span><span>exact</span><span>rubric</span><span>judge</span>
        </div>
        {CASES.map((c, k) => {
          const done = k <= i;
          return (
            <div
              key={k}
              className={cn(
                "grid grid-cols-[1fr_60px_60px_60px] px-3 py-2 border-t border-border/40 items-center transition-opacity",
                !done && "opacity-30"
              )}
            >
              <div>
                <div className="text-foreground">{c.q}</div>
                <div className="text-muted-foreground text-[10px] truncate">→ {c.actual}</div>
              </div>
              <span>{c.exact ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground" />}</span>
              <span className={c.rubric >= 0.7 ? "text-primary" : "text-destructive"}>{c.rubric.toFixed(2)}</span>
              <span className={
                c.judge === "pass" ? "text-primary" :
                c.judge === "fail" ? "text-destructive" : "text-muted-foreground"
              }>{c.judge}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground">
        Three graders side-by-side: <span className="text-primary">exact-match</span> (strict), <span className="text-primary">rubric</span> (0-1 similarity), <span className="text-primary">LLM-as-judge</span> (pass/borderline/fail).
      </div>
    </LabShell>
  );
};
