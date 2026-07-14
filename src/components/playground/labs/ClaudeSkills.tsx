import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { FileText, FolderOpen, Sparkles } from "lucide-react";

const META = LABS.find((l) => l.id === "claude-skills")!;

type Skill = {
  slug: string;
  name: string;
  description: string;
  resources: { path: string; kind: "md" | "script" | "data" }[];
  when: string;
  manifest: string;
};

const SKILLS: Skill[] = [
  {
    slug: "pdf-report",
    name: "pdf-report",
    description: "Generate branded PDF reports from a data source.",
    when: "user asks for a PDF export, invoice, or printable summary",
    resources: [
      { path: "SKILL.md", kind: "md" },
      { path: "templates/report.html", kind: "data" },
      { path: "scripts/render.py", kind: "script" },
    ],
    manifest: `---
name: pdf-report
description: Generate branded PDF reports from a data source.
license: MIT
---
# When to use
Call this Skill whenever the user needs a formatted PDF.
# How
1. Fill templates/report.html with data.
2. Run scripts/render.py to produce output.pdf.`,
  },
  {
    slug: "sql-analyst",
    name: "sql-analyst",
    description: "Answer questions by writing safe, read-only SQL.",
    when: "user asks a data question phrased in natural language",
    resources: [
      { path: "SKILL.md", kind: "md" },
      { path: "reference/schema.sql", kind: "data" },
      { path: "scripts/query.py", kind: "script" },
    ],
    manifest: `---
name: sql-analyst
description: Answer questions by writing safe, read-only SQL.
---
# Rules
- SELECT only. Never mutate.
- Always LIMIT 1000.
- Explain the query in one line.`,
  },
  {
    slug: "brand-writer",
    name: "brand-writer",
    description: "Write copy in the house voice with tone rules and banned words.",
    when: "user drafts marketing copy, product blurbs, or announcements",
    resources: [
      { path: "SKILL.md", kind: "md" },
      { path: "reference/voice.md", kind: "md" },
      { path: "reference/banned.txt", kind: "data" },
    ],
    manifest: `---
name: brand-writer
description: Write copy in the house voice.
---
# Voice
Direct. No em-dashes. Active verbs. Short sentences.
Load reference/banned.txt before writing.`,
  },
];

const iconFor = (k: string) =>
  k === "md" ? <FileText className="w-3.5 h-3.5" /> : k === "script" ? <Sparkles className="w-3.5 h-3.5" /> : <FolderOpen className="w-3.5 h-3.5" />;

export const ClaudeSkills = () => {
  const [pick, setPick] = useState<Skill>(SKILLS[0]);
  const [loaded, setLoaded] = useState<string[]>(["SKILL.md"]);

  const toggle = (p: string) =>
    setLoaded((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  return (
    <LabShell meta={META} onReset={() => { setPick(SKILLS[0]); setLoaded(["SKILL.md"]); }}>
      <div className="flex flex-wrap gap-1.5">
        {SKILLS.map((s) => (
          <button
            key={s.slug}
            onClick={() => { setPick(s); setLoaded(["SKILL.md"]); }}
            className={
              "text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors " +
              (pick.slug === s.slug
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground")
            }
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="rounded-lg border border-border/60 bg-background/40 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">bundle</div>
          <ul className="mt-2 space-y-1">
            {pick.resources.map((r) => (
              <li key={r.path}>
                <button
                  onClick={() => toggle(r.path)}
                  className={
                    "w-full flex items-center gap-2 text-left text-xs font-mono px-2 py-1.5 rounded border transition-colors " +
                    (loaded.includes(r.path)
                      ? "border-primary/50 bg-primary/5 text-foreground"
                      : "border-border/60 text-muted-foreground hover:text-foreground")
                  }
                >
                  <span className={loaded.includes(r.path) ? "text-primary" : ""}>{iconFor(r.kind)}</span>
                  {r.path}
                  <span className="ml-auto text-[10px]">{loaded.includes(r.path) ? "loaded" : "on demand"}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-[11px] text-muted-foreground">
            <span className="text-primary font-mono">trigger:</span> {pick.when}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            <span className="text-primary font-mono">context:</span> {loaded.length}/{pick.resources.length} files pulled ({loaded.length * 380} tokens est.)
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-background/70 p-3 font-mono text-[11px] whitespace-pre-wrap min-h-[220px]">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">SKILL.md</div>
          {pick.manifest}
        </div>
      </div>
    </LabShell>
  );
};
