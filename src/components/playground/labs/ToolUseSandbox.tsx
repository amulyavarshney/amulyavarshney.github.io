import { useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { cn } from "@/lib/utils";

type Provider = "claude" | "chatgpt" | "cowork";

const SCHEMAS: Record<Provider, { label: string; schema: object; call: object; result: object; note: string }> = {
  claude: {
    label: "Claude Tools",
    schema: {
      name: "book_meeting",
      description: "Book a meeting on the user's calendar",
      input_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          when: { type: "string", format: "date-time" },
          attendees: { type: "array", items: { type: "string" } },
        },
        required: ["title", "when"],
      },
    },
    call: {
      type: "tool_use",
      id: "toolu_01A",
      name: "book_meeting",
      input: { title: "RAG review", when: "2026-07-16T15:00Z", attendees: ["a@x.com"] },
    },
    result: {
      type: "tool_result",
      tool_use_id: "toolu_01A",
      content: [{ type: "text", text: "booked · event_id=evt_918" }],
    },
    note: "input_schema is JSON Schema. tool_use blocks live inside assistant messages.",
  },
  chatgpt: {
    label: "ChatGPT Apps",
    schema: {
      type: "function",
      function: {
        name: "book_meeting",
        description: "Book a meeting on the user's calendar",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string" },
            when: { type: "string" },
            attendees: { type: "array", items: { type: "string" } },
          },
          required: ["title", "when"],
        },
      },
    },
    call: {
      role: "assistant",
      tool_calls: [
        {
          id: "call_01A",
          type: "function",
          function: {
            name: "book_meeting",
            arguments: '{"title":"RAG review","when":"2026-07-16T15:00Z","attendees":["a@x.com"]}',
          },
        },
      ],
    },
    result: {
      role: "tool",
      tool_call_id: "call_01A",
      content: "booked · event_id=evt_918",
    },
    note: "arguments are a JSON *string*, not an object. Result comes back as a role:tool message.",
  },
  cowork: {
    label: "Cowork (multi-agent)",
    schema: {
      tool: "book_meeting",
      shared_by: ["planner", "scheduler"],
      requires: { any_of: ["calendar.write"] },
      contract: { title: "string", when: "iso8601", attendees: "string[]" },
    },
    call: {
      frame: "task.tool_call",
      from: "scheduler",
      tool: "book_meeting",
      args: { title: "RAG review", when: "2026-07-16T15:00Z", attendees: ["a@x.com"] },
      trace_id: "trc_918",
    },
    result: {
      frame: "task.tool_result",
      to: "scheduler",
      tool: "book_meeting",
      trace_id: "trc_918",
      output: { event_id: "evt_918", status: "booked" },
    },
    note: "Tools live in a shared registry with capability scopes. Any agent with the scope can call.",
  },
};

export const ToolUseSandbox = () => {
  const [p, setP] = useState<Provider>("claude");
  const s = SCHEMAS[p];

  return (
    <LabShell meta={LABS[9]} onReset={() => setP("claude")}>
      <div className="flex gap-1.5 mb-3">
        {(Object.keys(SCHEMAS) as Provider[]).map((k) => (
          <button
            key={k}
            onClick={() => setP(k)}
            className={cn(
              "text-xs font-mono px-3 py-1 rounded-md border transition-colors",
              p === k
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {SCHEMAS[k].label}
          </button>
        ))}
      </div>

      <div className="grid gap-2 md:grid-cols-3 font-mono text-[11px]">
        {[
          { title: "1 · declare", body: s.schema },
          { title: "2 · model calls", body: s.call },
          { title: "3 · result frame", body: s.result },
        ].map((col) => (
          <div key={col.title} className="rounded-lg bg-background/70 border border-border/60 p-2.5 animate-fade-in">
            <div className="text-[10px] uppercase tracking-widest text-primary mb-1.5">{col.title}</div>
            <pre className="whitespace-pre-wrap break-all text-foreground/85 leading-relaxed">
              {JSON.stringify(col.body, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        <span className="text-primary font-mono">note:</span> {s.note}
      </div>
    </LabShell>
  );
};
