import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";

const META = LABS.find((l) => l.id === "mini-terminal")!;

type Line = { kind: "in" | "out" | "err"; text: string };

const BANNER: Line[] = [
  { kind: "out", text: "amulya-shell v0.4 · type 'help' to begin" },
];

const COMMANDS: Record<string, string> = {
  whoami: "Amulya Varshney · Software Engineer 2 · Applied AI",
  skills: "python · typescript · langgraph · qdrant · fastapi · gRPC · react · aws",
  projects: "payroll-intelligence · ray-fintech · rag-workbench · agent-lab",
  experience: "SE2 @ Intuit · Applied AI @ CashApp · SDE @ Amazon",
  achievements: "GenAI @ AWS cert · CrewAI multi-agent cert · Stanford CS continuing",
  social: "github.com/amulyavarshney · linkedin.com/in/amulya-varshney",
  help: "Try: whoami · skills · projects · experience · achievements · social · date · echo <x> · clear",
};

export const MiniTerminal = () => {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const next: Line[] = [{ kind: "in", text: cmd }];
    if (!cmd) return setLines((l) => [...l, ...next]);
    if (cmd === "clear") return setLines(BANNER);
    const [head, ...rest] = cmd.split(/\s+/);
    if (head === "date") next.push({ kind: "out", text: new Date().toString() });
    else if (head === "echo") next.push({ kind: "out", text: rest.join(" ") });
    else if (COMMANDS[head]) next.push({ kind: "out", text: COMMANDS[head] });
    else next.push({ kind: "err", text: `zsh: command not found: ${head}` });
    setLines((l) => [...l, ...next]);
    setHist((h) => [cmd, ...h].slice(0, 30));
    setHi(-1);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.min(hi + 1, hist.length - 1);
      if (n >= 0) {
        setHi(n);
        setInput(hist[n]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = Math.max(hi - 1, -1);
      setHi(n);
      setInput(n === -1 ? "" : hist[n]);
    }
  };

  return (
    <LabShell meta={META} onReset={() => setLines(BANNER)}>
      <div
        ref={scroll}
        className="font-mono text-[12px] rounded-lg border border-border/60 bg-background/70 p-3 h-64 overflow-y-auto leading-relaxed"
      >
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {l.kind === "in" ? (
              <>
                <span className="text-primary">amulya@portfolio</span>
                <span className="text-muted-foreground"> ~ $ </span>
                <span>{l.text}</span>
              </>
            ) : l.kind === "err" ? (
              <span className="text-destructive">{l.text}</span>
            ) : (
              <span className="text-muted-foreground">{l.text}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2">
        <span className="text-primary font-mono text-xs">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          placeholder="Type a command…"
          className="flex-1 bg-transparent outline-none text-sm font-mono"
        />
      </div>
    </LabShell>
  );
};
