// Minh hoạ hoạt hình cho Gián Điệp: nhân vật đội mũ đeo kính đen giữa hai bong bóng từ gần giống nhau và chiếc kính lúp
import { Backdrop, CANVAS, DISPLAY, INK, ON_RAMP, SHADOW, Sparkle, inked, ramp } from './art-kit';

function Bubble({ x, y, word, fill, text, tail }: { x: number; y: number; word: string; fill: string; text: string; tail: 1 | -1 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M ${tail * 18} 16 L ${tail * 34} 34 L ${tail * 4} 20 Z`} style={inked(fill)} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={46} ry={24} style={inked(fill)} strokeWidth={3} />
      <text x={0} y={1} textAnchor="middle" dominantBaseline="central" style={{ fill: text, fontFamily: DISPLAY, fontWeight: 800, fontSize: 17 }}>
        {word}
      </text>
    </g>
  );
}

export default function SpyWordArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Gián Điệp" className={className}>
      <Backdrop id="spy-word" dot={5} blob={7} />

      <path d="M 116 206 L 128 150 Q 160 136 192 150 L 204 206 Z" style={SHADOW} transform="translate(5 4)" />
      <path d="M 116 206 L 128 150 Q 160 136 192 150 L 204 206 Z" style={inked(ramp(6))} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 134 148 L 160 182 L 186 148 L 172 144 L 160 160 L 148 144 Z" style={inked(ramp(7))} strokeWidth={3} strokeLinejoin="round" />
      <line x1={160} y1={182} x2={160} y2={206} style={{ stroke: INK }} strokeWidth={3} />

      <circle cx={160} cy={114} r={30} style={inked(ramp(1))} strokeWidth={4} />
      <rect x={136} y={104} width={20} height={12} style={{ fill: ON_RAMP }} />
      <rect x={164} y={104} width={20} height={12} style={{ fill: ON_RAMP }} />
      <line x1={156} y1={108} x2={164} y2={108} style={{ stroke: ON_RAMP }} strokeWidth={3} />
      <rect x={139} y={106} width={6} height={3} style={{ fill: ramp(0) }} />
      <path d="M 150 128 Q 160 134 172 126" fill="none" style={{ stroke: INK }} strokeWidth={3} strokeLinecap="round" />

      <rect x={134} y={56} width={52} height={34} style={inked(ramp(5))} strokeWidth={4} />
      <rect x={134} y={78} width={52} height={8} style={inked(ramp(3))} strokeWidth={3} />
      <ellipse cx={160} cy={92} rx={50} ry={9} style={inked(ramp(5))} strokeWidth={4} />

      <Bubble x={62} y={66} word="cà phê" fill={CANVAS} text={INK} tail={1} />
      <Bubble x={258} y={62} word="trà sữa" fill={ramp(3)} text={ON_RAMP} tail={-1} />

      <g transform="translate(262 150) rotate(-35)">
        <rect x={-5} y={22} width={10} height={34} style={inked(ramp(2))} strokeWidth={3} />
        <circle cx={0} cy={0} r={24} style={inked(CANVAS)} strokeWidth={5} />
        <circle cx={0} cy={0} r={18} style={{ fill: ramp(7), opacity: 0.35 }} />
        <path d="M -10 -8 Q -4 -14 4 -14" fill="none" style={{ stroke: CANVAS }} strokeWidth={3} strokeLinecap="round" />
      </g>

      <text x={44} y={150} style={{ fill: ramp(5), fontFamily: DISPLAY, fontWeight: 800, fontSize: 40 }} transform="rotate(-12 44 150)">
        ?
      </text>
      <text x={84} y={176} style={{ fill: ramp(3), fontFamily: DISPLAY, fontWeight: 800, fontSize: 26 }} transform="rotate(10 84 176)">
        ?
      </text>
      <Sparkle x={112} y={28} size={7} stop={1} />
      <Sparkle x={216} y={112} size={6} stop={8} />
      <Sparkle x={292} y={108} size={5} stop={0} />
    </svg>
  );
}
