import { useMemo, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";

// Tiny A2UI-style spec renderer. Agent returns a JSON tree of widgets;
// the client turns that into real components. No text-only replies.

type Widget =
  | { kind: "heading"; text: string }
  | { kind: "text"; text: string }
  | { kind: "stat"; label: string; value: string; delta?: string }
  | { kind: "list"; items: string[] }
  | { kind: "actions"; buttons: string[] }
  | { kind: "bar"; label: string; value: number };

const DEFAULT: Widget[] = [
  { kind: "heading", text: "Q3 Payroll Summary" },
  { kind: "text", text: "Total gross rose 4.1% quarter-over-quarter." },
  { kind: "stat", label: "Runs", value: "34", delta: "+3" },
  { kind: "stat", label: "Errors", value: "0", delta: "-2" },
  { kind: "bar", label: "On-time deposits", value: 0.98 },
  { kind: "list", items: ["941 filed", "State returns queued", "FUTA reconciled"] },
  { kind: "actions", buttons: ["Approve", "Export CSV"] },
];

export const A2UIRenderer = () => {
  const [raw, setRaw] = useState(JSON.stringify(DEFAULT, null, 2));
  const [err, setErr] = useState<string | null>(null);

  const widgets = useMemo<Widget[]>(() => {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error("Expected an array of widgets");
      setErr(null);
      return parsed;
    } catch (e) {
      setErr((e as Error).message);
      return [];
    }
  }, [raw]);

  return (
    <LabShell meta={LABS[6]} onReset={() => setRaw(JSON.stringify(DEFAULT, null, 2))}>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            agent response (JSON spec)
          </label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
            className="flex-1 min-h-[260px] font-mono text-[11px] rounded-lg border border-border/60 bg-background/70 p-3 leading-relaxed"
          />
          {err && (
            <div className="mt-2 text-xs text-destructive font-mono">✕ {err}</div>
          )}
        </div>

        <div className="rounded-lg border border-border/60 bg-background/40 p-4 min-h-[260px] space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            rendered ui
          </div>
          {widgets.map((w, i) => {
            switch (w.kind) {
              case "heading":
                return <h4 key={i} className="font-display text-lg font-semibold">{w.text}</h4>;
              case "text":
                return <p key={i} className="text-sm text-muted-foreground">{w.text}</p>;
              case "stat":
                return (
                  <div key={i} className="inline-flex items-baseline gap-2 mr-4 glass rounded-md px-3 py-1.5">
                    <span className="text-[10px] uppercase text-muted-foreground">{w.label}</span>
                    <span className="font-mono text-base">{w.value}</span>
                    {w.delta && <span className="text-[10px] text-primary">{w.delta}</span>}
                  </div>
                );
              case "list":
                return (
                  <ul key={i} className="text-sm list-disc pl-5 marker:text-primary/70 space-y-0.5">
                    {w.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                );
              case "actions":
                return (
                  <div key={i} className="flex gap-2 pt-1">
                    {w.buttons.map((b, j) => (
                      <button
                        key={j}
                        className={
                          j === 0
                            ? "px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-mono"
                            : "px-3 py-1 rounded-md border border-border text-xs font-mono"
                        }
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                );
              case "bar":
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{w.label}</span>
                      <span className="font-mono">{Math.round(w.value * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, w.value * 100))}%` }}
                      />
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </LabShell>
  );
};
