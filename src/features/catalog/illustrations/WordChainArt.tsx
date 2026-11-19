// Minh hoạ hoạt hình cho Nối từ: các quân chữ vuông rải trên nền xanh ngọc, giữa bàn ghép thành "NỐI TỪ"
import { Backdrop, CANVAS, INK, DISPLAY, ON_RAMP, Sparkle, inked, ramp } from './art-kit';

interface TileProps {
  x: number;
  y: number;
  rotate: number;
  letter: string;
  score: number;
  size?: number;
  stop?: number;
}

function Tile({ x, y, rotate, letter, score, size = 32, stop }: TileProps) {
  const half = size / 2;
  const highlighted = stop !== undefined;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-half + 4} y={-half + 4} width={size} height={size} style={{ fill: ON_RAMP, opacity: 0.28 }} />
      <rect x={-half} y={-half} width={size} height={size} style={inked(highlighted ? ramp(stop) : CANVAS)} strokeWidth={3} />
      <text
        x={0}
        y={1}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fill: highlighted ? ON_RAMP : INK, fontFamily: DISPLAY, fontWeight: 700, fontSize: size * 0.55 }}
      >
        {letter}
      </text>
      <text x={half - 5} y={half - 5} textAnchor="middle" style={{ fill: highlighted ? ON_RAMP : INK, fontFamily: DISPLAY, fontSize: size * 0.2 }}>
        {score}
      </text>
    </g>
  );
}

const SCATTER = [
  { x: 40, y: 40, rotate: -15, letter: 'A', score: 1 },
  { x: 92, y: 26, rotate: 10, letter: 'Q', score: 8 },
  { x: 236, y: 30, rotate: -8, letter: 'H', score: 4 },
  { x: 288, y: 76, rotate: 14, letter: 'M', score: 3 },
  { x: 32, y: 112, rotate: 8, letter: 'Y', score: 4 },
  { x: 62, y: 170, rotate: -12, letter: 'K', score: 5 },
  { x: 276, y: 150, rotate: 18, letter: 'Ơ', score: 2 },
  { x: 226, y: 182, rotate: -6, letter: 'Đ', score: 2 },
  { x: 116, y: 182, rotate: 7, letter: 'Ư', score: 2 },
];

const WORD = [
  { x: 118, y: 84, rotate: -4, letter: 'N', score: 1, stop: 0 },
  { x: 156, y: 80, rotate: 3, letter: 'Ố', score: 2, stop: 1 },
  { x: 194, y: 85, rotate: -2, letter: 'I', score: 1, stop: 2 },
  { x: 146, y: 128, rotate: 4, letter: 'T', score: 1, stop: 3 },
  { x: 184, y: 124, rotate: -5, letter: 'Ừ', score: 3, stop: 4 },
];

export default function WordChainArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Nối từ" className={className}>
      <defs>
        <pattern id="word-chain-dots" width={10} height={10} patternUnits="userSpaceOnUse">
          <circle cx={5} cy={5} r={1.5} style={{ fill: CANVAS }} />
        </pattern>
      </defs>
      <Backdrop id="word-chain-base" dot={6} base={ramp(7)} />
      <rect width={320} height={200} fill="url(#word-chain-dots)" opacity={0.18} />
      <ellipse cx={160} cy={104} rx={108} ry={62} style={{ fill: ramp(6), opacity: 0.55 }} />

      {SCATTER.map((tile) => (
        <Tile key={tile.letter} {...tile} size={28} />
      ))}
      <path d="M 214 92 C 236 104 232 132 206 130" fill="none" style={{ stroke: INK }} strokeWidth={3} strokeLinecap="round" strokeDasharray="5 6" />
      {WORD.map((tile) => (
        <Tile key={tile.letter} {...tile} />
      ))}
      <Sparkle x={100} y={124} size={8} stop={0} />
      <Sparkle x={222} y={150} size={6} stop={1} />
    </svg>
  );
}
