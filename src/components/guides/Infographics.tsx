/**
 * Reusable animated SVG infographics for blog guides.
 * Theme-aware (uses CSS custom properties), lightweight, interactive on hover.
 */
import { useState } from "react";

/* ----------------------------- Shared helpers ----------------------------- */

const Defs = () => (
  <defs>
    <linearGradient id="ig-primary" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
      <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.9" />
    </linearGradient>
    <linearGradient id="ig-glow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
      <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
    </linearGradient>
    <filter id="ig-blur"><feGaussianBlur stdDeviation="2" /></filter>
    <marker id="ig-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" />
    </marker>
  </defs>
);

export const Figure = ({ caption, children }: { caption: string; children: React.ReactNode }) => (
  <figure className="my-6 rounded-xl overflow-hidden border border-border/60 bg-gradient-to-br from-primary/5 to-secondary/5">
    <div className="p-4 md:p-6">{children}</div>
    <figcaption className="text-xs text-muted-foreground text-center px-3 py-2 border-t border-border/60 bg-background/40">
      {caption}
    </figcaption>
  </figure>
);

/* -------------------------- 1. Evaluation pipeline ------------------------ */

export const EvalPipelineDiagram = () => {
  const [hover, setHover] = useState<number | null>(null);
  const steps = [
    { x: 60, label: "Golden Set", sub: "50–100 tasks" },
    { x: 220, label: "Agent Run", sub: "LangGraph" },
    { x: 380, label: "Trace", sub: "Langfuse" },
    { x: 540, label: "Judges", sub: "rubric · exact · LLM" },
    { x: 700, label: "Scores", sub: "pass / fail / regress" },
  ];
  return (
    <Figure caption="The evaluation loop: golden tasks flow through the agent, get traced, judged, and scored.">
      <svg viewBox="0 0 800 220" className="w-full h-auto" role="img" aria-label="Evaluation pipeline diagram">
        <Defs />
        {/* connectors */}
        {steps.slice(0, -1).map((s, i) => (
          <g key={i}>
            <line
              x1={s.x + 50} y1={110} x2={steps[i + 1].x - 10} y2={110}
              stroke="hsl(var(--border))" strokeWidth="2" markerEnd="url(#ig-arrow)"
            />
            <circle r="3" fill="url(#ig-primary)">
              <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite"
                path={`M ${s.x + 50} 110 L ${steps[i + 1].x - 10} 110`} />
            </circle>
          </g>
        ))}
        {/* nodes */}
        {steps.map((s, i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
            <rect
              x={s.x - 10} y={80} width={100} height={60} rx={12}
              fill={hover === i ? "url(#ig-primary)" : "hsl(var(--card))"}
              stroke="hsl(var(--primary))" strokeWidth={hover === i ? "2" : "1.5"}
              opacity={hover === null || hover === i ? 1 : 0.6}
            />
            <text x={s.x + 40} y={106} textAnchor="middle" fontSize="12" fontWeight="600"
              fill={hover === i ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}>
              {s.label}
            </text>
            <text x={s.x + 40} y={124} textAnchor="middle" fontSize="9"
              fill={hover === i ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))"}>
              {s.sub}
            </text>
          </g>
        ))}
        {/* feedback loop */}
        <path d="M 750 140 Q 750 200 400 200 Q 60 200 60 140" fill="none"
          stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" markerEnd="url(#ig-arrow)" />
        <text x="400" y="195" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
          low-scoring traces → new golden cases
        </text>
      </svg>
    </Figure>
  );
};

/* --------------------- 2. Trajectory grading visualization ---------------- */

export const TrajectoryGraph = () => {
  const nodes = [
    { id: "start", x: 60, y: 100, label: "Start" },
    { id: "router", x: 200, y: 100, label: "Router" },
    { id: "rag", x: 340, y: 50, label: "RAG" },
    { id: "tool", x: 340, y: 150, label: "Tool" },
    { id: "critic", x: 480, y: 100, label: "Critic" },
    { id: "answer", x: 620, y: 100, label: "Answer" },
  ];
  const edges = [
    { from: "start", to: "router", ok: true },
    { from: "router", to: "rag", ok: true, score: "0.94" },
    { from: "router", to: "tool", ok: false, score: "0.42" },
    { from: "rag", to: "critic", ok: true },
    { from: "tool", to: "critic", ok: false },
    { from: "critic", to: "answer", ok: true },
  ];
  const node = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <Figure caption="Trajectory grading scores each hop, not just the final answer — bad routes light up red.">
      <svg viewBox="0 0 700 220" className="w-full h-auto" role="img" aria-label="Agent trajectory graph">
        <Defs />
        {edges.map((e, i) => {
          const a = node(e.from), b = node(e.to);
          const color = e.ok ? "hsl(var(--primary))" : "hsl(var(--destructive))";
          return (
            <g key={i}>
              <line x1={a.x + 22} y1={a.y} x2={b.x - 22} y2={b.y} stroke={color} strokeWidth="2"
                strokeDasharray={e.ok ? "0" : "4 3"} markerEnd="url(#ig-arrow)" opacity="0.85" />
              {e.score && (
                <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" fontSize="10"
                  fill={color} fontWeight="600">{e.score}</text>
              )}
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="22" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="hsl(var(--foreground))">{n.label}</text>
          </g>
        ))}
        {/* pulse */}
        <circle r="4" fill="hsl(var(--primary))">
          <animateMotion dur="4s" repeatCount="indefinite"
            path="M 60 100 L 200 100 L 340 50 L 480 100 L 620 100" />
        </circle>
        <text x="350" y="205" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
          each edge scored on tool-choice · argument validity · grounding
        </text>
      </svg>
    </Figure>
  );
};

/* --------------------- 3. Judge rubric bar comparison --------------------- */

export const RubricChart = () => {
  const rows = [
    { label: "Correctness", val: 0.92 },
    { label: "Grounding", val: 0.87 },
    { label: "Tool Use", val: 0.74 },
    { label: "Safety", val: 0.98 },
    { label: "Concision", val: 0.61 },
  ];
  return (
    <Figure caption="Split judgement into narrow, orthogonal rubrics instead of one 'is this good' prompt.">
      <svg viewBox="0 0 600 220" className="w-full h-auto" role="img" aria-label="Judge rubric bar chart">
        <Defs />
        {rows.map((r, i) => {
          const y = 20 + i * 38;
          const w = r.val * 380;
          const color = r.val >= 0.8 ? "hsl(var(--primary))" : r.val >= 0.65 ? "hsl(var(--secondary))" : "hsl(var(--destructive))";
          return (
            <g key={r.label}>
              <text x="10" y={y + 18} fontSize="12" fill="hsl(var(--foreground))">{r.label}</text>
              <rect x="130" y={y} width="380" height="24" rx="4" fill="hsl(var(--muted))" opacity="0.4" />
              <rect x="130" y={y} width={w} height="24" rx="4" fill={color}>
                <animate attributeName="width" from="0" to={w} dur="1.2s" fill="freeze" />
              </rect>
              <text x={520} y={y + 18} fontSize="12" fontWeight="600" fill="hsl(var(--foreground))">
                {(r.val * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
};

/* --------------------- 4. Career skill radar / hexagon -------------------- */

export const SkillRadar = () => {
  const axes = ["Python", "LLM Systems", "RAG", "Agents", "LLMOps", "Cloud"];
  const values = [0.95, 0.88, 0.82, 0.78, 0.85, 0.72];
  const cx = 200, cy = 200, r = 140;
  const point = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v] as const;
  };
  const path = values.map((v, i) => point(i, v).join(",")).join(" ");
  return (
    <Figure caption="The mid-level AI engineer skill profile — depth over breadth in every axis.">
      <svg viewBox="0 0 400 400" className="w-full h-auto max-w-md mx-auto" role="img" aria-label="Skill radar chart">
        <Defs />
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon key={s}
            points={axes.map((_, i) => point(i, s).join(",")).join(" ")}
            fill="none" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.5" />
        ))}
        {axes.map((_, i) => (
          <line key={i} x1={cx} y1={cy} x2={point(i, 1)[0]} y2={point(i, 1)[1]}
            stroke="hsl(var(--border))" strokeWidth="1" opacity="0.4" />
        ))}
        <polygon points={path} fill="url(#ig-primary)" fillOpacity="0.3" stroke="hsl(var(--primary))" strokeWidth="2">
          <animate attributeName="fill-opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
        </polygon>
        {axes.map((a, i) => {
          const [x, y] = point(i, 1.15);
          return (
            <text key={a} x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="600" fill="hsl(var(--foreground))">{a}</text>
          );
        })}
        {values.map((v, i) => {
          const [x, y] = point(i, v);
          return <circle key={i} cx={x} cy={y} r="4" fill="hsl(var(--primary))" />;
        })}
      </svg>
    </Figure>
  );
};

/* --------------------- 5. Qdrant architecture diagram --------------------- */

export const QdrantArchDiagram = () => {
  const [layer, setLayer] = useState<number | null>(null);
  return (
    <Figure caption="Singleton AsyncQdrantClient over gRPC: one channel per worker, injected via Depends.">
      <svg viewBox="0 0 800 300" className="w-full h-auto" role="img" aria-label="Qdrant + FastAPI architecture">
        <Defs />
        {[
          { x: 40, label: "Client", sub: "React / SDK" },
          { x: 220, label: "FastAPI", sub: "route + Depends" },
          { x: 400, label: "AsyncQdrantClient", sub: "singleton" },
          { x: 620, label: "Qdrant", sub: "gRPC :6334" },
        ].map((n, i) => (
          <g key={i}
            onMouseEnter={() => setLayer(i)} onMouseLeave={() => setLayer(null)}
            style={{ cursor: "pointer" }}>
            <rect x={n.x} y={110} width={140} height={80} rx={12}
              fill={layer === i ? "url(#ig-primary)" : "hsl(var(--card))"}
              stroke="hsl(var(--primary))" strokeWidth={layer === i ? "2" : "1.5"} />
            <text x={n.x + 70} y={145} textAnchor="middle" fontSize="14" fontWeight="600"
              fill={layer === i ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}>{n.label}</text>
            <text x={n.x + 70} y={165} textAnchor="middle" fontSize="10"
              fill={layer === i ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))"}>{n.sub}</text>
          </g>
        ))}
        {/* arrows */}
        {[180, 360, 540].map((x, i) => (
          <g key={i}>
            <line x1={x} y1={150} x2={x + 40} y2={150} stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#ig-arrow)" />
            <circle r="3" fill="hsl(var(--primary))">
              <animateMotion dur={`${1.4 + i * 0.2}s`} repeatCount="indefinite" path={`M ${x} 150 L ${x + 40} 150`} />
            </circle>
          </g>
        ))}
        {/* lifespan boundary */}
        <rect x="380" y="80" width="180" height="140" rx="14" fill="none"
          stroke="hsl(var(--secondary))" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
        <text x="470" y="72" textAnchor="middle" fontSize="11" fill="hsl(var(--secondary))" fontWeight="600">
          FastAPI lifespan
        </text>
        {/* payload sizes */}
        <text x="400" y="250" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
          gRPC binary protobuf → ~3–5× smaller payload · 20–40% lower p95 vs REST
        </text>
      </svg>
    </Figure>
  );
};

/* ---------------------- 6. Regression test heatmap ------------------------ */

export const RegressionHeatmap = () => {
  const cases = 10, runs = 6;
  // deterministic pseudo-random
  const cell = (r: number, c: number) => {
    const v = Math.abs(Math.sin((r + 1) * (c + 1) * 12.9898)) % 1;
    return v;
  };
  return (
    <Figure caption="CI regression heatmap: rows are golden cases, columns are runs. Red = drop from baseline.">
      <svg viewBox="0 0 620 260" className="w-full h-auto" role="img" aria-label="Regression heatmap">
        <Defs />
        <text x="10" y="20" fontSize="11" fill="hsl(var(--muted-foreground))">case</text>
        {Array.from({ length: runs }).map((_, c) => (
          <text key={c} x={100 + c * 80 + 30} y="20" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
            run {c + 1}
          </text>
        ))}
        {Array.from({ length: cases }).map((_, r) => (
          <g key={r}>
            <text x="10" y={50 + r * 20 + 12} fontSize="10" fill="hsl(var(--foreground))">#{r + 1}</text>
            {Array.from({ length: runs }).map((_, c) => {
              const v = cell(r, c);
              const good = v > 0.35;
              const color = good ? `hsl(var(--primary))` : `hsl(var(--destructive))`;
              const opacity = good ? 0.35 + v * 0.6 : 0.55 + (1 - v) * 0.4;
              return (
                <rect key={c} x={100 + c * 80} y={50 + r * 20} width={70} height={16} rx={2}
                  fill={color} opacity={opacity}>
                  <animate attributeName="opacity" from="0" to={opacity} dur="0.6s"
                    begin={`${(r * runs + c) * 0.03}s`} fill="freeze" />
                </rect>
              );
            })}
          </g>
        ))}
      </svg>
    </Figure>
  );
};

/* -------------------- 7. Interview stage funnel --------------------------- */

export const InterviewFunnel = () => {
  const stages = [
    { label: "Applications", w: 640, sub: "100%" },
    { label: "Recruiter Screen", w: 520, sub: "~40%" },
    { label: "Coding Round", w: 400, sub: "~25%" },
    { label: "System Design", w: 280, sub: "~15%" },
    { label: "Portfolio Deep-Dive", w: 180, sub: "~8%" },
    { label: "Offer", w: 100, sub: "~3%" },
  ];
  return (
    <Figure caption="The AI engineer hiring funnel — system design and portfolio deep-dive are where most candidates drop.">
      <svg viewBox="0 0 700 340" className="w-full h-auto" role="img" aria-label="Interview funnel">
        <Defs />
        {stages.map((s, i) => {
          const y = 20 + i * 50;
          const x = (700 - s.w) / 2;
          return (
            <g key={s.label}>
              <rect x={x} y={y} width={s.w} height={38} rx={6} fill="url(#ig-primary)" opacity={0.35 + i * 0.1}>
                <animate attributeName="width" from="0" to={s.w} dur="0.7s" begin={`${i * 0.15}s`} fill="freeze" />
              </rect>
              <text x="350" y={y + 24} textAnchor="middle" fontSize="13" fontWeight="600" fill="hsl(var(--foreground))">
                {s.label}
              </text>
              <text x="350" y={y + 38} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{s.sub}</text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
};

/* -------------------- 8. Metrics KPI trio (animated counters) ------------- */

export const MetricsKPIs = () => {
  const kpis = [
    { label: "Task Success", value: "94%", sub: "golden set" },
    { label: "p95 Latency", value: "1.8s", sub: "per task" },
    { label: "Cost / Task", value: "$0.021", sub: "successful only" },
    { label: "Grounding", value: "0.91", sub: "faithfulness" },
  ];
  return (
    <Figure caption="The dashboard that predicts production quality — small, defensible, actionable.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={k.label}
            className="rounded-xl border border-border/60 bg-background/60 p-4 text-center hover:border-primary/60 hover:scale-[1.03] transition-all"
            style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{k.label}</div>
            <div className="text-2xl md:text-3xl font-display font-bold gradient-text">{k.value}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{k.sub}</div>
          </div>
        ))}
      </div>
    </Figure>
  );
};

/* -------------------- 9. Latency comparison bar --------------------------- */

export const LatencyComparison = () => {
  const rows = [
    { label: "REST + JSON", p50: 42, p95: 118, color: "hsl(var(--destructive))" },
    { label: "gRPC + protobuf", p50: 18, p95: 68, color: "hsl(var(--primary))" },
  ];
  const max = 150;
  return (
    <Figure caption="Measured 1024-dim vector search — gRPC halves p50 and drops p95 by ~40% under load.">
      <svg viewBox="0 0 600 200" className="w-full h-auto" role="img" aria-label="REST vs gRPC latency">
        <Defs />
        {rows.map((r, i) => {
          const y = 30 + i * 80;
          return (
            <g key={r.label}>
              <text x="10" y={y - 6} fontSize="12" fontWeight="600" fill="hsl(var(--foreground))">{r.label}</text>
              {/* p50 */}
              <rect x="140" y={y} width={(r.p50 / max) * 400} height={22} rx={4} fill={r.color} opacity="0.5">
                <animate attributeName="width" from="0" to={(r.p50 / max) * 400} dur="1s" fill="freeze" />
              </rect>
              <text x={150 + (r.p50 / max) * 400} y={y + 15} fontSize="10" fill="hsl(var(--foreground))">p50 {r.p50}ms</text>
              {/* p95 */}
              <rect x="140" y={y + 30} width={(r.p95 / max) * 400} height={22} rx={4} fill={r.color}>
                <animate attributeName="width" from="0" to={(r.p95 / max) * 400} dur="1s" fill="freeze" />
              </rect>
              <text x={150 + (r.p95 / max) * 400} y={y + 45} fontSize="10" fill="hsl(var(--foreground))">p95 {r.p95}ms</text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
};

/* -------------------- 10. Hero orbital / neural banner -------------------- */

export const HeroBanner = ({ label }: { label: string }) => (
  <Figure caption={label}>
    <svg viewBox="0 0 800 260" className="w-full h-auto" role="img" aria-label={label}>
      <Defs />
      {/* animated grid */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 26} x2="800" y2={i * 26} stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="260" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
      ))}
      {/* orbits */}
      {[60, 100, 140].map((r, i) => (
        <circle key={r} cx="400" cy="130" r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity={0.6 - i * 0.15} strokeDasharray="4 4">
          <animateTransform attributeName="transform" type="rotate" from={`0 400 130`} to={`${i % 2 ? -360 : 360} 400 130`} dur={`${20 + i * 10}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* orbit nodes */}
      {[
        { r: 60, count: 3 },
        { r: 100, count: 5 },
        { r: 140, count: 7 },
      ].map(({ r, count }, ri) => (
        <g key={r}>
          <animateTransform attributeName="transform" type="rotate" from={`0 400 130`} to={`${ri % 2 ? -360 : 360} 400 130`} dur={`${20 + ri * 10}s`} repeatCount="indefinite" />
          {Array.from({ length: count }).map((_, i) => {
            const a = (Math.PI * 2 * i) / count;
            return <circle key={i} cx={400 + Math.cos(a) * r} cy={130 + Math.sin(a) * r} r="4" fill="url(#ig-primary)" />;
          })}
        </g>
      ))}
      {/* core */}
      <circle cx="400" cy="130" r="24" fill="url(#ig-primary)">
        <animate attributeName="r" values="22;28;22" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="130" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4">
        <animate attributeName="r" values="30;60;30" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  </Figure>
);
