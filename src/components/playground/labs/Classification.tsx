import { useMemo, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";

// Toy classifier: keyword-driven logits → softmax
const CLASSES = [
  { id: "billing",  words: ["invoice", "refund", "charge", "payment", "bill"], color: "199 89% 55%" },
  { id: "support",  words: ["help", "broken", "error", "issue", "bug"], color: "24 96% 60%" },
  { id: "sales",    words: ["price", "demo", "buy", "upgrade", "plan"], color: "168 76% 50%" },
  { id: "feedback", words: ["love", "hate", "suggestion", "feature", "wish"], color: "262 83% 65%" },
];

const softmax = (xs: number[]) => {
  const m = Math.max(...xs);
  const e = xs.map((x) => Math.exp(x - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
};

export const Classification = () => {
  const [text, setText] = useState("Hi, my invoice is wrong and I need a refund today.");

  const probs = useMemo(() => {
    const t = text.toLowerCase();
    const logits = CLASSES.map((c) => c.words.reduce((s, w) => s + (t.includes(w) ? 2 : 0), 0.1));
    return softmax(logits);
  }, [text]);

  const top = probs.indexOf(Math.max(...probs));

  return (
    <LabShell meta={LABS.find((l) => l.id === "classification")!} onReset={() => setText("Hi, my invoice is wrong and I need a refund today.")}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="w-full font-mono text-sm rounded-lg border border-border/60 bg-background/70 p-3 mb-3"
      />

      <div className="space-y-2">
        {CLASSES.map((c, i) => (
          <div key={c.id}>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className={i === top ? "text-primary font-semibold" : "text-muted-foreground"}>
                {i === top && "▶ "}{c.id}
              </span>
              <span className="text-muted-foreground">{(probs[i] * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded bg-muted overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${probs[i] * 100}%`, background: `hsl(${c.color})` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[11px] font-mono text-muted-foreground">
        logits → softmax → probabilities. Top class: <span className="text-primary">{CLASSES[top].id}</span>
      </div>
    </LabShell>
  );
};
