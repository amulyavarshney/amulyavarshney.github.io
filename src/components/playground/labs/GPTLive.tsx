import { useEffect, useRef, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { Mic, Play, Square } from "lucide-react";

const META = LABS.find((l) => l.id === "gpt-live")!;

type Event =
  | { t: number; kind: "input"; text: string }
  | { t: number; kind: "delta"; text: string }
  | { t: number; kind: "tool"; text: string }
  | { t: number; kind: "audio"; text: string }
  | { t: number; kind: "barge"; text: string }
  | { t: number; kind: "done"; text: string };

const SCRIPT: Omit<Event, "t">[] = [
  { kind: "input", text: "user: what's the weather in Tokyo tonight?" },
  { kind: "audio", text: "audio.chunk received (240ms)" },
  { kind: "delta", text: "Let me check that" },
  { kind: "tool", text: "weather.get({ city: 'Tokyo' })" },
  { kind: "tool", text: "→ 18°C, clear, wind 8km/h" },
  { kind: "delta", text: "Tokyo tonight looks clear," },
  { kind: "delta", text: " around 18 degrees with light wind." },
  { kind: "barge", text: "user interrupted mid-response" },
  { kind: "input", text: "user: in fahrenheit?" },
  { kind: "delta", text: "That's about 64°F." },
  { kind: "done", text: "response.completed" },
];

const COLOR: Record<Event["kind"], string> = {
  input: "text-primary",
  delta: "text-foreground",
  tool: "text-amber-500",
  audio: "text-muted-foreground",
  barge: "text-destructive",
  done: "text-emerald-500",
};

export const GPTLive = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [running, setRunning] = useState(false);
  const [transcript, setTranscript] = useState("");
  const tRef = useRef<number>(0);

  const run = async () => {
    setRunning(true);
    setEvents([]);
    setTranscript("");
    tRef.current = performance.now();
    for (const step of SCRIPT) {
      await new Promise((r) => setTimeout(r, step.kind === "delta" ? 220 : 380));
      const ev: Event = { ...step, t: Math.round(performance.now() - tRef.current) };
      setEvents((cur) => [...cur, ev]);
      if (ev.kind === "delta") setTranscript((s) => s + ev.text);
      if (ev.kind === "barge") setTranscript((s) => s + " ⏸ ");
    }
    setRunning(false);
  };

  const stop = () => setRunning(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const draw = () => {
      const w = c.width, h = c.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "hsl(var(--primary))";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const now = performance.now() / 220;
      for (let x = 0; x < w; x++) {
        const amp = running ? 12 : 2;
        const y = h / 2 + Math.sin(x / 8 + now) * amp * (0.6 + 0.4 * Math.sin(x / 40));
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return (
    <LabShell meta={META} onReset={() => { setEvents([]); setTranscript(""); }}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5">
          <Mic className={"w-3.5 h-3.5 " + (running ? "text-primary animate-pulse" : "text-muted-foreground")} />
          <canvas ref={canvasRef} width={140} height={22} className="rounded" />
        </div>
        {!running ? (
          <button
            onClick={run}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-mono"
          >
            <Play className="w-3.5 h-3.5" /> Start session
          </button>
        ) : (
          <button
            onClick={stop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-mono"
          >
            <Square className="w-3.5 h-3.5" /> Stop
          </button>
        )}
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">
          WebSocket · gpt-4o-realtime
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="rounded-lg border border-border/60 bg-background/70 p-3 font-mono text-[11px] min-h-[220px] max-h-[280px] overflow-y-auto space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">event stream</div>
          {events.length === 0 && <div className="text-muted-foreground">no events yet.</div>}
          {events.map((e, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-muted-foreground w-14 shrink-0">{e.t}ms</span>
              <span className={"uppercase w-14 shrink-0 " + COLOR[e.kind]}>{e.kind}</span>
              <span className="whitespace-pre-wrap">{e.text}</span>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-background/40 p-3 min-h-[220px]">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">live transcript</div>
          <p className="text-sm leading-relaxed">
            {transcript || <span className="text-muted-foreground">waiting for tokens…</span>}
            {running && <span className="inline-block w-2 h-4 align-middle bg-primary/70 ml-0.5 animate-pulse" />}
          </p>
        </div>
      </div>
    </LabShell>
  );
};
