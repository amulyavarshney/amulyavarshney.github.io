import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * CSS-3D concept map of the modern AI engineering stack.
 * Nodes float on a rotating sphere; edges connect siblings.
 * Click a node to highlight its neighbors.
 */

type Node = {
  id: string;
  label: string;
  ring: "core" | "protocol" | "framework" | "tool";
  // spherical coords (deg)
  lat: number;
  lon: number;
  linksTo?: string[];
};

const NODES: Node[] = [
  { id: "llm", label: "LLM", ring: "core", lat: 0, lon: 0, linksTo: ["prompt", "rag", "agents"] },
  { id: "prompt", label: "Prompt", ring: "core", lat: -20, lon: 55, linksTo: ["llm", "cot"] },
  { id: "rag", label: "RAG", ring: "core", lat: 15, lon: -60, linksTo: ["llm", "vectors", "rerank"] },
  { id: "agents", label: "Agents", ring: "core", lat: 30, lon: 120, linksTo: ["llm", "langgraph", "a2a"] },
  { id: "cot", label: "CoT", ring: "core", lat: -45, lon: 90, linksTo: ["prompt"] },
  { id: "vectors", label: "Embeddings", ring: "core", lat: 40, lon: -110, linksTo: ["rag"] },
  { id: "rerank", label: "Reranker", ring: "core", lat: -10, lon: -140, linksTo: ["rag"] },

  { id: "mcp", label: "MCP", ring: "protocol", lat: 55, lon: 30, linksTo: ["tools", "agents"] },
  { id: "a2a", label: "A2A", ring: "protocol", lat: -55, lon: 150, linksTo: ["agents"] },
  { id: "a2ui", label: "A2UI", ring: "protocol", lat: -35, lon: -30, linksTo: ["agents"] },

  { id: "langgraph", label: "LangGraph", ring: "framework", lat: 20, lon: 170, linksTo: ["agents"] },
  { id: "langchain", label: "LangChain", ring: "framework", lat: 65, lon: -70, linksTo: ["llm", "rag"] },

  { id: "tools", label: "Tools", ring: "tool", lat: -65, lon: 0, linksTo: ["mcp", "claude", "gpt"] },
  { id: "claude", label: "Claude Tools", ring: "tool", lat: -50, lon: -80, linksTo: ["tools"] },
  { id: "gpt", label: "ChatGPT Apps", ring: "tool", lat: -25, lon: -170, linksTo: ["tools"] },
  { id: "cowork", label: "Cowork", ring: "tool", lat: 5, lon: 40, linksTo: ["agents"] },
];

const RING_COLOR: Record<Node["ring"], string> = {
  core: "hsl(var(--primary))",
  protocol: "hsl(var(--secondary))",
  framework: "hsl(var(--accent))",
  tool: "hsl(var(--primary-glow))",
};

const R = 180; // sphere radius in px

const toXYZ = (latDeg: number, lonDeg: number) => {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return {
    x: R * Math.cos(lat) * Math.cos(lon),
    y: R * Math.sin(lat),
    z: R * Math.cos(lat) * Math.sin(lon),
  };
};

export const ConceptMap3D = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(-12);
  const [active, setActive] = useState<string | null>("llm");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      setRotY((y) => y + dt * 0.012);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const activeNode = NODES.find((n) => n.id === active);
  const activeNeighbors = new Set(activeNode?.linksTo ?? []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] perspective-1000 select-none">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="absolute inset-0 hero-bg" aria-hidden />

      {/* Legend */}
      <div className="absolute top-3 left-3 z-10 glass rounded-lg px-3 py-2 text-[10px] font-mono space-y-1">
        {Object.entries(RING_COLOR).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: v }} />
            <span className="uppercase tracking-wider text-muted-foreground">{k}</span>
          </div>
        ))}
      </div>

      {/* Info card */}
      {activeNode && (
        <div className="absolute top-3 right-3 z-10 glass rounded-lg px-3 py-2 text-xs max-w-[180px]">
          <div className="font-mono text-primary text-[10px] uppercase tracking-widest">
            {activeNode.ring}
          </div>
          <div className="font-semibold text-sm">{activeNode.label}</div>
          <div className="text-muted-foreground text-[11px] mt-1">
            Click nodes to explore neighbors.
          </div>
        </div>
      )}

      <div
        ref={wrapRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <div
          className="preserve-3d"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            width: 0,
            height: 0,
          }}
        >
          {/* Edges as thin planes */}
          <svg
            width={R * 2.4}
            height={R * 2.4}
            viewBox={`${-R * 1.2} ${-R * 1.2} ${R * 2.4} ${R * 2.4}`}
            style={{
              position: "absolute",
              left: -R * 1.2,
              top: -R * 1.2,
              transform: "translateZ(0)",
              pointerEvents: "none",
              opacity: 0.5,
            }}
          >
            {NODES.flatMap((n) =>
              (n.linksTo ?? []).map((tid) => {
                const t = NODES.find((x) => x.id === tid);
                if (!t) return null;
                const a = toXYZ(n.lat, n.lon);
                const b = toXYZ(t.lat, t.lon);
                const highlight = active && (active === n.id || active === tid);
                return (
                  <line
                    key={`${n.id}-${tid}`}
                    x1={a.x}
                    y1={-a.y}
                    x2={b.x}
                    y2={-b.y}
                    stroke={highlight ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                    strokeWidth={highlight ? 1.2 : 0.5}
                    strokeOpacity={highlight ? 0.9 : 0.35}
                  />
                );
              })
            )}
          </svg>

          {NODES.map((n) => {
            const { x, y, z } = toXYZ(n.lat, n.lon);
            const isActive = active === n.id;
            const isNeighbor = activeNeighbors.has(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setActive(n.id)}
                className="absolute rounded-full text-[10px] font-mono whitespace-nowrap px-2 py-1 glass transition-transform"
                style={{
                  transform: `translate3d(${x}px, ${-y}px, ${z}px) translate(-50%, -50%)`,
                  left: 0,
                  top: 0,
                  borderColor: isActive
                    ? RING_COLOR[n.ring]
                    : isNeighbor
                    ? "hsl(var(--primary) / 0.6)"
                    : undefined,
                  boxShadow: isActive
                    ? `0 0 24px ${RING_COLOR[n.ring]}`
                    : undefined,
                  color: isActive ? RING_COLOR[n.ring] : undefined,
                  zIndex: Math.round(z + R),
                  opacity: 0.6 + (z + R) / (R * 3),
                }}
              >
                {n.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
