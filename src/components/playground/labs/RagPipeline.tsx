import { useMemo, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

const DOC =
  "Employers must file Form 941 quarterly. FICA wage base for 2025 rises to $176,100. Federal unemployment (FUTA) tax rate is 6.0% on the first $7,000 of each employee's wages. State rates vary. Deposits must be made semi-weekly or monthly depending on the lookback period.";

const STAGES = ["Chunk", "Embed", "Index", "Retrieve", "Rerank", "Generate"] as const;

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
};

export const RagPipeline = () => {
  const [stage, setStage] = useState(0);
  const [chunkSize, setChunkSize] = useState(60);
  const [k, setK] = useState(3);
  const [query, setQuery] = useState("FICA wage base 2025?");

  const chunks = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < DOC.length; i += chunkSize) out.push(DOC.slice(i, i + chunkSize));
    return out;
  }, [chunkSize]);

  const points = useMemo(
    () =>
      chunks.map((c, i) => {
        const h = hash(c);
        return {
          i,
          x: 20 + ((h & 0xff) / 255) * 260,
          y: 20 + (((h >> 8) & 0xff) / 255) * 130,
          score: 0.5 + ((h & 0xf) / 15) * 0.5 - Math.abs(c.toLowerCase().indexOf("fica") < 0 ? 0.2 : -0.4),
        };
      }),
    [chunks]
  );

  const top = useMemo(
    () => [...points].sort((a, b) => b.score - a.score).slice(0, k),
    [points, k]
  );

  const topSet = new Set(top.map((p) => p.i));

  return (
    <LabShell
      meta={LABS[2]}
      onReset={() => {
        setStage(0);
        setChunkSize(60);
        setK(3);
      }}
    >
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {STAGES.map((s, i) => (
          <button
            key={s}
            onClick={() => setStage(i)}
            className={cn(
              "text-[11px] font-mono px-2 py-1 rounded-md border transition-colors",
              i <= stage
                ? "bg-primary/15 border-primary/40 text-primary"
                : "border-border text-muted-foreground"
            )}
          >
            {i + 1}. {s}
          </button>
        ))}
        <button
          onClick={() => setStage((s) => (s + 1) % STAGES.length)}
          className="ml-auto text-xs font-mono px-3 py-1 rounded-md bg-primary text-primary-foreground"
        >
          Step ▸
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3 text-xs">
          <label className="block">
            <span className="text-muted-foreground">Query</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-1 w-full bg-background/60 border border-border rounded-md px-2 py-1.5 font-mono"
            />
          </label>
          <label className="block">
            <span className="text-muted-foreground">Chunk size: {chunkSize}</span>
            <input
              type="range"
              min={30}
              max={140}
              step={10}
              value={chunkSize}
              onChange={(e) => setChunkSize(+e.target.value)}
              className="w-full accent-primary"
            />
          </label>
          <label className="block">
            <span className="text-muted-foreground">top-k: {k}</span>
            <input
              type="range"
              min={1}
              max={5}
              value={k}
              onChange={(e) => setK(+e.target.value)}
              className="w-full accent-primary"
            />
          </label>
          <div className="rounded-md bg-muted/40 p-2 font-mono text-[11px] max-h-32 overflow-auto space-y-1">
            {chunks.map((c, i) => (
              <div
                key={i}
                className={cn(
                  "px-1.5 py-0.5 rounded",
                  topSet.has(i) && stage >= 3 ? "bg-primary/20 text-foreground" : "text-muted-foreground"
                )}
              >
                #{i} · {c.slice(0, 44)}…
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-lg bg-background/50 border border-border/60 p-3 min-h-[220px] overflow-hidden">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            vector space (2D projection)
          </div>
          <svg viewBox="0 0 300 170" className="w-full h-40">
            {points.map((p) => {
              const isTop = topSet.has(p.i) && stage >= 3;
              return (
                <g key={p.i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isTop ? 6 : 3}
                    fill={isTop ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                    opacity={stage >= 1 ? 1 : 0.15}
                  >
                    {stage >= 1 && (
                      <animate attributeName="r" values="2;4;3" dur="1.4s" repeatCount="1" />
                    )}
                  </circle>
                  {isTop && (
                    <text x={p.x + 8} y={p.y + 3} fontSize="8" fill="hsl(var(--primary))" fontFamily="monospace">
                      #{p.i}
                    </text>
                  )}
                </g>
              );
            })}
            {stage >= 2 && (
              <circle
                cx={150}
                cy={85}
                r={4}
                fill="hsl(var(--secondary))"
                stroke="hsl(var(--secondary))"
                strokeOpacity={0.4}
              >
                <animate attributeName="r" values="4;80;4" dur="2s" repeatCount="1" />
              </circle>
            )}
          </svg>
          {stage >= 5 && (
            <div className="mt-2 rounded-md bg-primary/10 border border-primary/30 p-2 text-xs">
              <span className="font-mono text-primary">answer:</span>{" "}
              For 2025 the FICA wage base is $176,100. [chunk #{top[0]?.i}]
            </div>
          )}
        </div>
      </div>
    </LabShell>
  );
};
