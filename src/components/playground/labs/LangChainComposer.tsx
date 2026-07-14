import { useRef, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";
import { X, Plus, Play, Square } from "lucide-react";

type Node = { id: string; kind: string };

const PALETTE = [
  { kind: "PromptTemplate", label: "prompt", color: "199 89% 55%" },
  { kind: "ChatModel", label: "llm", color: "262 83% 65%" },
  { kind: "OutputParser", label: "parse", color: "168 76% 50%" },
  { kind: "RunnableParallel", label: "parallel", color: "24 96% 60%" },
  { kind: "RunnableBranch", label: "branch", color: "330 80% 65%" },
  { kind: "Retriever", label: "retrieve", color: "187 92% 60%" },
];

const nid = () => Math.random().toString(36).slice(2, 8);

const toLcel = (nodes: Node[]) => {
  if (nodes.length === 0) return "# drag runnables to compose";
  const chain = nodes
    .map((n) => {
      switch (n.kind) {
        case "PromptTemplate": return "prompt";
        case "ChatModel": return "llm";
        case "OutputParser": return "StrOutputParser()";
        case "Retriever": return "retriever";
        case "RunnableParallel": return "RunnableParallel(ctx=retriever, q=RunnablePassthrough())";
        case "RunnableBranch": return "RunnableBranch((is_faq, faq_chain), default_chain)";
        default: return n.kind.toLowerCase();
      }
    })
    .join(" | ");
  return `chain = ${chain}\nresult = chain.invoke({"question": "..."})`;
};

type Frame = { at: number; node: string; kind: "in" | "out" | "log" | "warn"; text: string };
type CarryType = "str" | "vars" | "prompt" | "aimessage" | "docs" | "dict";
type Carry = { type: CarryType; preview: string; value: unknown };

const short = (s: string, n = 48) => (s.length > n ? s.slice(0, n) + "…" : s);
const previewOf = (c: Carry) => {
  switch (c.type) {
    case "str": return `"${short(String(c.value))}"`;
    case "vars": return `{ question: "${short(String((c.value as { question: string }).question), 32)}" }`;
    case "prompt": return `PromptValue(messages=[HumanMessage("${short(c.preview, 32)}")])`;
    case "aimessage": return `AIMessage("${short(c.preview, 40)}")`;
    case "docs": return `[Doc("§ FUTA 6% on first $7k…"), Doc("IRS Pub 15")]`;
    case "dict": return c.preview;
  }
};

const simulate = (nodes: Node[], question: string): Frame[] => {
  const frames: Frame[] = [];
  let t = 0;
  const push = (node: string, kind: Frame["kind"], text: string, dt = 180) => {
    t += dt;
    frames.push({ at: t, node, kind, text });
  };

  let carry: Carry = { type: "vars", preview: question, value: { question } };
  push("input", "in", `input = ${previewOf(carry)}`, 0);

  for (const n of nodes) {
    push(n.kind, "in", `← ${previewOf(carry)}`);

    switch (n.kind) {
      case "PromptTemplate": {
        const q = carry.type === "vars"
          ? (carry.value as { question: string }).question
          : carry.type === "str" ? String(carry.value) : question;
        if (carry.type !== "vars" && carry.type !== "str") {
          push(n.kind, "warn", `coercing ${carry.type} → vars via .get("question")`, 120);
        }
        const rendered = `Answer concisely.\n\nUser: ${q}`;
        carry = { type: "prompt", preview: rendered, value: rendered };
        push(n.kind, "out", `→ ${previewOf(carry)}`);
        break;
      }
      case "Retriever": {
        const q = carry.type === "str" ? String(carry.value) : question;
        push(n.kind, "log", `similarity search k=4  query="${short(q, 32)}"`, 240);
        carry = { type: "docs", preview: "", value: ["FUTA 6% on first $7k", "IRS Pub 15"] };
        push(n.kind, "out", `→ ${previewOf(carry)}`);
        break;
      }
      case "ChatModel": {
        if (carry.type !== "prompt" && carry.type !== "str") {
          push(n.kind, "warn", `expected PromptValue, got ${carry.type} — coercing to str`, 120);
        }
        const chunks = ["FUTA ", "is 6% ", "on the ", "first $7,000 ", "of each employee's ", "wages."];
        let acc = "";
        for (const c of chunks) {
          acc += c;
          push(n.kind, "out", `token · "${c.trim()}"`, 90);
        }
        carry = { type: "aimessage", preview: acc, value: acc };
        push(n.kind, "out", `→ ${previewOf(carry)}`, 120);
        break;
      }
      case "OutputParser": {
        if (carry.type !== "aimessage") {
          push(n.kind, "warn", `StrOutputParser expects AIMessage, got ${carry.type} — calling str()`, 120);
        }
        const s = carry.type === "aimessage"
          ? String(carry.value)
          : carry.type === "docs"
            ? (carry.value as string[]).join("\n")
            : carry.type === "dict"
              ? JSON.stringify(carry.value)
              : String(carry.preview || carry.value);
        carry = { type: "str", preview: s, value: s };
        push(n.kind, "out", `→ ${previewOf(carry)}`);
        break;
      }
      case "RunnableParallel": {
        push(n.kind, "log", `fan out → { ctx: Retriever, q: Passthrough }`, 200);
        const q = carry.type === "aimessage" || carry.type === "str"
          ? String(carry.value)
          : carry.type === "vars"
            ? (carry.value as { question: string }).question
            : question;
        push(n.kind, "log", `ctx ← retriever.invoke("${short(q, 28)}")`, 220);
        push(n.kind, "log", `q   ← passthrough`, 120);
        const dict = { ctx: ["FUTA 6% on first $7k", "IRS Pub 15"], q };
        carry = {
          type: "dict",
          preview: `{ ctx: [2 docs], q: "${short(q, 24)}" }`,
          value: dict,
        };
        push(n.kind, "out", `→ ${previewOf(carry)}`);
        break;
      }
      case "RunnableBranch": {
        const q = carry.type === "str" || carry.type === "aimessage" ? String(carry.value) : question;
        const isFaq = /rate|what is|how (do|to)/i.test(q);
        push(n.kind, "log", `predicate is_faq("${short(q, 24)}") → ${isFaq}`, 180);
        push(n.kind, "out", `→ ${isFaq ? "faq_chain" : "default_chain"} (passthrough)`);
        break;
      }
      default:
        push(n.kind, "out", `passthrough`);
    }
  }
  push("result", "out", previewOf(carry), 120);
  return frames;
};

export const LangChainComposer = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: nid(), kind: "PromptTemplate" },
    { id: nid(), kind: "ChatModel" },
    { id: nid(), kind: "OutputParser" },
  ]);
  const [question, setQuestion] = useState("What is the FUTA rate for 2025?");
  const [frames, setFrames] = useState<Frame[]>([]);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  const add = (kind: string) => setNodes((n) => [...n, { id: nid(), kind }]);
  const remove = (id: string) => setNodes((n) => n.filter((x) => x.id !== id));

  const stop = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setRunning(false);
  };

  const run = () => {
    stop();
    setFrames([]);
    if (nodes.length === 0) return;
    setRunning(true);
    const plan = simulate(nodes, question);
    plan.forEach((f) => {
      const id = window.setTimeout(() => {
        setFrames((prev) => [...prev, f]);
      }, f.at);
      timers.current.push(id);
    });
    const doneId = window.setTimeout(() => setRunning(false), plan[plan.length - 1].at + 200);
    timers.current.push(doneId);
  };

  return (
    <LabShell
      meta={LABS[8]}
      onReset={() => {
        stop();
        setFrames([]);
        setNodes([
          { id: nid(), kind: "PromptTemplate" },
          { id: nid(), kind: "ChatModel" },
          { id: nid(), kind: "OutputParser" },
        ]);
      }}
    >
      <div className="flex flex-wrap gap-1.5 mb-3">
        {PALETTE.map((p) => (
          <button
            key={p.kind}
            onClick={() => add(p.kind)}
            className="text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors hover:bg-primary/10"
            style={{ borderColor: `hsl(${p.color} / 0.4)`, color: `hsl(${p.color})` }}
          >
            <Plus className="w-3 h-3 inline mr-1" />
            {p.kind}
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-background/50 border border-border/60 p-3 mb-3 min-h-[80px]">
        {nodes.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-4">Empty chain. Add runnables above.</div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {nodes.map((n, i) => {
              const p = PALETTE.find((x) => x.kind === n.kind);
              const isActive = running && frames.length > 0 && frames[frames.length - 1].node === n.kind;
              return (
                <div key={n.id} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "group relative rounded-md px-3 py-2 font-mono text-xs border transition-all",
                      isActive && "ring-2 ring-primary/60 scale-[1.03]"
                    )}
                    style={{
                      borderColor: `hsl(${p?.color ?? "199 89% 55%"} / 0.5)`,
                      background: `hsl(${p?.color ?? "199 89% 55%"} / 0.08)`,
                    }}
                  >
                    <span style={{ color: `hsl(${p?.color ?? "199 89% 55%"})` }}>{n.kind}</span>
                    <button
                      onClick={() => remove(n.id)}
                      className="ml-2 opacity-40 hover:opacity-100"
                      aria-label="Remove"
                    >
                      <X className="w-3 h-3 inline" />
                    </button>
                  </div>
                  {i < nodes.length - 1 && <span className="text-primary/70 font-mono">|</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder='question = "..."'
          className="flex-1 min-w-0 text-[11px] font-mono px-2 py-1.5 rounded-md bg-background/70 border border-border/60 focus:outline-none focus:border-primary/60"
        />
        {running ? (
          <button
            onClick={stop}
            className="text-[11px] font-mono px-3 py-1.5 rounded-md border border-border hover:bg-background inline-flex items-center gap-1"
          >
            <Square className="w-3 h-3" /> Stop
          </button>
        ) : (
          <button
            onClick={run}
            className="text-[11px] font-mono px-3 py-1.5 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1"
          >
            <Play className="w-3 h-3" /> Run LCEL
          </button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-background/70 border border-border/60 p-3 font-mono text-[11px]">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">LCEL</div>
          <pre className="whitespace-pre-wrap text-foreground/90">{toLcel(nodes)}</pre>
        </div>

        <div className="rounded-lg bg-background/70 border border-border/60 p-3 font-mono text-[11px] min-h-[180px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">live output</div>
            <div className={cn("text-[10px]", running ? "text-primary" : "text-muted-foreground")}>
              {running ? "● streaming" : frames.length ? "✓ done" : "idle"}
            </div>
          </div>
          {frames.length === 0 ? (
            <div className="text-muted-foreground text-[11px]">Press Run to stream events.</div>
          ) : (
            <div className="max-h-[220px] overflow-auto space-y-1">
              {frames.map((f, i) => (
                <div key={i} className="flex gap-2 animate-fade-in">
                  <span className="text-muted-foreground/60 shrink-0">{f.at.toString().padStart(4, " ")}ms</span>
                  <span
                    className={cn(
                      "shrink-0 uppercase tracking-wider text-[9px] px-1 py-px rounded",
                      f.kind === "in" && "bg-primary/10 text-primary",
                      f.kind === "out" && "bg-emerald-500/10 text-emerald-500",
                      f.kind === "log" && "bg-muted text-muted-foreground",
                      f.kind === "warn" && "bg-amber-500/15 text-amber-500"
                    )}
                  >
                    {f.kind}
                  </span>
                  <span className="text-foreground/70 shrink-0">{f.node}</span>
                  <span className="text-foreground/90 break-all">{f.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LabShell>
  );
};
