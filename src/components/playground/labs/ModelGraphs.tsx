import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { LabShell } from "@/components/playground/LabShell";
import { LABS } from "@/data/playgroundLabs";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type M = { name: string; speed: number; reasoning: number; cost: number; context: number; color: string };
const MODELS: M[] = [
  { name: "GPT-5",       speed: 55, reasoning: 95, cost: 12,  context: 400, color: "199 89% 55%" },
  { name: "Claude 4.5",  speed: 62, reasoning: 92, cost: 9,   context: 300, color: "262 83% 65%" },
  { name: "Gemini 2.5",  speed: 78, reasoning: 88, cost: 6,   context: 1000, color: "168 76% 50%" },
  { name: "Llama 4",     speed: 90, reasoning: 78, cost: 1,   context: 200, color: "24 96% 60%" },
  { name: "Mistral L2",  speed: 85, reasoning: 74, cost: 2,   context: 128, color: "330 80% 65%" },
];
type Axis = "speed" | "reasoning" | "cost" | "context";
const AXES: { k: Axis; label: string; unit: string; higherBetter: boolean }[] = [
  { k: "speed", label: "Speed", unit: "tok/s", higherBetter: true },
  { k: "reasoning", label: "Reasoning", unit: "score", higherBetter: true },
  { k: "cost", label: "Cost", unit: "$/1M", higherBetter: false },
  { k: "context", label: "Context", unit: "k tok", higherBetter: true },
];

const hslToHex = (hsl: string) => {
  const [h, s, l] = hsl.split(" ").map((v) => parseFloat(v));
  const c = new THREE.Color().setHSL(h / 360, s / 100, l / 100);
  return `#${c.getHexString()}`;
};

const norm = (val: number, lo: number, hi: number) =>
  hi === lo ? 0.5 : (val - lo) / (hi - lo);

const useIsDark = () => {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark;
};

type Theme = {
  gridMajor: string;
  gridMinor: string;
  axisX: string;
  axisY: string;
  axisZ: string;
  labelBg: string;
  ambient: number;
  key: number;
};

const themeFor = (dark: boolean): Theme =>
  dark
    ? {
        gridMajor: "#475569",
        gridMinor: "#1e293b",
        axisX: "#f87171",
        axisY: "#4ade80",
        axisZ: "#60a5fa",
        labelBg: "hsl(222 47% 8% / 0.75)",
        ambient: 0.6,
        key: 1.2,
      }
    : {
        gridMajor: "#94a3b8",
        gridMinor: "#cbd5e1",
        axisX: "#dc2626",
        axisY: "#16a34a",
        axisZ: "#2563eb",
        labelBg: "hsl(0 0% 100% / 0.85)",
        ambient: 0.9,
        key: 0.9,
      };

type Mode = "scatter" | "radar" | "3d";

/* ---------------- 3D scene ---------------- */
const Bubble = ({
  position,
  color,
  size,
  name,
  hovered,
  onHover,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  name: string;
  hovered: boolean;
  onHover: (n: string | null) => void;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.4;
    const target = hovered ? 1.25 : 1;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
  });
  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); onHover(name); }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[size, 40, 40]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.9 : 0.35}
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 1.4, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.15 : 0.06} />
      </mesh>
      <Html center distanceFactor={10} style={{ pointerEvents: "none" }}>
        <div
          className="font-mono text-[10px] whitespace-nowrap px-1.5 py-0.5 rounded"
          style={{
            background: "hsl(var(--background) / 0.7)",
            color,
            border: `1px solid ${color}`,
            transform: `translateY(${-size * 22 - 6}px)`,
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
};

const Axes3D = ({ xLabel, yLabel, zLabel, theme }: { xLabel: string; yLabel: string; zLabel: string; theme: Theme }) => {
  const L = 3;
  return (
    <group>
      <gridHelper args={[L * 2, 10, theme.gridMajor, theme.gridMinor]} position={[0, -L, 0]} />
      <line>
        <bufferGeometry attach="geometry" onUpdate={(g) => g.setFromPoints([new THREE.Vector3(-L, -L, -L), new THREE.Vector3(L, -L, -L)])} />
        <lineBasicMaterial color={theme.axisX} />
      </line>
      <line>
        <bufferGeometry attach="geometry" onUpdate={(g) => g.setFromPoints([new THREE.Vector3(-L, -L, -L), new THREE.Vector3(-L, L, -L)])} />
        <lineBasicMaterial color={theme.axisY} />
      </line>
      <line>
        <bufferGeometry attach="geometry" onUpdate={(g) => g.setFromPoints([new THREE.Vector3(-L, -L, -L), new THREE.Vector3(-L, -L, L)])} />
        <lineBasicMaterial color={theme.axisZ} />
      </line>
      <Html position={[L + 0.4, -L, -L]} center>
        <div className="font-mono text-[10px] whitespace-nowrap" style={{ color: theme.axisX }}>X · {xLabel}</div>
      </Html>
      <Html position={[-L, L + 0.4, -L]} center>
        <div className="font-mono text-[10px] whitespace-nowrap" style={{ color: theme.axisY }}>Y · {yLabel}</div>
      </Html>
      <Html position={[-L, -L, L + 0.4]} center>
        <div className="font-mono text-[10px] whitespace-nowrap" style={{ color: theme.axisZ }}>Z · {zLabel}</div>
      </Html>
    </group>
  );
};

/* ---------------- radar ---------------- */
const Radar = () => {
  const dims: Axis[] = ["speed", "reasoning", "context", "cost"];
  const cx = 200, cy = 130, R = 90;
  const angle = (i: number) => (Math.PI * 2 * i) / dims.length - Math.PI / 2;
  const ranges = dims.map((d) => {
    const vals = MODELS.map((m) => m[d]);
    return [Math.min(...vals), Math.max(...vals)] as [number, number];
  });
  const pt = (m: M, i: number) => {
    const [lo, hi] = ranges[i];
    const d = dims[i];
    // invert cost (lower is better)
    const n = d === "cost" ? 1 - norm(m[d], lo, hi) : norm(m[d], lo, hi);
    const r = 12 + n * (R - 12);
    return [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r] as [number, number];
  };
  return (
    <svg viewBox="0 0 400 260" className="w-full h-[260px]">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={dims.map((_, i) => `${cx + Math.cos(angle(i)) * R * f},${cy + Math.sin(angle(i)) * R * f}`).join(" ")}
          fill="none"
          stroke="hsl(var(--border))"
          strokeOpacity={0.5}
        />
      ))}
      {dims.map((d, i) => (
        <g key={d}>
          <line x1={cx} y1={cy} x2={cx + Math.cos(angle(i)) * R} y2={cy + Math.sin(angle(i)) * R} stroke="hsl(var(--border))" strokeOpacity={0.5} />
          <text
            x={cx + Math.cos(angle(i)) * (R + 14)}
            y={cy + Math.sin(angle(i)) * (R + 14) + 3}
            fontSize={10}
            textAnchor="middle"
            fill="hsl(var(--muted-foreground))"
            fontFamily="monospace"
          >
            {AXES.find((a) => a.k === d)!.label}{d === "cost" ? " ↓" : " ↑"}
          </text>
        </g>
      ))}
      {MODELS.map((m) => (
        <g key={m.name}>
          <polygon
            points={dims.map((_, i) => pt(m, i).join(",")).join(" ")}
            fill={`hsl(${m.color} / 0.12)`}
            stroke={`hsl(${m.color})`}
            strokeWidth={1.4}
          />
          {dims.map((_, i) => {
            const [px, py] = pt(m, i);
            return <circle key={i} cx={px} cy={py} r={2.5} fill={`hsl(${m.color})`} />;
          })}
        </g>
      ))}
    </svg>
  );
};

/* ---------------- component ---------------- */
export const ModelGraphs = () => {
  const [mode, setMode] = useState<Mode>("scatter");
  const [x, setX] = useState<Axis>("cost");
  const [y, setY] = useState<Axis>("reasoning");
  const [z, setZ] = useState<Axis>("speed");
  const [size, setSize] = useState<Axis>("context");
  const [hovered, setHovered] = useState<string | null>(null);
  const isDark = useIsDark();
  const theme = useMemo(() => themeFor(isDark), [isDark]);

  const pts = useMemo(() => {
    const xs = MODELS.map((m) => m[x]);
    const ys = MODELS.map((m) => m[y]);
    const xr = [Math.min(...xs), Math.max(...xs)];
    const yr = [Math.min(...ys), Math.max(...ys)];
    return MODELS.map((m) => ({
      ...m,
      cx: 40 + ((m[x] - xr[0]) / (xr[1] - xr[0] || 1)) * 320,
      cy: 200 - ((m[y] - yr[0]) / (yr[1] - yr[0] || 1)) * 170,
    }));
  }, [x, y]);

  const ranges3d = useMemo(() => {
    const g = (k: Axis) => {
      const v = MODELS.map((m) => m[k]);
      return [Math.min(...v), Math.max(...v)] as [number, number];
    };
    return { x: g(x), y: g(y), z: g(z), s: g(size) };
  }, [x, y, z, size]);

  return (
    <LabShell
      meta={LABS.find((l) => l.id === "model-graphs")!}
      onReset={() => { setMode("scatter"); setX("cost"); setY("reasoning"); setZ("speed"); setSize("context"); }}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono">
        <div className="inline-flex rounded-md border border-border overflow-hidden">
          {(["scatter", "radar", "3d"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 transition-colors ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "scatter" ? "2D scatter" : m === "radar" ? "radar" : "3D spheres"}
            </button>
          ))}
        </div>
        {mode !== "radar" && (
          <>
            <label>X: <select value={x} onChange={(e) => setX(e.target.value as Axis)} className="bg-background border border-border rounded px-1 py-0.5">
              {AXES.map((a) => <option key={a.k} value={a.k}>{a.label}</option>)}
            </select></label>
            <label>Y: <select value={y} onChange={(e) => setY(e.target.value as Axis)} className="bg-background border border-border rounded px-1 py-0.5">
              {AXES.map((a) => <option key={a.k} value={a.k}>{a.label}</option>)}
            </select></label>
          </>
        )}
        {mode === "3d" && (
          <>
            <label>Z: <select value={z} onChange={(e) => setZ(e.target.value as Axis)} className="bg-background border border-border rounded px-1 py-0.5">
              {AXES.map((a) => <option key={a.k} value={a.k}>{a.label}</option>)}
            </select></label>
            <label>Size: <select value={size} onChange={(e) => setSize(e.target.value as Axis)} className="bg-background border border-border rounded px-1 py-0.5">
              {AXES.map((a) => <option key={a.k} value={a.k}>{a.label}</option>)}
            </select></label>
          </>
        )}
      </div>

      <div className="rounded-lg bg-background/60 border border-border/60 p-2">
        {mode === "scatter" && (
          <svg viewBox="0 0 400 240" className="w-full h-[240px]">
            <line x1={40} y1={210} x2={380} y2={210} stroke="hsl(var(--border))" />
            <line x1={40} y1={20} x2={40} y2={210} stroke="hsl(var(--border))" />
            <text x={200} y={232} fontSize={10} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="monospace">
              {AXES.find((a) => a.k === x)!.label} ({AXES.find((a) => a.k === x)!.unit})
            </text>
            <text x={12} y={115} fontSize={10} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="monospace" transform="rotate(-90 12 115)">
              {AXES.find((a) => a.k === y)!.label}
            </text>
            {pts.map((p) => (
              <g key={p.name}>
                <circle cx={p.cx} cy={p.cy} r={9} fill={`hsl(${p.color})`} opacity={0.85}>
                  <animate attributeName="r" values="7;10;7" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <text x={p.cx + 12} y={p.cy + 4} fontSize={10} fill="hsl(var(--foreground))" fontFamily="monospace">{p.name}</text>
              </g>
            ))}
          </svg>
        )}

        {mode === "radar" && <Radar />}

        {mode === "3d" && (
          <div className="h-[320px] w-full relative">
            <Canvas camera={{ position: [6, 5, 7], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
              <ambientLight intensity={theme.ambient} />
              <pointLight position={[6, 8, 6]} intensity={theme.key} />
              <pointLight position={[-6, -4, -6]} intensity={0.4} color={isDark ? "#7dd3fc" : "#fbbf24"} />
              <Suspense fallback={null}>
                <Axes3D
                  xLabel={AXES.find((a) => a.k === x)!.label}
                  yLabel={AXES.find((a) => a.k === y)!.label}
                  zLabel={AXES.find((a) => a.k === z)!.label}
                  theme={theme}
                />
                {MODELS.map((m) => {
                  const nx = norm(m[x], ranges3d.x[0], ranges3d.x[1]);
                  const ny = norm(m[y], ranges3d.y[0], ranges3d.y[1]);
                  const nz = norm(m[z], ranges3d.z[0], ranges3d.z[1]);
                  const ns = norm(m[size], ranges3d.s[0], ranges3d.s[1]);
                  return (
                    <Bubble
                      key={m.name}
                      name={m.name}
                      color={hslToHex(m.color)}
                      size={0.28 + ns * 0.55}
                      position={[nx * 6 - 3, ny * 6 - 3, nz * 6 - 3]}
                      hovered={hovered === m.name}
                      onHover={setHovered}
                    />
                  );
                })}
              </Suspense>
              <OrbitControls enablePan={false} minDistance={5} maxDistance={16} />
            </Canvas>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground bg-background/60 border border-border/50 rounded px-1.5 py-0.5">
              drag · rotate  ·  scroll · zoom  ·  size = {AXES.find((a) => a.k === size)!.label}
            </div>
            {hovered && (() => {
              const m = MODELS.find((mm) => mm.name === hovered)!;
              return (
                <div className="absolute bottom-2 right-2 text-[10px] font-mono bg-background/80 border border-border/60 rounded px-2 py-1">
                  <div style={{ color: hslToHex(m.color) }}>{m.name}</div>
                  <div className="text-muted-foreground">↑ {m.speed} tok/s · ⚡ {m.reasoning}/100</div>
                  <div className="text-muted-foreground">$ {m.cost}/1M · ◧ {m.context}k</div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3 text-[10px] font-mono">
        {MODELS.map((m) => (
          <div
            key={m.name}
            className={`rounded-md border p-2 transition-colors ${
              hovered === m.name ? "border-primary bg-primary/5" : "border-border/60 bg-background/40"
            }`}
            onMouseEnter={() => setHovered(m.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="text-foreground text-[11px] mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${m.color})` }} />{m.name}
            </div>
            <div className="text-muted-foreground">↑ {m.speed} tok/s</div>
            <div className="text-muted-foreground">⚡ {m.reasoning}/100</div>
            <div className="text-muted-foreground">$ {m.cost}/1M</div>
            <div className="text-muted-foreground">◧ {m.context}k</div>
          </div>
        ))}
      </div>
    </LabShell>
  );
};
