import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";

const META = LABS.find((l) => l.id === "multi-model-vs-multi-agent")!;

type Mode = "multi-model" | "multi-agent";

const MODELS = [
  { name: "gpt-5-mini", speed: 0.92, quality: 0.72, cost: 0.15 },
  { name: "claude-4-sonnet", speed: 0.78, quality: 0.88, cost: 0.60 },
  { name: "gemini-2-pro", speed: 0.80, quality: 0.84, cost: 0.45 },
];

const AGENTS = ["Planner", "Researcher", "Coder", "Critic"];

export const MultiModelVsAgent = () => {
  const [mode, setMode] = useState<Mode>("multi-model");
  const [difficulty, setDifficulty] = useState(3);

  const routes = mode === "multi-model"
    ? MODELS.map((m) => ({ label: m.name, hops: 1, model: m }))
    : AGENTS.map((a, i) => ({ label: a, hops: i + 1, model: MODELS[i % MODELS.length] }));

  const totalLatencyMs =
    mode === "multi-model"
      ? Math.round(600 + (1 - MODELS[0].speed) * 400 * difficulty)
      : Math.round(AGENTS.length * (500 + difficulty * 180));
  const totalCost =
    mode === "multi-model"
      ? +(MODELS[0].cost * difficulty * 0.5).toFixed(2)
      : +(AGENTS.reduce((s, _, i) => s + MODELS[i % MODELS.length].cost, 0) * difficulty * 0.5).toFixed(2);
  const quality =
    mode === "multi-model"
      ? Math.min(0.99, 0.60 + difficulty * 0.05)
      : Math.min(0.99, 0.72 + difficulty * 0.06);

  return (
    <LabShell meta={META} onReset={() => { setMode("multi-model"); setDifficulty(3); }}>
      <div className="flex flex-wrap items-center gap-2">
        {(["multi-model", "multi-agent"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={
              "text-xs font-mono px-3 py-1.5 rounded-full border transition-colors " +
              (mode === m
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground")
            }
          >
            {m}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground">difficulty</span>
          <input
            type="range"
            min={1}
            max={5}
            value={difficulty}
            onChange={(e) => setDifficulty(+e.target.value)}
            className="w-32"
          />
          <span>{difficulty}</span>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-border/60 bg-background/40 p-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
          topology
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <div className="px-3 py-1.5 rounded-md glass text-xs font-mono">input</div>
          {mode === "multi-model" ? (
            <>
              <div className="text-muted-foreground">→</div>
              <div className="px-3 py-1.5 rounded-md border border-primary/50 text-xs font-mono">router</div>
              <div className="text-muted-foreground">→</div>
              <div className="flex flex-col gap-1">
                {routes.map((r) => (
                  <div key={r.label} className="px-3 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-mono">
                    {r.label}
                  </div>
                ))}
              </div>
            </>
          ) : (
            routes.map((r) => (
              <div key={r.label} className="flex items-center gap-2">
                <div className="text-muted-foreground">→</div>
                <div className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-[11px] font-mono">
                  {r.label}
                </div>
              </div>
            ))
          )}
          <div className="text-muted-foreground">→</div>
          <div className="px-3 py-1.5 rounded-md glass text-xs font-mono">answer</div>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 mt-3">
        {[
          { label: "latency", val: `${totalLatencyMs} ms`, hint: mode === "multi-agent" ? "adds per hop" : "single call" },
          { label: "cost", val: `$${totalCost}`, hint: mode === "multi-agent" ? "sum of all agents" : "one model" },
          { label: "quality", val: `${Math.round(quality * 100)}%`, hint: mode === "multi-agent" ? "critic improves it" : "picks best model" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</div>
            <div className="font-mono text-lg mt-1">{m.val}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{m.hint}</div>
          </div>
        ))}
      </div>
    </LabShell>
  );
};
