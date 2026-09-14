import type { DiagramKind } from '@/lib/data/projects';

/**
 * Generated SVG cover art for projects that have no screenshot (case data
 * is sensitive, so there's nothing to photograph). Deterministic per kind —
 * same seed math as the original build script, just ported to JSX.
 */

function rnd(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function FlowDiagram({ accent }: { accent: string }) {
  const layers = 5;
  type Node = { x: number; y: number; l: number; i: number };
  const nodes: Node[] = [];
  for (let l = 0; l < layers; l++) {
    const c = l === 0 ? 1 : l === layers - 1 ? 4 : 3;
    for (let i = 0; i < c; i++) {
      nodes.push({ x: 90 + (l * 620) / (layers - 1), y: 250 + (c === 1 ? 0 : (i / (c - 1) - 0.5) * 300), l, i });
    }
  }
  const paths: React.ReactNode[] = [];
  nodes
    .filter((n) => n.l > 0)
    .forEach((n, k) => {
      const prev = [...nodes].filter((p) => p.l === n.l - 1).sort((a, b) => Math.abs(a.y - n.y) - Math.abs(b.y - n.y))[0];
      if (!prev) return;
      const mx = (prev.x + n.x) / 2;
      const d = `M${prev.x} ${prev.y} C${mx} ${prev.y} ${mx} ${n.y} ${n.x} ${n.y}`;
      const dur = (3 + rnd(k) * 3).toFixed(1);
      paths.push(
        <path key={`p-${k}`} d={d} fill="none" stroke={accent} strokeOpacity=".34" strokeWidth="1.2" />,
        <circle key={`c-${k}`} r="3" fill={accent}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} />
          <animate attributeName="opacity" values="0;1;1;0" dur={`${dur}s`} repeatCount="indefinite" />
        </circle>
      );
    });
  const dots = nodes.map((n, k) => {
    if (n.l === 0)
      return (
        <g key={`n-${k}`}>
          <circle cx={n.x} cy={n.y} r="9" fill={accent} />
          <circle cx={n.x} cy={n.y} r="20" fill={accent} opacity=".14">
            <animate attributeName="r" values="16;30;16" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".2;0;.2" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
      );
    if (n.l === layers - 1)
      return (
        <g key={`n-${k}`}>
          <circle cx={n.x} cy={n.y} r="6" fill="none" stroke="#5eead4" strokeWidth="1.4" />
          <circle cx={n.x} cy={n.y} r="2.4" fill="#5eead4" />
        </g>
      );
    if (rnd(k * 7) < 0.22) return <rect key={`n-${k}`} x={n.x - 6} y={n.y - 6} width="12" height="12" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.2" />;
    return <circle key={`n-${k}`} cx={n.x} cy={n.y} r="4.2" fill="currentColor" fillOpacity=".42" />;
  });
  return (
    <>
      {paths}
      {dots}
    </>
  );
}

function LedgerDiagram({ accent }: { accent: string }) {
  const rows = Array.from({ length: 11 }, (_, i) => {
    const y = 92 + i * 32;
    const w = 150 + rnd(i) * 300;
    return (
      <g key={i}>
        <rect x="90" y={y} width={w} height="7" rx="3.5" fill="currentColor" fillOpacity={(0.09 + rnd(i * 3) * 0.13).toFixed(2)} />
        <rect x="560" y={y} width={40 + rnd(i * 5) * 90} height="7" rx="3.5" fill={i % 4 === 0 ? accent : 'currentColor'} fillOpacity={i % 4 === 0 ? 0.85 : 0.16} />
      </g>
    );
  });
  return (
    <>
      {rows}
      <rect x="90" y="60" width="620" height="1.2" fill={accent} fillOpacity=".6" />
      <rect x="90" y="452" width="620" height="1.2" fill="currentColor" fillOpacity=".2" />
    </>
  );
}

function AutomationDiagram({ accent }: { accent: string }) {
  const parts: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const x = 110 + i * 116;
    parts.push(
      <g key={i}>
        <rect x={x - 34} y="216" width="68" height="68" rx="12" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
        <rect x={x - 34} y="216" width="68" height="68" rx="12" fill={accent} fillOpacity=".07" />
        {i < 5 && (
          <>
            <path d={`M${x + 40} 250h36`} stroke={accent} strokeOpacity=".5" strokeWidth="1.3" />
            <circle r="3.2" fill={accent}>
              <animateMotion dur={`${2.4 + i * 0.2}s`} repeatCount="indefinite" path={`M${x + 40} 250h36`} />
            </circle>
          </>
        )}
        <circle cx={x} cy="250" r={5 + (i % 3)} fill={accent} fillOpacity=".8">
          <animate attributeName="fill-opacity" values=".25;.9;.25" dur="2.6s" begin={`${i * 0.32}s`} repeatCount="indefinite" />
        </circle>
      </g>
    );
  }
  return <>{parts}</>;
}

function ShieldDiagram({ accent }: { accent: string }) {
  const d = 'M400 120l150 58v128c0 96-66 158-150 186-84-28-150-90-150-186V178z';
  return (
    <>
      <path d={d} fill="none" stroke={accent} strokeOpacity=".55" strokeWidth="1.6" />
      <path d={d} fill={accent} fillOpacity=".05" />
      <path
        d="M340 300l42 44 84-92"
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
        strokeDashoffset="200"
      >
        <animate attributeName="stroke-dashoffset" values="200;0" dur="1.6s" begin="0.4s" fill="freeze" />
      </path>
      <circle cx="400" cy="290" r="180" fill="none" stroke="currentColor" strokeOpacity=".14" strokeDasharray="3 9">
        <animateTransform attributeName="transform" type="rotate" from="0 400 290" to="360 400 290" dur="42s" repeatCount="indefinite" />
      </circle>
    </>
  );
}

function RosterDiagram({ accent }: { accent: string }) {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 9; c++) {
      const on = rnd(r * 9 + c) > 0.32;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={120 + c * 64}
          y={140 + r * 56}
          width="46"
          height="38"
          rx="7"
          fill={on ? accent : 'currentColor'}
          fillOpacity={on ? (0.2 + rnd(r + c) * 0.6).toFixed(2) : 0.07}
        />
      );
    }
  }
  return (
    <>
      {cells}
      <rect x="120" y="112" width="574" height="1" fill="currentColor" fillOpacity=".2" />
    </>
  );
}

function PivotDiagram({ accent }: { accent: string }) {
  const bars: React.ReactNode[] = [];
  for (let c = 0; c < 4; c++) {
    const h = 60 + rnd(c) * 210;
    bars.push(
      <rect key={c} x={180 + c * 118} y={400 - h} width="66" height={h} rx="6" fill={accent} fillOpacity={(0.25 + c * 0.18).toFixed(2)}>
        <animate attributeName="height" values={`0;${h}`} dur="1.1s" begin={`${c * 0.12}s`} fill="freeze" />
        <animate attributeName="y" values={`400;${400 - h}`} dur="1.1s" begin={`${c * 0.12}s`} fill="freeze" />
      </rect>
    );
  }
  return (
    <>
      {bars}
      <path d="M140 400h520" stroke="currentColor" strokeOpacity=".25" />
      <path d="M140 120v280" stroke="currentColor" strokeOpacity=".25" />
    </>
  );
}

function MobileDiagram({ accent }: { accent: string }) {
  return (
    <>
      <rect x="322" y="96" width="156" height="308" rx="24" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
      <rect x="334" y="118" width="132" height="264" rx="14" fill={accent} fillOpacity=".07" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect x="350" y={140 + i * 38} width={60 + rnd(i) * 40} height="8" rx="4" fill="currentColor" fillOpacity=".22" />
          <rect x="426" y={140 + i * 38} width="24" height="8" rx="4" fill={accent} fillOpacity=".7" />
        </g>
      ))}
      <circle cx="400" cy="392" r="6" fill="currentColor" fillOpacity=".3" />
    </>
  );
}

function CraftDiagram({ accent }: { accent: string }) {
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx="400" cy="260" r={52 + i * 30} fill="none" stroke={i % 2 ? accent : 'currentColor'} strokeOpacity={i % 2 ? 0.3 : 0.14} strokeWidth="1.1" />
      ))}
      <path d="M180 260h440M400 60v400" stroke="currentColor" strokeOpacity=".12" />
    </>
  );
}

const DIAGRAMS: Record<DiagramKind, (p: { accent: string }) => React.ReactNode> = {
  flow: FlowDiagram,
  ledger: LedgerDiagram,
  automation: AutomationDiagram,
  shield: ShieldDiagram,
  roster: RosterDiagram,
  pivot: PivotDiagram,
  mobile: MobileDiagram,
  craft: CraftDiagram,
};

export function Artwork({ kind, accent = '#ffb020', label = '' }: { kind: DiagramKind; accent?: string; label?: string }) {
  const Diagram = DIAGRAMS[kind] ?? CraftDiagram;
  return (
    <div className="artwork" style={{ ['--art' as string]: accent }}>
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label || 'Abstract diagram'}>
        <Diagram accent={accent} />
      </svg>
      {label && <span className="artwork__tag">{label}</span>}
    </div>
  );
}
