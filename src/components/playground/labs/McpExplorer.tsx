import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

type Msg = { dir: "→" | "←"; body: object };

const SERVERS = [
  {
    id: "fs",
    name: "filesystem",
    tools: [
      { name: "read_file", args: { path: "string" } },
      { name: "write_file", args: { path: "string", content: "string" } },
    ],
  },
  {
    id: "gh",
    name: "github",
    tools: [
      { name: "list_issues", args: { repo: "string", state: "string" } },
      { name: "create_issue", args: { repo: "string", title: "string", body: "string" } },
    ],
  },
  {
    id: "notion",
    name: "notion",
    tools: [
      { name: "search_pages", args: { query: "string" } },
      { name: "append_block", args: { page_id: "string", text: "string" } },
    ],
  },
];

export const McpExplorer = () => {
  const [sid, setSid] = useState(SERVERS[0].id);
  const [log, setLog] = useState<Msg[]>([]);
  const server = SERVERS.find((s) => s.id === sid)!;

  const push = (m: Msg) => setLog((l) => [...l, m].slice(-8));

  const initialize = () => {
    push({ dir: "→", body: { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", clientInfo: { name: "playground" } } } });
    push({ dir: "←", body: { jsonrpc: "2.0", id: 1, result: { serverInfo: { name: server.name, version: "1.0.0" }, capabilities: { tools: {} } } } });
  };
  const listTools = () => {
    push({ dir: "→", body: { jsonrpc: "2.0", id: 2, method: "tools/list" } });
    push({ dir: "←", body: { jsonrpc: "2.0", id: 2, result: { tools: server.tools } } });
  };
  const callTool = (name: string) => {
    push({ dir: "→", body: { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name, arguments: { path: "/tmp/hello.txt" } } } });
    push({ dir: "←", body: { jsonrpc: "2.0", id: 3, result: { content: [{ type: "text", text: "ok" }] } } });
  };

  return (
    <LabShell meta={LABS[4]} onReset={() => setLog([])}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-2 text-xs">
          <div className="rounded-md border border-border/60 p-2">
            <div className="text-[10px] uppercase text-muted-foreground mb-1.5">servers</div>
            <div className="flex flex-col gap-1">
              {SERVERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSid(s.id)}
                  className={cn(
                    "text-left px-2 py-1 rounded font-mono flex justify-between",
                    sid === s.id ? "bg-primary/15 text-primary" : "hover:bg-muted/50"
                  )}
                >
                  <span>mcp://{s.name}</span>
                  <span className="text-[10px] text-muted-foreground">{s.tools.length} tools</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-border/60 p-2 space-y-1.5">
            <button onClick={initialize} className="w-full text-left px-2 py-1 rounded bg-primary/10 text-primary font-mono">
              ▸ initialize
            </button>
            <button onClick={listTools} className="w-full text-left px-2 py-1 rounded bg-primary/10 text-primary font-mono">
              ▸ tools/list
            </button>
            {server.tools.map((t) => (
              <button
                key={t.name}
                onClick={() => callTool(t.name)}
                className="w-full text-left px-2 py-1 rounded bg-secondary/10 text-secondary font-mono"
              >
                ▸ tools/call · {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-background/70 border border-border/60 p-3 font-mono text-[11px] max-h-[300px] overflow-auto space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            wire log · streamable http
          </div>
          {log.length === 0 && <div className="text-muted-foreground">Click a request to see the JSON-RPC frame.</div>}
          {log.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rounded p-2 border animate-fade-in",
                m.dir === "→" ? "border-primary/30 bg-primary/5" : "border-secondary/30 bg-secondary/5"
              )}
            >
              <div className="text-[10px] mb-1">
                <span className={m.dir === "→" ? "text-primary" : "text-secondary"}>{m.dir}</span>{" "}
                {m.dir === "→" ? "client → server" : "server → client"}
              </div>
              <pre className="whitespace-pre-wrap break-all text-foreground/85">
                {JSON.stringify(m.body, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </LabShell>
  );
};
