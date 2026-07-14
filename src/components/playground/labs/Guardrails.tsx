import { useMemo, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { ShieldCheck, ShieldAlert } from "lucide-react";

type Rule = { id: string; label: string; test: (s: string) => boolean; kind: "pii" | "jailbreak" | "topic" };
const RULES: Rule[] = [
  { id: "email",  label: "PII: email",        kind: "pii",       test: (s) => /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/.test(s) },
  { id: "ssn",    label: "PII: SSN",          kind: "pii",       test: (s) => /\b\d{3}-\d{2}-\d{4}\b/.test(s) },
  { id: "card",   label: "PII: card number",  kind: "pii",       test: (s) => /\b(?:\d[ -]*?){13,16}\b/.test(s) },
  { id: "jb1",    label: "Jailbreak: DAN",    kind: "jailbreak", test: (s) => /ignore .* instructions|DAN mode|act as/i.test(s) },
  { id: "jb2",    label: "Jailbreak: system", kind: "jailbreak", test: (s) => /system prompt|reveal .* prompt/i.test(s) },
  { id: "topic1", label: "Topic: medical",    kind: "topic",     test: (s) => /diagnose|dosage|prescription/i.test(s) },
  { id: "topic2", label: "Topic: legal",      kind: "topic",     test: (s) => /sue|lawsuit|legally binding/i.test(s) },
];

export const Guardrails = () => {
  const [txt, setTxt] = useState("Hi! My card 4242 4242 4242 4242 was charged twice, please refund.");
  const hits = useMemo(() => RULES.filter((r) => r.test(txt)), [txt]);
  const blocked = hits.length > 0;

  return (
    <LabShell meta={LABS.find((l) => l.id === "guardrails")!} onReset={() => setTxt("Hi! My card 4242 4242 4242 4242 was charged twice, please refund.")}>
      <textarea
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        rows={3}
        className="w-full font-mono text-sm rounded-lg border border-border/60 bg-background/70 p-3 mb-3"
        placeholder="Type a user prompt..."
      />

      <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-border/60 bg-background/50 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">rules</div>
          <ul className="space-y-1 text-[11px] font-mono">
            {RULES.map((r) => {
              const hit = hits.includes(r);
              return (
                <li key={r.id} className={hit ? "text-destructive" : "text-muted-foreground"}>
                  <span className="inline-block w-3">{hit ? "✕" : "·"}</span> {r.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-lg border p-3" style={{
          borderColor: blocked ? "hsl(var(--destructive) / 0.5)" : "hsl(var(--primary) / 0.5)",
          background: blocked ? "hsl(var(--destructive) / 0.05)" : "hsl(var(--primary) / 0.05)",
        }}>
          <div className="flex items-center gap-2 mb-2">
            {blocked ? <ShieldAlert className="w-4 h-4 text-destructive" /> : <ShieldCheck className="w-4 h-4 text-primary" />}
            <span className={"font-mono text-xs " + (blocked ? "text-destructive" : "text-primary")}>
              {blocked ? "BLOCK · " + hits.length + " violation(s)" : "PASS · forwarded to model"}
            </span>
          </div>
          {blocked ? (
            <div className="text-xs text-foreground/90 space-y-1">
              <div>Response returned to user:</div>
              <div className="font-mono text-[11px] p-2 rounded bg-background/60 border border-border/40">
                Sorry, I can't process that message because it contains {hits.map((h) => h.kind).join(", ")}. Please retry without sensitive details.
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">All checks passed. Model call proceeds with redacted logs.</div>
          )}
        </div>
      </div>
    </LabShell>
  );
};
