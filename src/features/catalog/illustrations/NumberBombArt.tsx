// Minh hoạ hoạt hình cho Bom Số: quả bom ngòi đang cháy cạnh ba ô số, ô giữa là dấu hỏi con số bom kẹp giữa hai số đã đoán
import { Backdrop, CANVAS, DISPLAY, INK, ON_RAMP, SHADOW, Sparkle, inked, ramp } from './art-kit';

const SPARK = 'M 0 -16 L 5 -5 L 16 0 L 5 5 L 0 16 L -5 5 L -16 0 L -5 -5 Z';

function Tile({ x, y, size, label, stop, arrow }: { x: number; y: number; size: number; label: string; stop: number; arrow?: 'up' | 'down' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-size / 2 + 5} y={-size / 2 + 5} width={size} height={size * 0.62} style={SHADOW} />
      <rect x={-size / 2} y={-size / 2} width={size} height={size * 0.62} style={inked(ramp(stop))} strokeWidth={3.5} />
      <text x={arrow ? -8 : 0} y={-size / 2 + size * 0.31} textAnchor="middle" dominantBaseline="central" style={{ fill: ON_RAMP, fontFamily: DISPLAY, fontWeight: 800, fontSize: size * 0.4 }}>
        {label}
      </text>
      {arrow && (
        <path
          d={arrow === 'up' ? 'M 18 -14 L 26 -24 L 34 -14 Z' : 'M 18 -24 L 26 -14 L 34 -24 Z'}
          transform={`translate(0 ${size * 0.08})`}
          style={inked(CANVAS)}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

export default function NumberBombArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Bom Số" className={className}>
      <Backdrop id="number-bomb" dot={2} blob={3} />

      <circle cx={112} cy={130} r={52} style={SHADOW} />
      <circle cx={106} cy={124} r={52} style={{ fill: ON_RAMP, stroke: INK }} strokeWidth={4} />
      <ellipse cx={84} cy={100} rx={13} ry={7} transform="rotate(-30 84 100)" style={{ fill: ramp(0), opacity: 0.55 }} />
      <rect x={92} y={62} width={28} height={14} style={inked(ramp(6))} strokeWidth={4} />
      <text x={106} y={130} textAnchor="middle" dominantBaseline="central" style={{ fill: CANVAS, fontFamily: DISPLAY, fontWeight: 800, fontSize: 44 }}>
        ?
      </text>

      <path d="M 106 62 Q 96 30 136 24" fill="none" style={{ stroke: INK }} strokeWidth={9} strokeLinecap="round" />
      <path d="M 106 62 Q 96 30 136 24" fill="none" style={{ stroke: ramp(1) }} strokeWidth={5} strokeLinecap="round" strokeDasharray="5 4" />
      <g transform="translate(140 22)">
        <path d={SPARK} style={inked(ramp(1))} strokeWidth={2.5} strokeLinejoin="round" />
        <circle r={5} style={{ fill: ramp(2) }} />
      </g>

      <Tile x={238} y={60} size={64} label="82" stop={7} arrow="down" />
      <Tile x={238} y={112} size={78} label="?" stop={1} />
      <Tile x={238} y={170} size={64} label="37" stop={5} arrow="up" />

      <Sparkle x={168} y={52} size={6} stop={2} />
      <Sparkle x={40} y={44} size={8} stop={8} />
      <Sparkle x={292} y={128} size={6} stop={3} />
    </svg>
  );
}
