import { useMemo, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";

const META = LABS.find((l) => l.id === "vector-similarity")!;

// Deterministic 64-dim "embedding" from token bag. Good enough to demo distance metrics.
const DIM = 64;
const embed = (text: string): number[] => {
  const v = new Array(DIM).fill(0);
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  for (const t of tokens) {
    let h = 2166136261;
    for (let i = 0; i < t.length; i++) {
      h ^= t.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    for (let k = 0; k < 3; k++) {
      const idx = (h + k * 2654435761) % DIM;
      v[idx] += 1 + (k === 0 ? 0.5 : 0);
    }
  }
  return v;
};

const norm = (v: number[]) => Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
const cosine = (a: number[], b: number[]) => dot(a, b) / (norm(a) * norm(b));
const euclid = (a: number[], b: number[]) =>
  Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0));

export const VectorSimilarity = () => {
  const [a, setA] = useState("Ship a RAG pipeline with rerankers.");
  const [b, setB] = useState("Deploy retrieval-augmented generation with rerank.");

  const { va, vb, cos, dt, eu } = useMemo(() => {
    const va = embed(a);
    const vb = embed(b);
    return { va, vb, cos: cosine(va, vb), dt: dot(va, vb), eu: euclid(va, vb) };
  }, [a, b]);

  const bar = (val: number, max = 1) => (
    <div className="h-1.5 rounded bg-muted overflow-hidden">
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${Math.max(0, Math.min(100, (val / max) * 100))}%` }}
      />
    </div>
  );

  const Heat = ({ v }: { v: number[] }) => {
    const max = Math.max(...v, 0.001);
    return (
      <div className="grid grid-cols-16 gap-[2px]" style={{ gridTemplateColumns: "repeat(16, minmax(0,1fr))" }}>
        {v.map((x, i) => (
          <div
            key={i}
            className="h-2 rounded-[2px]"
            style={{
              background: `hsl(var(--primary) / ${Math.min(1, x / max)})`,
              opacity: 0.25 + Math.min(0.75, x / max),
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <LabShell
      meta={META}
      onReset={() => {
        setA("Ship a RAG pipeline with rerankers.");
        setB("Deploy retrieval-augmented generation with rerank.");
      }}
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">sentence a</label>
          <textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-1 w-full min-h-[80px] rounded-lg border border-border/60 bg-background/70 p-2 text-sm"
          />
          <div className="mt-2"><Heat v={va} /></div>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">sentence b</label>
          <textarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="mt-1 w-full min-h-[80px] rounded-lg border border-border/60 bg-background/70 p-2 text-sm"
          />
          <div className="mt-2"><Heat v={vb} /></div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mt-2">
        {[
          { label: "cosine", val: cos, hint: "1 = identical direction", norm: cos },
          { label: "dot product", val: dt, hint: "scales with magnitude", norm: Math.min(1, dt / 40) },
          { label: "euclidean", val: eu, hint: "0 = same point", norm: 1 - Math.min(1, eu / 12) },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</span>
              <span className="font-mono text-sm">{m.val.toFixed(3)}</span>
            </div>
            <div className="mt-2">{bar(m.norm)}</div>
            <div className="mt-1.5 text-[11px] text-muted-foreground">{m.hint}</div>
          </div>
        ))}
      </div>
    </LabShell>
  );
};
