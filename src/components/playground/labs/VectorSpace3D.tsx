import { useEffect, useMemo, useRef, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { RotateCw, ZoomIn } from "lucide-react";

// 80 seed words grouped into clusters — grouping shapes their 3D neighborhood.
const CLUSTERS: Record<string, string[]> = {
  animals: ["cat", "dog", "wolf", "lion", "tiger", "eagle", "shark", "whale", "bear", "fox", "horse", "sheep"],
  food: ["bread", "cheese", "pasta", "sushi", "curry", "pizza", "salad", "steak", "soup", "cake", "rice", "taco"],
  code: ["python", "rust", "typescript", "golang", "kotlin", "haskell", "swift", "scala", "elixir", "ruby", "java", "cpp"],
  ml: ["llm", "embedding", "vector", "rag", "agent", "prompt", "token", "reranker", "cosine", "index"],
  music: ["jazz", "blues", "funk", "opera", "punk", "techno", "gospel", "indie"],
  city: ["paris", "tokyo", "berlin", "milan", "seoul", "dublin", "madrid", "lisbon", "athens", "vienna"],
};

const CLUSTER_COLOR: Record<string, string> = {
  animals: "hsl(24 96% 60%)",
  food: "hsl(330 80% 65%)",
  code: "hsl(199 89% 55%)",
  ml: "hsl(262 83% 65%)",
  music: "hsl(168 76% 50%)",
  city: "hsl(48 96% 60%)",
};

type Word = { w: string; cls: string; x: number; y: number; z: number };

function seed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = (h ^ str.charCodeAt(i)) * 16777619;
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
}

const CLUSTER_CENTERS: Record<string, [number, number, number]> = {
  animals: [-140, 60, 80],
  food: [130, 90, -60],
  code: [-100, -80, -100],
  ml: [120, -70, 90],
  music: [0, 150, 0],
  city: [0, -140, -30],
};

const WORDS: Word[] = Object.entries(CLUSTERS).flatMap(([cls, words]) => {
  const [cx, cy, cz] = CLUSTER_CENTERS[cls];
  return words.map((w) => {
    const rnd = seed(w + cls);
    return {
      w,
      cls,
      x: cx + (rnd() - 0.5) * 90,
      y: cy + (rnd() - 0.5) * 90,
      z: cz + (rnd() - 0.5) * 90,
    };
  });
});

const dist = (a: Word, b: Word, metric: "cosine" | "euclidean") => {
  if (metric === "euclidean") {
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  const dot = a.x * b.x + a.y * b.y + a.z * b.z;
  const na = Math.hypot(a.x, a.y, a.z);
  const nb = Math.hypot(b.x, b.y, b.z);
  return 1 - dot / (na * nb + 1e-6);
};

const similarity = (d: number, metric: "cosine" | "euclidean") =>
  metric === "cosine" ? 1 - d : 1 / (1 + d / 40);

export const VectorSpace3D = () => {
  const [query, setQuery] = useState("wolf");
  const [metric, setMetric] = useState<"cosine" | "euclidean">("cosine");
  const [topK, setTopK] = useState(5);
  const [minSim, setMinSim] = useState(0);
  const [clusterFilter, setClusterFilter] = useState<string | "all">("all");

  // Interactive camera
  const [rotX, setRotX] = useState(-14);
  const [rotY, setRotY] = useState(24);
  const [zoom, setZoom] = useState(1);
  const dragRef = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, rx: rotX, ry: rotY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setRotY(d.ry + (e.clientX - d.x) * 0.4);
    setRotX(Math.max(-80, Math.min(80, d.rx - (e.clientY - d.y) * 0.35)));
  };
  const onPointerUp = () => (dragRef.current = null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.max(0.4, Math.min(2.5, z * (e.deltaY > 0 ? 0.92 : 1.08))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const target = WORDS.find((w) => w.w === query.toLowerCase().trim());
  const ranked = useMemo(() => {
    if (!target) return [] as { w: Word; d: number; sim: number }[];
    return WORDS.filter((w) => w.w !== target.w)
      .map((w) => {
        const d = dist(target, w, metric);
        return { w, d, sim: similarity(d, metric) };
      })
      .sort((a, b) => a.d - b.d);
  }, [target, metric]);

  const neighbors = useMemo(
    () => ranked.filter((r) => r.sim >= minSim).slice(0, topK),
    [ranked, topK, minSim]
  );
  const neighborSet = new Set(neighbors.map((n) => n.w.w));

  const clusters = ["all", ...Object.keys(CLUSTERS)];

  return (
    <LabShell
      meta={LABS[3]}
      onReset={() => {
        setQuery("wolf");
        setTopK(5);
        setMinSim(0);
        setRotX(-14);
        setRotY(24);
        setZoom(1);
        setClusterFilter("all");
      }}
    >
      {/* Controls row 1 */}
      <div className="flex flex-wrap gap-2 mb-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search word (e.g. wolf, sushi, rust)…"
          className="flex-1 min-w-[180px] bg-background/60 border border-border rounded-md px-3 py-1.5 text-sm font-mono"
        />
        <div className="flex rounded-md border border-border overflow-hidden text-xs font-mono">
          {(["cosine", "euclidean"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={
                "px-2.5 py-1.5 " + (metric === m ? "bg-primary text-primary-foreground" : "text-muted-foreground")
              }
            >
              {m}
            </button>
          ))}
        </div>
        <select
          value={clusterFilter}
          onChange={(e) => setClusterFilter(e.target.value as any)}
          className="text-xs font-mono rounded-md border border-border bg-background/60 px-2 py-1.5"
        >
          {clusters.map((c) => (
            <option key={c} value={c}>{c === "all" ? "all clusters" : c}</option>
          ))}
        </select>
      </div>

      {/* Controls row 2 — sliders */}
      <div className="grid gap-2 sm:grid-cols-2 mb-3 text-[11px] font-mono">
        <label className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-muted-foreground">top-k</span>
          <input
            type="range" min={1} max={20} value={topK}
            onChange={(e) => setTopK(+e.target.value)}
            className="flex-1"
          />
          <span className="w-8 text-right">{topK}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-muted-foreground">min sim</span>
          <input
            type="range" min={0} max={1} step={0.01} value={minSim}
            onChange={(e) => setMinSim(+e.target.value)}
            className="flex-1"
          />
          <span className="w-10 text-right">{minSim.toFixed(2)}</span>
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative h-[300px] rounded-lg bg-background/40 border border-border/60 overflow-hidden perspective-1000 cursor-grab active:cursor-grabbing touch-none select-none"
        >
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div
            className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none"
            style={{
              transform: `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: dragRef.current ? "none" : "transform 120ms ease-out",
            }}
          >
            {WORDS.map((w) => {
              const isTarget = target?.w === w.w;
              const isNeighbor = neighborSet.has(w.w);
              const dim = clusterFilter !== "all" && w.cls !== clusterFilter && !isTarget && !isNeighbor;
              return (
                <div
                  key={w.w}
                  className="absolute font-mono text-[10px] px-1 rounded transition-all"
                  style={{
                    transform: `translate3d(${w.x}px, ${-w.y}px, ${w.z}px) translate(-50%, -50%)`,
                    color: isTarget
                      ? "hsl(var(--primary))"
                      : isNeighbor
                      ? "hsl(var(--foreground))"
                      : CLUSTER_COLOR[w.cls],
                    opacity: dim ? 0.1 : isTarget || isNeighbor ? 1 : 0.55,
                    textShadow: isTarget ? "0 0 12px hsl(var(--primary))" : undefined,
                    fontWeight: isTarget || isNeighbor ? 700 : 400,
                    zIndex: Math.round(w.z + 200),
                  }}
                >
                  {w.w}
                </div>
              );
            })}
          </div>

          {/* HUD */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground bg-background/70 backdrop-blur rounded px-2 py-1 border border-border/60">
            <RotateCw className="w-3 h-3" /> drag
            <span className="opacity-50">·</span>
            <ZoomIn className="w-3 h-3" /> scroll
          </div>
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-muted-foreground bg-background/70 backdrop-blur rounded px-2 py-1 border border-border/60">
            zoom {zoom.toFixed(2)}× · rx {Math.round(rotX)}° · ry {Math.round(rotY)}°
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="rounded-md bg-muted/40 p-2 font-mono">
            <div className="flex items-baseline justify-between">
              <div className="text-[10px] uppercase text-muted-foreground">top-{topK} neighbors</div>
              <div className="text-[10px] text-muted-foreground">{neighbors.length} match</div>
            </div>
            {target ? (
              neighbors.length ? (
                <ol className="mt-1 space-y-0.5">
                  {neighbors.map((n, i) => (
                    <li key={n.w.w} className="flex justify-between gap-2">
                      <span className="shrink-0">{i + 1}. {n.w.w}</span>
                      <span className="text-muted-foreground">{n.sim.toFixed(3)}</span>
                      <span style={{ color: CLUSTER_COLOR[n.w.cls] }} className="w-14 text-right">{n.w.cls}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="mt-1 text-muted-foreground">No neighbors above min-sim threshold.</div>
              )
            ) : (
              <div className="mt-1 text-muted-foreground">Word not in dictionary. Try one of the labeled words.</div>
            )}
          </div>
          <div className="rounded-md border border-border/60 p-2 text-[11px] text-muted-foreground">
            Drag to orbit, scroll to zoom. Six clusters live here — similar meaning ends up nearby.
          </div>
        </div>
      </div>
    </LabShell>
  );
};
