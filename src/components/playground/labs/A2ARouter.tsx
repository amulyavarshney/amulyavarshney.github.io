import { useEffect, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const AGENTS = [
  { id: "planner", name: "Planner", x: 60, y: 60, color: "hsl(199 89% 55%)" },
  { id: "research", name: "Researcher", x: 260, y: 40, color: "hsl(168 76% 50%)" },
  { id: "writer", name: "Writer", x: 260, y: 180, color: "hsl(262 83% 65%)" },
];

type Frame = { from: string; to: string; kind: "task.send" | "task.status" | "task.artifact"; body: string };

const SCRIPT: Frame[] = [
  { from: "planner", to: "research", kind: "task.send", body: "sources on 2025 payroll changes" },
  { from: "research", to: "planner", kind: "task.status", body: "state: working" },
  { from: "research", to: "planner", kind: "task.artifact", body: "3 links + summary" },
  { from: "planner", to: "writer", kind: "task.send", body: "draft 150-word brief" },
  { from: "writer", to: "planner", kind: "task.artifact", body: "brief.md" },
];

export const A2ARouter = () => {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => {
      setI((x) => {
        if (x >= SCRIPT.length - 1) {
          setPlay(false);
          return x;
        }
        return x + 1;
      });
    }, reduced ? 100 : 1400);
    return () => clearInterval(id);
  }, [play, reduced]);

  const current = SCRIPT[i];
  const from = AGENTS.find((a) => a.id === current.from)!;
  const to = AGENTS.find((a) => a.id === current.to)!;

  return (
    <LabShell meta={LABS[5]} onReset={() => { setI(0); setPlay(false); }}>
      <div className="flex items-center gap-2 mb-3 text-xs">
        <button
          onClick={() => { setI(0); setPlay(true); }}
          className="font-mono px-3 py-1 rounded bg-primary text-primary-foreground"
        >
          ▶ Run task
        </button>
        <button
          onClick={() => setI((x) => Math.min(x + 1, SCRIPT.length - 1))}
          className="font-mono px-3 py-1 rounded border border-border"
        >
          Step ▸
        </button>
        <span className="ml-auto text-muted-foreground font-mono">
          {i + 1} / {SCRIPT.length}
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative h-[260px] rounded-lg bg-background/50 border border-border/60 overflow-hidden">
          <svg viewBox="0 0 340 240" className="w-full h-full">
            <line
              x1={from.x + 40}
              y1={from.y + 20}
              x2={to.x + 40}
              y2={to.y + 20}
              stroke="hsl(var(--primary))"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.7}
            />
            <circle r={6} fill={to.color}>
              <animateMotion
                key={i}
                dur="1.2s"
                fill="freeze"
                path={`M${from.x + 40},${from.y + 20} L${to.x + 40},${to.y + 20}`}
              />
            </circle>
            {AGENTS.map((a) => (
              <g key={a.id}>
                <rect
                  x={a.x}
                  y={a.y}
                  width={80}
                  height={40}
                  rx={8}
                  fill="hsl(var(--card))"
                  stroke={a.color}
                  strokeWidth={1.5}
                />
                <text
                  x={a.x + 40}
                  y={a.y + 24}
                  fontSize={11}
                  fontFamily="monospace"
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                >
                  {a.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="rounded-lg bg-background/70 border border-border/60 p-3 font-mono text-[11px] space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            wire frame
          </div>
          <pre className={cn("whitespace-pre-wrap animate-fade-in")}>
{JSON.stringify(
  {
    kind: current.kind,
    from: current.from,
    to: current.to,
    task: { id: `t-${1000 + i}`, body: current.body },
  },
  null,
  2
)}
          </pre>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-background/70 border border-border/60 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            live output
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            {i === SCRIPT.length - 1 && !play ? "task complete" : "streaming…"}
          </span>
        </div>
        <ul className="space-y-1.5 font-mono text-[11px] max-h-48 overflow-y-auto">
          {SCRIPT.slice(0, i + 1).map((f, idx) => {
            const fromA = AGENTS.find((a) => a.id === f.from)!;
            const toA = AGENTS.find((a) => a.id === f.to)!;
            const tone =
              f.kind === "task.send" ? "text-primary"
              : f.kind === "task.status" ? "text-muted-foreground"
              : "text-[hsl(168_76%_50%)]";
            return (
              <li key={idx} className="flex items-start gap-2 animate-fade-in">
                <span className="text-muted-foreground shrink-0">
                  [{String(idx + 1).padStart(2, "0")}]
                </span>
                <span className="shrink-0" style={{ color: fromA.color }}>{fromA.name}</span>
                <span className="text-muted-foreground">→</span>
                <span className="shrink-0" style={{ color: toA.color }}>{toA.name}</span>
                <span className={cn("shrink-0", tone)}>{f.kind}</span>
                <span className="text-foreground/80 truncate">· {f.body}</span>
              </li>
            );
          })}
        </ul>
        {i === SCRIPT.length - 1 && !play && (
          <div className="mt-3 pt-3 border-t border-border/40">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              final artifact
            </div>
            <pre className="whitespace-pre-wrap text-[11px] font-mono text-foreground/90 p-2 rounded bg-muted/40 border border-border/40">
{`# Payroll Brief — Q3 2025

Planner coordinated Researcher and Writer to produce a 150-word brief on
2025 payroll changes. Researcher pulled 3 sources; Writer drafted brief.md.

Status: ✓ delivered  ·  Turns: 5  ·  Agents: 3`}
            </pre>
          </div>
        )}
      </div>
    </LabShell>
  );
};
