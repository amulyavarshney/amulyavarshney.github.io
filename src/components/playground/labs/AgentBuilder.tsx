import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { Play } from "lucide-react";

const META = LABS.find((l) => l.id === "agent-builder")!;

const ROLES = ["Researcher", "Coder", "Analyst", "Support"] as const;
const TOOLS = ["web.search", "sql.query", "code.exec", "email.send", "file.read"] as const;
const MEMORY = ["none", "buffer", "vector", "graph"] as const;
const GUARDS = ["pii-redact", "topic-filter", "jailbreak", "cost-cap"] as const;

type Role = (typeof ROLES)[number];
type Mem = (typeof MEMORY)[number];

const PLANS: Record<Role, string[]> = {
  Researcher: ["Understand question", "Search sources", "Cross-check facts", "Cite and summarize"],
  Coder: ["Read repo", "Write patch", "Run tests", "Report diff"],
  Analyst: ["Load dataset", "Compute metrics", "Detect outliers", "Draft findings"],
  Support: ["Classify intent", "Lookup account", "Compose reply", "Log ticket"],
};

export const AgentBuilder = () => {
  const [role, setRole] = useState<Role>("Researcher");
  const [tools, setTools] = useState<string[]>(["web.search"]);
  const [mem, setMem] = useState<Mem>("buffer");
  const [guards, setGuards] = useState<string[]>(["pii-redact"]);
  const [task, setTask] = useState("Summarize the state of open-source vector DBs in 2026.");
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const toggle = (list: string[], v: string, setter: (x: string[]) => void) =>
    setter(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const run = async () => {
    setRunning(true);
    setLog([]);
    const steps = [
      `[init] role=${role} · memory=${mem} · guards=[${guards.join(",") || "none"}]`,
      `[plan] ${PLANS[role].length} steps queued`,
      ...PLANS[role].map((s, i) => `[step ${i + 1}] ${s}`),
      ...(tools.length
        ? tools.map((t) => `[tool] called ${t}(…) → ok`)
        : ["[tool] no tools bound — model-only reasoning"]),
      guards.includes("pii-redact") ? "[guard] pii-redact removed 2 spans" : "",
      `[final] task complete · answering "${task.slice(0, 48)}${task.length > 48 ? "…" : ""}"`,
    ].filter(Boolean);
    for (const s of steps) {
      await new Promise((r) => setTimeout(r, 220));
      setLog((l) => [...l, s]);
    }
    setRunning(false);
  };

  const Chip = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={
        "text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors " +
        (active
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")
      }
    >
      {children}
    </button>
  );

  return (
    <LabShell
      meta={META}
      onReset={() => {
        setRole("Researcher");
        setTools(["web.search"]);
        setMem("buffer");
        setGuards(["pii-redact"]);
        setLog([]);
      }}
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">role</div>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => (
                <Chip key={r} active={role === r} onClick={() => setRole(r)}>
                  {r}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">tools</div>
            <div className="flex flex-wrap gap-1.5">
              {TOOLS.map((t) => (
                <Chip key={t} active={tools.includes(t)} onClick={() => toggle(tools, t, setTools)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">memory</div>
            <div className="flex flex-wrap gap-1.5">
              {MEMORY.map((m) => (
                <Chip key={m} active={mem === m} onClick={() => setMem(m)}>
                  {m}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">guardrails</div>
            <div className="flex flex-wrap gap-1.5">
              {GUARDS.map((g) => (
                <Chip key={g} active={guards.includes(g)} onClick={() => toggle(guards, g, setGuards)}>
                  {g}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">task</div>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full min-h-[70px] rounded-lg border border-border/60 bg-background/70 p-2 text-sm"
            />
          </div>
          <button
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-mono disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" /> {running ? "Running…" : "Run agent"}
          </button>
        </div>

        <div className="rounded-lg border border-border/60 bg-background/70 p-3 font-mono text-[11px] min-h-[260px] max-h-[360px] overflow-y-auto space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">trace</div>
          {log.length === 0 && <div className="text-muted-foreground">idle — press Run agent</div>}
          {log.map((l, i) => (
            <div
              key={i}
              className={
                l.startsWith("[guard]")
                  ? "text-amber-500"
                  : l.startsWith("[final]")
                  ? "text-primary"
                  : "text-foreground/80"
              }
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </LabShell>
  );
};
