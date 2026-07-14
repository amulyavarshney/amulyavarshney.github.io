import { useMemo, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";

export const Metrics = () => {
  const [tp, setTp] = useState(80);
  const [fp, setFp] = useState(20);
  const [fn, setFn] = useState(15);
  const [tn, setTn] = useState(85);

  const m = useMemo(() => {
    const precision = tp / (tp + fp || 1);
    const recall = tp / (tp + fn || 1);
    const f1 = 2 * (precision * recall) / (precision + recall || 1);
    const accuracy = (tp + tn) / (tp + fp + fn + tn || 1);
    const specificity = tn / (tn + fp || 1);
    return { precision, recall, f1, accuracy, specificity };
  }, [tp, fp, fn, tn]);

  const cell = (label: string, val: number, hue: string) => (
    <div
      className="rounded-lg p-4 text-center border font-mono"
      style={{ background: `hsl(${hue} / 0.12)`, borderColor: `hsl(${hue} / 0.4)` }}
    >
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1" style={{ color: `hsl(${hue})` }}>{val}</div>
    </div>
  );

  const sliders: [string, number, (v: number) => void][] = [
    ["TP", tp, setTp], ["FP", fp, setFp], ["FN", fn, setFn], ["TN", tn, setTn],
  ];

  return (
    <LabShell meta={LABS.find((l) => l.id === "metrics")!} onReset={() => { setTp(80); setFp(20); setFn(15); setTn(85); }}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {cell("TP", tp, "168 76% 50%")}
        {cell("FP", fp, "24 96% 60%")}
        {cell("FN", fn, "330 80% 65%")}
        {cell("TN", tn, "199 89% 55%")}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono mb-3">
        {sliders.map(([label, val, set]) => (
          <label key={label} className="flex flex-col gap-1">
            <span className="text-muted-foreground">{label}: {val}</span>
            <input type="range" min={0} max={200} value={val} onChange={(e) => set(+e.target.value)} />
          </label>
        ))}
      </div>

      <div className="rounded-lg border border-border/60 bg-background/60 p-3 font-mono text-xs space-y-1.5">
        <Row label="Precision  = TP / (TP+FP)" v={m.precision} />
        <Row label="Recall     = TP / (TP+FN)" v={m.recall} />
        <Row label="F1         = 2·P·R / (P+R)" v={m.f1} />
        <Row label="Accuracy   = (TP+TN) / all" v={m.accuracy} />
        <Row label="Specificity= TN / (TN+FP)" v={m.specificity} />
      </div>
    </LabShell>
  );
};

const Row = ({ label, v }: { label: string; v: number }) => (
  <div className="flex items-center gap-2">
    <span className="text-muted-foreground flex-1">{label}</span>
    <span className="text-primary w-14 text-right">{v.toFixed(3)}</span>
    <div className="w-24 h-1.5 rounded bg-muted overflow-hidden">
      <div className="h-full bg-primary" style={{ width: `${v * 100}%` }} />
    </div>
  </div>
);
