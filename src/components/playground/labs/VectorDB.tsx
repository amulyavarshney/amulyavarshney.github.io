import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";

const DOC = `Ray is a fintech AI concierge. It supports invoices, refunds, and KYC. Refunds require dual approval above $10,000.`;

const chunk = (text: string, size: number) => {
  const out: string[] = [];
  const words = text.split(/\s+/);
  for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size).join(" "));
  return out;
};

// deterministic pseudo-embedding: hash to 6 dims
const embed = (s: string) => {
  const dims = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < s.length; i++) dims[i % 6] += s.charCodeAt(i);
  const max = Math.max(...dims);
  return dims.map((v) => +(v / max).toFixed(2));
};

export const VectorDB = () => {
  const [size, setSize] = useState(8);
  const [index, setIndex] = useState<"flat" | "ivf" | "hnsw">("hnsw");
  const chunks = chunk(DOC, size);

  return (
    <LabShell meta={LABS.find((l) => l.id === "vector-db")!} onReset={() => { setSize(8); setIndex("hnsw"); }}>
      <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
        <label className="font-mono text-muted-foreground">
          chunk size <input type="range" min={4} max={16} value={size} onChange={(e) => setSize(+e.target.value)} className="align-middle mx-2" /> {size}w
        </label>
        <div className="flex gap-1">
          {(["flat", "ivf", "hnsw"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setIndex(k)}
              className={`font-mono px-2 py-0.5 rounded border ${index === k ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/60 overflow-hidden text-[11px] font-mono">
        <div className="grid grid-cols-[3rem_1fr_1fr_5rem] px-3 py-1.5 bg-muted/40 uppercase tracking-widest text-[9px] text-muted-foreground">
          <span>id</span><span>chunk</span><span>vector</span><span>meta</span>
        </div>
        {chunks.map((c, i) => (
          <div key={i} className="grid grid-cols-[3rem_1fr_1fr_5rem] px-3 py-2 border-t border-border/40 items-center animate-fade-in">
            <span className="text-primary">#{i}</span>
            <span className="pr-3 text-foreground/90 truncate">{c}</span>
            <span className="text-muted-foreground text-[10px]">[{embed(c).join(", ")}]</span>
            <span className="text-[10px] text-muted-foreground">doc:ray</span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground font-mono">
        index={index.toUpperCase()} · rows={chunks.length} · dim=6 (demo)
        <span className="text-primary ml-2">
          {index === "flat" && "O(N) exact search"}
          {index === "ivf" && "O(√N) coarse+refine"}
          {index === "hnsw" && "O(log N) graph traversal"}
        </span>
      </div>
    </LabShell>
  );
};
