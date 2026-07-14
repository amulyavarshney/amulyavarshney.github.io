import { useMemo, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

const PILLARS = [
  { id: "fair",   label: "Fairness",       hint: "Bias tested across groups?" },
  { id: "priv",   label: "Privacy",        hint: "PII minimized, retention set?" },
  { id: "trans",  label: "Transparency",   hint: "Model card + user disclosure?" },
  { id: "acc",    label: "Accountability", hint: "Human owns each decision?" },
  { id: "safe",   label: "Safety",         hint: "Red-teamed against misuse?" },
];

export const ResponsibleAI = () => {
  const [scores, setScores] = useState<Record<string, number>>({ fair: 3, priv: 4, trans: 3, acc: 2, safe: 3 });
  const avg = useMemo(() => Object.values(scores).reduce((a, b) => a + b, 0) / PILLARS.length, [scores]);

  // radar polygon
  const size = 220;
  const r = 80;
  const cx = size / 2;
  const cy = size / 2;
  const pts = PILLARS.map((p, i) => {
    const a = (Math.PI * 2 * i) / PILLARS.length - Math.PI / 2;
    const rr = (scores[p.id] / 5) * r;
    return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, lx: cx + Math.cos(a) * (r + 14), ly: cy + Math.sin(a) * (r + 14) };
  });
  const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <LabShell meta={LABS.find((l) => l.id === "responsible-ai")!} onReset={() => setScores({ fair: 3, priv: 4, trans: 3, acc: 2, safe: 3 })}>
      <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
        <div className="flex items-center justify-center">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[240px]">
            {[1, 2, 3, 4, 5].map((ring) => (
              <polygon
                key={ring}
                points={PILLARS.map((_, i) => {
                  const a = (Math.PI * 2 * i) / PILLARS.length - Math.PI / 2;
                  return `${cx + Math.cos(a) * (r * ring / 5)},${cy + Math.sin(a) * (r * ring / 5)}`;
                }).join(" ")}
                fill="none"
                stroke="hsl(var(--border))"
                strokeOpacity={0.4}
              />
            ))}
            <polygon points={poly} fill="hsl(var(--primary) / 0.25)" stroke="hsl(var(--primary))" strokeWidth={1.5} />
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={3} fill="hsl(var(--primary))" />
                <text x={p.lx} y={p.ly} fontSize={10} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="monospace">
                  {PILLARS[i].label}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="space-y-3">
          {PILLARS.map((p) => (
            <div key={p.id}>
              <div className="flex justify-between items-baseline text-xs font-mono mb-1">
                <span>{p.label}</span>
                <span className="text-primary">{scores[p.id]} / 5</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={scores[p.id]}
                onChange={(e) => setScores({ ...scores, [p.id]: +e.target.value })}
                className="w-full"
              />
              <div className="text-[10px] text-muted-foreground mt-0.5">{p.hint}</div>
            </div>
          ))}
          <div className={cn(
            "rounded-md p-3 text-xs font-mono border",
            avg >= 4 ? "border-primary/40 bg-primary/5 text-primary" :
            avg >= 2.5 ? "border-border text-muted-foreground" :
            "border-destructive/40 bg-destructive/5 text-destructive"
          )}>
            readiness score: {avg.toFixed(1)} / 5 —{" "}
            {avg >= 4 ? "ship-ready" : avg >= 2.5 ? "needs review" : "block launch"}
          </div>
        </div>
      </div>
    </LabShell>
  );
};
