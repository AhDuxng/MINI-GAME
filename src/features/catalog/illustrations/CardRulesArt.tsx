// Minh hoạ hoạt hình cho Luật Bài: ba lá bài xoè quạt có lá K đội vương miện, cạnh đó là ly bia sủi bọt làm ly chung
import { Backdrop, CANVAS, DISPLAY, INK, SANS, SHADOW, Sparkle, inked, ramp, rampText } from './art-kit';

interface CardProps {
  x: number;
  y: number;
  rotate: number;
  rank: string;
  suit: string;
  red: boolean;
  stop: number;
}

function Card({ x, y, rotate, rank, suit, red, stop }: CardProps) {
  const tone = red ? rampText(3) : INK;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-31} y={-43} width={70} height={98} style={SHADOW} />
      <rect x={-36} y={-49} width={70} height={98} style={inked(CANVAS)} strokeWidth={3.5} />
      <rect x={-30} y={-43} width={58} height={86} fill="none" style={{ stroke: ramp(stop) }} strokeWidth={2} />
      <text x={-24} y={-32} textAnchor="middle" dominantBaseline="central" style={{ fill: tone, fontFamily: DISPLAY, fontWeight: 800, fontSize: 15 }}>
        {rank}
      </text>
      <text x={-1} y={4} textAnchor="middle" dominantBaseline="central" style={{ fill: tone, fontFamily: SANS, fontSize: 38 }}>
        {suit}
      </text>
      <text x={22} y={36} textAnchor="middle" dominantBaseline="central" transform="rotate(180 22 36)" style={{ fill: tone, fontFamily: DISPLAY, fontWeight: 800, fontSize: 15 }}>
        {rank}
      </text>
    </g>
  );
}

export default function CardRulesArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Luật Bài" className={className}>
      <Backdrop id="card-rules" dot={5} blob={4} />

      <Card x={92} y={112} rotate={-20} rank="K" suit="♥" red stop={3} />
      <Card x={140} y={102} rotate={-2} rank="A" suit="♠" red={false} stop={6} />
      <Card x={188} y={110} rotate={16} rank="7" suit="♦" red stop={1} />

      <g transform="translate(70 34) rotate(-18)">
        <path d="M -20 10 L -22 -10 L -10 0 L 0 -16 L 10 0 L 22 -10 L 20 10 Z" style={inked(ramp(0))} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={0} cy={-16} r={3.5} style={inked(ramp(3))} strokeWidth={1.5} />
      </g>

      <g transform="translate(262 128)">
        <rect x={-26} y={-34} width={52} height={74} style={SHADOW} transform="translate(5 5)" />
        <path d="M 26 -18 Q 44 -18 44 2 Q 44 22 26 22" fill="none" style={{ stroke: INK }} strokeWidth={9} />
        <path d="M 26 -18 Q 44 -18 44 2 Q 44 22 26 22" fill="none" style={{ stroke: CANVAS }} strokeWidth={4} />
        <rect x={-26} y={-30} width={52} height={70} style={inked(ramp(1))} strokeWidth={3.5} />
        <path d="M -30 -30 Q -30 -46 -16 -44 Q -10 -56 4 -50 Q 16 -58 24 -46 Q 34 -44 30 -30 Z" style={inked(CANVAS)} strokeWidth={3} strokeLinejoin="round" />
        {[[-12, 4], [6, 18], [10, -8], [-6, 26]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3} style={{ fill: CANVAS, opacity: 0.8 }} />
        ))}
      </g>

      <Sparkle x={236} y={40} size={8} stop={2} />
      <Sparkle x={34} y={170} size={6} stop={7} />
      <Sparkle x={300} y={64} size={5} stop={5} />
    </svg>
  );
}
