// Minh hoạ hoạt hình cho Xoay Chai: bàn tròn nhìn nghiêng, chai thuỷ tinh nằm giữa đang xoay, ly nhỏ quanh mép bàn và mũi tên chuyển động
import { Backdrop, CANVAS, INK, SHADOW, Sparkle, inked, ramp } from './art-kit';

const GLASSES = [
  { x: 58, y: 116, stop: 3 },
  { x: 96, y: 88, stop: 5 },
  { x: 160, y: 78, stop: 7 },
  { x: 224, y: 88, stop: 8 },
  { x: 264, y: 118, stop: 0 },
  { x: 214, y: 158, stop: 4 },
  { x: 104, y: 158, stop: 6 },
];

function Glass({ x, y, stop }: { x: number; y: number; stop: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -9 -12 L 9 -12 L 7 10 L -7 10 Z" style={inked(CANVAS)} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M -8 -3 L 8 -3 L 7 9 L -7 9 Z" style={{ fill: ramp(stop) }} />
    </g>
  );
}

function Arc({ d, head, stop }: { d: string; head: string; stop: number }) {
  return (
    <g>
      <path d={d} fill="none" style={{ stroke: INK }} strokeWidth={8} strokeLinecap="round" />
      <path d={d} fill="none" style={{ stroke: ramp(stop) }} strokeWidth={4.5} strokeLinecap="round" />
      <path d={head} style={inked(ramp(stop))} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
}

export default function SpinBottleArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Xoay Chai" className={className}>
      <Backdrop id="spin-bottle" dot={7} blob={0} />

      <ellipse cx={168} cy={142} rx={132} ry={54} style={SHADOW} />
      <ellipse cx={160} cy={136} rx={130} ry={54} style={inked(ramp(2))} strokeWidth={3.5} />
      <ellipse cx={160} cy={124} rx={130} ry={54} style={inked(ramp(1))} strokeWidth={3.5} />
      <ellipse cx={160} cy={124} rx={98} ry={38} fill="none" style={{ stroke: ramp(2) }} strokeWidth={2} strokeDasharray="6 5" />

      {GLASSES.map((glass) => (
        <Glass key={`${glass.x}-${glass.y}`} {...glass} />
      ))}

      <g transform="translate(160 122) rotate(-14)">
        <ellipse cx={4} cy={14} rx={70} ry={8} style={SHADOW} />
        <path d="M -64 -17 Q -69 0 -64 17 L 16 17 Q 34 17 44 7 L 64 5 L 64 -5 L 44 -7 Q 34 -17 16 -17 Z" style={inked(ramp(8))} strokeWidth={3.5} strokeLinejoin="round" />
        <rect x={-42} y={-17} width={40} height={34} style={inked(ramp(3))} strokeWidth={3} />
        <rect x={-42} y={-5} width={40} height={9} style={{ fill: ramp(0) }} />
        <rect x={64} y={-7} width={10} height={14} style={inked(ramp(3))} strokeWidth={2.5} />
        <path d="M -54 -9 L 20 -9" style={{ stroke: CANVAS }} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
      </g>

      <Arc d="M 70 54 Q 160 14 250 54" head="M 244 44 L 262 58 L 240 62 Z" stop={5} />
      <Arc d="M 252 190 Q 160 206 70 190" head="M 78 182 L 58 190 L 76 199 Z" stop={7} />

      <Sparkle x={286} y={104} size={8} stop={1} />
      <Sparkle x={34} y={40} size={7} stop={4} />
      <Sparkle x={296} y={30} size={5} stop={8} />
    </svg>
  );
}
