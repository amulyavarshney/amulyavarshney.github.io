import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { Play, Target } from "lucide-react";

const META = LABS.find((l) => l.id === "claude-goal")!;

type Frame = { phase: "plan" | "act" | "observe" | "reflect" | "stop"; text: string };

const GOALS: Record<string, Frame[]> = {
  "Book a flight from NYC to Tokyo under $900": [
    { phase: "plan", text: "Break goal: search flights → filter <$900 → confirm dates → book." },
    { phase: "act", text: "flights.search({ origin: 'NYC', dest: 'HND', maxPrice: 900 })" },
    { phase: "observe", text: "3 candidates returned. Best: ANA $842, 14h, 1 stop." },
    { phase: "reflect", text: "Meets budget. Confirm layover with user before booking." },
    { phase: "act", text: "user.confirm('ANA $842, HND, 14h layover in ICN?')" },
    { phase: "observe", text: "user replied YES." },
    { phase: "act", text: "flights.book('ANA-5731')" },
    { phase: "stop", text: "Goal met. Booking ref ABC123 sent." },
  ],
  "Draft a launch tweet and a 100-word post": [
    { phase: "plan", text: "Draft tweet → draft post → self-review for voice → return both." },
    { phase: "act", text: "draft.tweet({ topic: 'launch' })" },
    { phase: "observe", text: "Tweet v1 uses passive voice." },
    { phase: "reflect", text: "House voice is active. Rewrite." },
    { phase: "act", text: "draft.tweet.revise({ tone: 'active' })" },
    { phase: "observe", text: "Tweet v2 approved." },
    { phase: "act", text: "draft.post({ length: 100 })" },
    { phase: "stop", text: "Both drafts ready. Returning." },
  ],
  "Fix the failing checkout test": [
    { phase: "plan", text: "Read failing test → reproduce → locate bug → patch → rerun." },
    { phase: "act", text: "tests.run('checkout.spec.ts')" },
    { phase: "observe", text: "Assertion fails on tax rounding at line 42." },
    { phase: "reflect", text: "Likely floating point in cents. Use integer math." },
    { phase: "act", text: "code.patch('cart.ts', diff)" },
    { phase: "act", text: "tests.run('checkout.spec.ts')" },
    { phase: "observe", text: "12/12 passing." },
    { phase: "stop", text: "Goal met. PR opened." },
  ],
};

const COLOR: Record<Frame["phase"], string> = {
  plan: "text-primary",
  act: "text-foreground",
  observe: "text-muted-foreground",
  reflect: "text-amber-500",
  stop: "text-emerald-500",
};

export const ClaudeGoal = () => {
  const goals = Object.keys(GOALS);
  const [goal, setGoal] = useState(goals[0]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setFrames([]);
    for (const f of GOALS[goal]) {
      await new Promise((r) => setTimeout(r, 350));
      setFrames((cur) => [...cur, f]);
    }
    setRunning(false);
  };

  return (
    <LabShell meta={META} onReset={() => setFrames([])}>
      <div className="flex flex-wrap items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <select
          value={goal}
          onChange={(e) => { setGoal(e.target.value); setFrames([]); }}
          className="flex-1 min-w-[200px] text-xs font-mono rounded-md border border-border/60 bg-background/70 px-2 py-1.5"
        >
          {goals.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <button
          onClick={run}
          disabled={running}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-mono disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" /> {running ? "Looping…" : "Start loop"}
        </button>
      </div>

      <div className="mt-3 rounded-lg border border-border/60 bg-background/70 p-3 font-mono text-[11px] min-h-[240px] max-h-[340px] overflow-y-auto space-y-1">
        {frames.length === 0 && <div className="text-muted-foreground">idle — set a goal, press Start.</div>}
        {frames.map((f, i) => (
          <div key={i} className="flex gap-2">
            <span className={"w-16 shrink-0 uppercase " + COLOR[f.phase]}>{f.phase}</span>
            <span className="whitespace-pre-wrap">{f.text}</span>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-muted-foreground">
        Loop halts on <span className="text-emerald-500">stop</span>. No max-step cap needed when reflection is explicit.
      </div>
    </LabShell>
  );
};
