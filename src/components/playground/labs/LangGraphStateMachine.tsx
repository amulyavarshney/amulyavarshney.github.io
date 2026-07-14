import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

type NodeId = "router" | "retrieve" | "tool" | "generate" | "critic" | "end";

const W = 96;
const H = 40;

const NODES: Record<NodeId, { label: string; x: number; y: number; kind: string }> = {
  router:   { label: "router",   x: 20,  y: 110, kind: "cond" },
  retrieve: { label: "retrieve", x: 170, y: 40,  kind: "func" },
  tool:     { label: "tool",     x: 170, y: 180, kind: "func" },
  generate: { label: "generate", x: 340, y: 110, kind: "func" },
  critic:   { label: "critic",   x: 490, y: 110, kind: "cond" },
  end:      { label: "END",      x: 640, y: 110, kind: "end" },
};

type Edge = { from: NodeId; to: NodeId; cond?: string };
const EDGES: Edge[] = [
  { from: "router", to: "retrieve", cond: "kb_lookup" },
  { from: "router", to: "tool", cond: "action" },
  { from: "retrieve", to: "generate" },
  { from: "tool", to: "generate" },
  { from: "generate", to: "critic" },
  { from: "critic", to: "generate", cond: "revise" },
  { from: "critic", to: "end", cond: "pass" },
];

type Step = { active: NodeId; edge?: [NodeId, NodeId]; state: Record<string, unknown> };
type Scenario = { id: string; label: string; description: string; script: Step[] };

const SCENARIOS: Scenario[] = [
  {
    id: "kb",
    label: "KB Lookup",
    description: "Router → retrieve → generate → critic (pass)",
    script: [
      { active: "router", state: { input: "What is FUTA rate 2025?" } },
      { active: "retrieve", edge: ["router", "retrieve"], state: { input: "What is FUTA rate 2025?", path: "kb_lookup" } },
      { active: "generate", edge: ["retrieve", "generate"], state: { docs: ["§ FUTA 6% on first $7k…"], path: "kb_lookup" } },
      { active: "critic", edge: ["generate", "critic"], state: { draft: "FUTA is 6% on the first $7,000." } },
      { active: "end", edge: ["critic", "end"], state: { answer: "FUTA is 6% on the first $7,000.", verdict: "pass" } },
    ],
  },
  {
    id: "tool",
    label: "Tool Action",
    description: "Router → tool → generate → critic (pass)",
    script: [
      { active: "router", state: { input: "Run payroll for June 2025" } },
      { active: "tool", edge: ["router", "tool"], state: { input: "Run payroll for June 2025", path: "action", tool: "payroll.run" } },
      { active: "generate", edge: ["tool", "generate"], state: { tool_result: { runId: "pr_9821", employees: 42, total: "$184,220" }, path: "action" } },
      { active: "critic", edge: ["generate", "critic"], state: { draft: "Payroll run pr_9821 completed for 42 employees ($184,220)." } },
      { active: "end", edge: ["critic", "end"], state: { answer: "Payroll run pr_9821 completed for 42 employees ($184,220).", verdict: "pass" } },
    ],
  },
  {
    id: "revise",
    label: "Revise Loop",
    description: "Critic requests revision before passing",
    script: [
      { active: "router", state: { input: "Cite the FUTA statute" } },
      { active: "retrieve", edge: ["router", "retrieve"], state: { path: "kb_lookup" } },
      { active: "generate", edge: ["retrieve", "generate"], state: { docs: ["26 U.S.C. §3301"] } },
      { active: "critic", edge: ["generate", "critic"], state: { draft: "FUTA is 6% on the first $7,000." } },
      { active: "generate", edge: ["critic", "generate"], state: { draft: "FUTA is 6% on the first $7,000.", verdict: "revise", note: "add citation" } },
      { active: "critic", edge: ["generate", "critic"], state: { draft: "FUTA is 6% on the first $7,000 [26 U.S.C. §3301]." } },
      { active: "end", edge: ["critic", "end"], state: { answer: "FUTA is 6% on the first $7,000 [26 U.S.C. §3301].", verdict: "pass" } },
    ],
  },
  {
    id: "hybrid",
    label: "Tool + Revise",
    description: "Tool call, critic revises, then passes",
    script: [
      { active: "router", state: { input: "Refund invoice INV-4471 and confirm" } },
      { active: "tool", edge: ["router", "tool"], state: { path: "action", tool: "stripe.refund", args: { invoice: "INV-4471" } } },
      { active: "generate", edge: ["tool", "generate"], state: { tool_result: { refundId: "re_88", amount: "$1,240" } } },
      { active: "critic", edge: ["generate", "critic"], state: { draft: "Refund processed." } },
      { active: "generate", edge: ["critic", "generate"], state: { draft: "Refund processed.", verdict: "revise", note: "include amount + id" } },
      { active: "critic", edge: ["generate", "critic"], state: { draft: "Refund re_88 for $1,240 processed on INV-4471." } },
      { active: "end", edge: ["critic", "end"], state: { answer: "Refund re_88 for $1,240 processed on INV-4471.", verdict: "pass" } },
    ],
  },
];

const centerOf = (n: { x: number; y: number }) => ({ cx: n.x + W / 2, cy: n.y + H / 2 });

export const LangGraphStateMachine = () => {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [i, setI] = useState(0);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const script = scenario.script;
  const s = script[Math.min(i, script.length - 1)];

  return (
    <LabShell meta={LABS[7]} onReset={() => setI(0)}>
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <div className="flex flex-wrap gap-1">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => { setScenarioId(sc.id); setI(0); }}
              className={cn(
                "font-mono px-2 py-1 rounded border transition-colors",
                sc.id === scenarioId
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {sc.label}
            </button>
          ))}
        </div>
        <div className="basis-full text-[10px] text-muted-foreground font-mono">
          {scenario.description}
        </div>
        <button
          onClick={() => setI(0)}
          className="font-mono px-3 py-1 rounded border border-border"
        >
          ⟲ Restart
        </button>
        <button
          onClick={() => setI((x) => Math.min(x + 1, script.length - 1))}
          className="font-mono px-3 py-1 rounded bg-primary text-primary-foreground"
        >
          Step ▸
        </button>
        <span className="ml-auto text-muted-foreground font-mono">
          step {Math.min(i, script.length - 1) + 1}/{script.length}
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg bg-background/50 border border-border/60 p-2 overflow-hidden">
          <svg viewBox="0 0 760 260" className="w-full h-[240px]">
            <defs>
              <marker id="lg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--muted-foreground))" opacity="0.6" />
              </marker>
              <marker id="lg-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" />
              </marker>
            </defs>
            {EDGES.map((e, k) => {
              const a = centerOf(NODES[e.from]);
              const b = centerOf(NODES[e.to]);
              const active = s.edge && s.edge[0] === e.from && s.edge[1] === e.to;
              // curved path for self-ish or reverse edges
              const isReverse = e.from === "critic" && e.to === "generate";
              const dx = b.cx - a.cx;
              const dy = b.cy - a.cy;
              const len = Math.max(1, Math.hypot(dx, dy));
              // shorten endpoints so arrow doesn't hide inside the rect
              const pad = 52;
              const sx = a.cx + (dx / len) * pad;
              const sy = a.cy + (dy / len) * (H / 2 + 2);
              const ex = b.cx - (dx / len) * pad;
              const ey = b.cy - (dy / len) * (H / 2 + 2);
              const midX = (sx + ex) / 2;
              const midY = (sy + ey) / 2;
              const d = isReverse
                ? `M ${sx} ${sy - 8} Q ${midX} ${midY - 34}, ${ex} ${ey - 8}`
                : `M ${sx} ${sy} L ${ex} ${ey}`;
              return (
                <g key={k}>
                  <path
                    d={d}
                    fill="none"
                    stroke={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                    strokeOpacity={active ? 1 : 0.4}
                    strokeWidth={active ? 2.2 : 1.2}
                    strokeDasharray={e.cond ? "5 4" : undefined}
                    markerEnd={active ? "url(#lg-arrow-active)" : "url(#lg-arrow)"}
                  />
                  {e.cond && (
                    <g>
                      <rect
                        x={midX - e.cond.length * 3.2 - 4}
                        y={(isReverse ? midY - 40 : midY - 16) - 2}
                        width={e.cond.length * 6.4 + 8}
                        height={14}
                        rx={3}
                        fill="hsl(var(--background))"
                        stroke={active ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeOpacity={active ? 1 : 0.6}
                      />
                      <text
                        x={midX}
                        y={isReverse ? midY - 30 : midY - 6}
                        fontSize={9}
                        textAnchor="middle"
                        fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                        fontFamily="monospace"
                      >
                        {e.cond}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            {(Object.entries(NODES) as [NodeId, typeof NODES[NodeId]][]).map(([id, n]) => {
              const isActive = s.active === id;
              return (
                <g key={id}>
                  <rect
                    x={n.x}
                    y={n.y}
                    width={W}
                    height={H}
                    rx={n.kind === "cond" ? 20 : 8}
                    fill={isActive ? "hsl(var(--primary) / 0.18)" : "hsl(var(--card))"}
                    stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth={isActive ? 2 : 1}
                  >
                    {isActive && <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" />}
                  </rect>
                  <text
                    x={n.x + W / 2}
                    y={n.y + H / 2 + 4}
                    fontSize={11}
                    textAnchor="middle"
                    fontFamily="monospace"
                    fill="hsl(var(--foreground))"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="rounded-lg bg-background/70 border border-border/60 p-3 font-mono text-[11px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">state</div>
            <div className="text-[10px] text-primary">@ {s.active}</div>
          </div>
          <pre key={i + scenarioId} className={cn("whitespace-pre-wrap animate-fade-in max-h-[200px] overflow-auto")}>
{JSON.stringify(s.state, null, 2)}
          </pre>
        </div>
      </div>
    </LabShell>
  );
};
