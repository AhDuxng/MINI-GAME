// Minh hoạ hoạt hình cho Xí ngầu cạn ly: hai viên xí ngầu đang lộn nhào giữa hai cốc bia sủi bọt
import { Backdrop, INK, ON_RAMP, SHADOW, Sparkle, inked, ramp } from './art-kit';

const FOAM = ramp(0);

const PIPS: Record<number, [number, number][]> = {
  3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
};

interface DieProps {
  x: number;
  y: number;
  size: number;
  rotate: number;
  value: 3 | 5;
  stop: number;
}

function Die({ x, y, size, rotate, value, stop }: DieProps) {
  const depth = size * 0.3;
  const top = `0,0 ${size},0 ${size + depth},${-depth} ${depth},${-depth}`;
  const side = `${size},0 ${size + depth},${-depth} ${size + depth},${size - depth} ${size},${size}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <polygon points={top} style={inked(ramp(stop))} strokeWidth={3} strokeLinejoin="round" />
      <polygon points={side} style={inked(ramp(stop))} strokeWidth={3} strokeLinejoin="round" />
      <polygon points={side} style={{ fill: ON_RAMP, opacity: 0.2 }} />
      <rect width={size} height={size} style={inked(ramp(stop))} strokeWidth={3.5} />
      {PIPS[value].map(([px, py]) => (
        <circle key={`${px}-${py}`} cx={px * size} cy={py * size} r={size * 0.085} style={{ fill: ON_RAMP }} />
      ))}
      <ellipse cx={size / 2 + depth / 2} cy={-depth / 2} rx={size * 0.1} ry={size * 0.05} style={{ fill: ON_RAMP }} />
    </g>
  );
}

function Mug({ x, y, rotate, flip }: { x: number; y: number; rotate: number; flip?: boolean }) {
  const handle = flip ? 'M 0 16 H -14 V 52 H 0' : 'M 50 16 H 64 V 52 H 50';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate} 25 40)`}>
      <path d={handle} fill="none" style={{ stroke: INK }} strokeWidth={5} />
      <rect width={50} height={74} style={inked(ramp(1))} strokeWidth={3.5} />
      <rect x={8} y={14} width={6} height={50} style={{ fill: FOAM, opacity: 0.75 }} />
      {[[30, 30, 2.5], [22, 48, 2], [36, 56, 3], [28, 64, 1.8]].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} style={{ fill: FOAM }} />
      ))}
      {[[4, 0, 9], [17, -5, 11], [33, -4, 10], [46, 1, 8]].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} style={inked(FOAM)} strokeWidth={3} />
      ))}
      <rect x={-2} y={-2} width={54} height={8} style={{ fill: FOAM }} />
    </g>
  );
}

export default function DiceArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Xí ngầu cạn ly" className={className}>
      <Backdrop id="dice" dot={2} blob={7} />
      <rect x={-4} y={170} width={328} height={34} style={inked(ramp(6))} strokeWidth={3.5} />

      <ellipse cx={58} cy={172} rx={34} ry={5} style={SHADOW} />
      <ellipse cx={268} cy={172} rx={32} ry={5} style={SHADOW} />
      <ellipse cx={150} cy={176} rx={30} ry={4} style={SHADOW} />
      <ellipse cx={212} cy={177} rx={24} ry={3.5} style={SHADOW} />

      <Mug x={30} y={96} rotate={-6} />
      <Mug x={244} y={96} rotate={8} flip />

      {['M 84 70 q 12 -14 28 -8', 'M 92 86 q 10 -8 20 -4', 'M 236 72 q -10 -12 -24 -8'].map((d) => (
        <path key={d} d={d} fill="none" style={{ stroke: INK }} strokeWidth={3} strokeLinecap="round" />
      ))}
      <Die x={114} y={62} size={54} rotate={-14} value={5} stop={0} />
      <Die x={182} y={108} size={44} rotate={12} value={3} stop={4} />

      <Sparkle x={150} y={26} size={10} stop={3} />
      <Sparkle x={222} y={46} size={7} stop={8} />
      <Sparkle x={24} y={40} size={8} stop={1} />
      <Sparkle x={298} y={34} size={8} stop={5} />
    </svg>
  );
}
