import { useMemo, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

// ---------- deterministic helpers (seeded, no deps) ----------
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
const rand = (seed: number) => {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};
const tokenize = (text: string): string[] => {
  // toy BPE-ish: split on whitespace + punctuation, then break long words on caps/vowel boundary
  const raw = text.replace(/([.,!?;:])/g, " $1 ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const w of raw) {
    if (w.length <= 5 || /[.,!?;:]/.test(w)) { out.push(w); continue; }
    // split at rough midpoint on a vowel boundary
    let cut = Math.floor(w.length / 2);
    for (let i = cut; i < w.length - 1; i++) if (/[aeiou]/i.test(w[i])) { cut = i + 1; break; }
    out.push(w.slice(0, cut), w.slice(cut));
  }
  return out.slice(0, 10);
};

const softmax = (xs: number[], temp = 1) => {
  const t = Math.max(0.01, temp);
  const scaled = xs.map((x) => x / t);
  const m = Math.max(...scaled);
  const ex = scaled.map((x) => Math.exp(x - m));
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / s);
};

const BLOCKS = [
  { id: "tok", label: "Tokenizer", hint: "Text → subword ids" },
  { id: "emb", label: "Embedding + Positional", hint: "id → d-dim vector, add position" },
  { id: "attn", label: "Multi-Head Self-Attention", hint: "Softmax(QKᵀ/√d)·V per head" },
  { id: "res1", label: "Add & LayerNorm", hint: "x + Attn(x), normalize" },
  { id: "ffn", label: "Feed-Forward (SwiGLU)", hint: "2 linears w/ gated activation" },
  { id: "res2", label: "Add & LayerNorm", hint: "x + FFN(x), normalize" },
  { id: "unembed", label: "Unembedding + Softmax", hint: "Logits → next-token probs" },
] as const;

type BlockId = (typeof BLOCKS)[number]["id"];

const NEXT_VOCAB = ["the", "a", "and", "of", "to", "in", "is", "model", "attention", "tokens", "language", "learns", "sequence", "context", "next"];

export const Transformer = () => {
  const [text, setText] = useState("A transformer predicts the next token");
  const [active, setActive] = useState<BlockId>("attn");
  const [head, setHead] = useState(0);
  const [temp, setTemp] = useState(0.8);

  const tokens = useMemo(() => tokenize(text || " "), [text]);
  const N = tokens.length;
  const D = 16; // display dims
  const HEADS = 4;

  // seeded embeddings: [N][D]
  const embeddings = useMemo(() => {
    return tokens.map((tok, i) => {
      const r = rand(hash(tok));
      return Array.from({ length: D }, (_, k) => {
        const emb = r() * 2 - 1;
        const pos = Math.sin(i / Math.pow(10000, k / D)) * 0.4;
        return emb + pos;
      });
    });
  }, [tokens]);

  // attention: per head, N x N causal softmax
  const attention = useMemo(() => {
    return Array.from({ length: HEADS }, (_, h) => {
      const r = rand(hash(text + ":h" + h));
      // build scores biased by embedding similarity + head-specific pattern
      const rows = tokens.map((_, i) => {
        const scores = tokens.map((_, j) => {
          if (j > i) return -Infinity; // causal
          const sim = embeddings[i].reduce((s, v, k) => s + v * embeddings[j][k], 0) / D;
          const headBias =
            h === 0 ? -Math.abs(i - j) * 0.4 :          // local
            h === 1 ? (j === 0 ? 1.2 : 0) :             // BOS attender
            h === 2 ? (j === i ? 1.0 : 0) :             // self
                      (r() - 0.5) * 0.6;                 // broad/noisy
          return sim + headBias;
        });
        return softmax(scores.map((s) => (s === -Infinity ? -1e9 : s)));
      });
      return rows;
    });
  }, [tokens, embeddings, text]);

  // FFN activation magnitude per token (fake but deterministic)
  const ffnAct = useMemo(() => {
    const r = rand(hash(text + ":ffn"));
    return tokens.map(() => 0.3 + r() * 0.7);
  }, [tokens, text]);

  // next-token logits from last token embedding · vocab pseudo-embeddings
  const nextProbs = useMemo(() => {
    const last = embeddings[N - 1] ?? Array(D).fill(0);
    const logits = NEXT_VOCAB.map((w) => {
      const rv = rand(hash(w));
      const vec = Array.from({ length: D }, () => rv() * 2 - 1);
      return vec.reduce((s, v, k) => s + v * last[k], 0);
    });
    const probs = softmax(logits, temp);
    return NEXT_VOCAB.map((w, i) => ({ w, p: probs[i] })).sort((a, b) => b.p - a.p);
  }, [embeddings, N, temp]);

  return (
    <LabShell meta={LABS.find((l) => l.id === "transformer")!} onReset={() => { setActive("attn"); setHead(0); setTemp(0.8); setText("A transformer predicts the next token"); }}>
      {/* Input */}
      <div className="mb-3">
        <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Input prompt</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 w-full rounded-md border border-border/60 bg-background/60 px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary"
          placeholder="Type any sentence…"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {tokens.map((t, i) => (
            <span key={i} className="rounded-sm border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono">
              <span className="text-primary/60 mr-1">{i}</span>{t}
            </span>
          ))}
          <span className="text-[10px] text-muted-foreground self-center ml-1">{N} tokens</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[220px_1fr]">
        {/* Pipeline */}
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Forward pass</div>
          {BLOCKS.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setActive(b.id)}
              className={cn(
                "text-left rounded-md px-3 py-2 border transition-all font-mono text-xs relative",
                active === b.id
                  ? "border-primary bg-primary/10 text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                  : "border-border/60 bg-background/40 text-muted-foreground hover:border-primary/40"
              )}
            >
              <span className="text-primary mr-2">{i + 1}.</span>{b.label}
              {i < BLOCKS.length - 1 && (
                <span className="absolute -bottom-2 left-6 text-primary/40 text-xs pointer-events-none">↓</span>
              )}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="rounded-lg border border-border/60 bg-background/60 p-4 min-h-[320px]">
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-[10px] uppercase tracking-widest text-primary">{BLOCKS.find(b => b.id === active)!.label}</div>
            <div className="text-[10px] text-muted-foreground">{BLOCKS.find(b => b.id === active)!.hint}</div>
          </div>

          {active === "tok" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Byte-pair-ish split. Each subword maps to a vocabulary id.</p>
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 font-mono text-xs">
                <div className="text-muted-foreground">idx</div><div className="text-muted-foreground">token</div><div className="text-muted-foreground">id</div>
                {tokens.map((t, i) => (
                  <div key={i} className="contents">
                    <div className="text-primary/60">{i}</div>
                    <div>{t}</div>
                    <div className="text-muted-foreground">{hash(t) % 50000}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "emb" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Each row = one token as a {D}-dim vector (+ positional). Real models use 2k-12k dims.</p>
              <div className="space-y-1">
                {embeddings.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-16 shrink-0 truncate font-mono text-[10px] text-muted-foreground">{tokens[i]}</div>
                    <div className="flex gap-[1px] flex-1">
                      {row.map((v, k) => {
                        const mag = Math.min(1, Math.abs(v));
                        const pos = v >= 0;
                        return <div key={k} className="h-4 flex-1 rounded-[1px]" style={{ background: pos ? `hsl(var(--primary) / ${mag})` : `hsl(0 70% 55% / ${mag})` }} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-[10px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary" />positive</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" />negative</span>
              </div>
            </div>
          )}

          {active === "attn" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Head</span>
                {Array.from({ length: HEADS }).map((_, h) => (
                  <button
                    key={h}
                    onClick={() => setHead(h)}
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[10px] font-mono transition",
                      head === h ? "border-primary bg-primary/15 text-foreground" : "border-border/60 text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    H{h} · {["local", "→BOS", "self", "broad"][h]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Row = query token. Column = key token it attends to. Causal mask hides the future.</p>
              <div className="overflow-x-auto">
                <div className="inline-block">
                  {/* col labels */}
                  <div className="flex ml-16">
                    {tokens.map((t, j) => (
                      <div key={j} className="w-7 text-[9px] text-muted-foreground text-center truncate">{t.slice(0, 4)}</div>
                    ))}
                  </div>
                  {attention[head].map((row, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-16 shrink-0 truncate font-mono text-[10px] text-muted-foreground pr-1 text-right">{tokens[i]}</div>
                      {row.map((v, j) => (
                        <div
                          key={j}
                          title={`${tokens[i]} → ${tokens[j]} : ${(v * 100).toFixed(1)}%`}
                          className="w-7 h-7 rounded-[2px] m-[1px] border border-border/30 transition-transform hover:scale-125"
                          style={{ background: j > i ? "transparent" : `hsl(var(--primary) / ${Math.min(1, v * 1.5)})` }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(active === "res1" || active === "res2") && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-mono text-primary">x = LayerNorm(x + {active === "res1" ? "Attention" : "FFN"}(x))</span>
                . Residual keeps gradients flowing across dozens of blocks; LayerNorm rescales per token.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="rounded border border-border/60 bg-background/40 p-3">x<div className="text-muted-foreground">input</div></div>
                <div className="rounded border border-primary/40 bg-primary/10 p-3">+ Δ<div className="text-muted-foreground">{active === "res1" ? "Attn" : "FFN"}(x)</div></div>
                <div className="rounded border border-border/60 bg-background/40 p-3">LN(·)<div className="text-muted-foreground">normalized</div></div>
              </div>
              <div className="text-[10px] text-muted-foreground">Stacked 12-100× to form the full transformer.</div>
            </div>
          )}

          {active === "ffn" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Two linear layers with a gated activation (SwiGLU). Most of the model's parameters — and memorized knowledge — live here.</p>
              <div className="font-mono text-xs text-muted-foreground">
                h = <span className="text-primary">W₂</span>( SiLU(<span className="text-primary">W₁</span>x) ⊙ <span className="text-primary">W₃</span>x )
              </div>
              <div className="space-y-1 pt-1">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Per-token activation magnitude</div>
                {tokens.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-16 shrink-0 truncate font-mono text-[10px] text-muted-foreground">{t}</div>
                    <div className="flex-1 h-3 rounded bg-background/60 border border-border/40 overflow-hidden">
                      <div className="h-full bg-primary/70" style={{ width: `${ffnAct[i] * 100}%` }} />
                    </div>
                    <div className="w-10 text-right font-mono text-[10px] text-muted-foreground">{ffnAct[i].toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "unembed" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Final hidden state of the last token is projected to vocab-sized logits, then softmax turns them into probabilities.</p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Temperature</span>
                <input type="range" min={0.1} max={2} step={0.1} value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))} className="flex-1 accent-primary" />
                <span className="font-mono text-xs w-8 text-right">{temp.toFixed(1)}</span>
              </div>
              <div className="space-y-1">
                {nextProbs.slice(0, 8).map(({ w, p }, i) => (
                  <div key={w} className="flex items-center gap-2">
                    <div className={cn("w-4 text-[10px] font-mono text-right", i === 0 ? "text-primary" : "text-muted-foreground")}>{i + 1}</div>
                    <div className="w-20 font-mono text-xs truncate">{w}</div>
                    <div className="flex-1 h-3 rounded bg-background/60 border border-border/40 overflow-hidden">
                      <div className={cn("h-full", i === 0 ? "bg-primary" : "bg-primary/40")} style={{ width: `${p * 100}%` }} />
                    </div>
                    <div className="w-12 text-right font-mono text-[10px] text-muted-foreground">{(p * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground pt-1">
                Predicted next token: <span className="font-mono text-primary">"{nextProbs[0].w}"</span> → append and repeat the whole pass to keep generating.
              </div>
            </div>
          )}
        </div>
      </div>
    </LabShell>
  );
};
