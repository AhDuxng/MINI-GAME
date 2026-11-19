// Minh hoạ hoạt hình cho Này Hay Kia: hai lá bài "NÀY" và "KIA" nghiêng đối đầu, huy hiệu VS ở giữa và cốc bia sủi bọt
import { Backdrop, CANVAS, DISPLAY, ON_RAMP, SHADOW, Sparkle, inked, ramp } from './art-kit';

function Card({ x, rotate, stop, label }: { x: number; rotate: number; stop: number; label: string }) {
  return (
    <g transform={`translate(${x} 100) rotate(${rotate})`}>
      <rect x={-44} y={-58} width={88} height={116} rx={12} style={SHADOW} transform="translate(5 5)" />
      <rect x={-44} y={-58} width={88} height={116} rx={12} style={inked(CANVAS)} strokeWidth={4} />
      <rect x={-44} y={-58} width={88} height={30} rx={12} style={inked(ramp(stop))} strokeWidth={4} />
      <text x={0} y={-42} textAnchor="middle" dominantBaseline="central" style={{ fill: ON_RAMP, fontFamily: DISPLAY, fontWeight: 800, fontSize: 16 }}>
        {label}
      </text>
      <rect x={-28} y={-6} width={56} height={8} rx={4} style={{ fill: ramp(stop), opacity: 0.55 }} />
      <rect x={-22} y={10} width={44} height={8} rx={4} style={{ fill: ramp(stop), opacity: 0.35 }} />
      <rect x={-30} y={26} width={60} height={8} rx={4} style={{ fill: ramp(stop), opacity: 0.25 }} />
    </g>
  );
}

export default function WouldYouRatherArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Này Hay Kia" className={className}>
      <Backdrop id="would-you-rather" dot={2} blob={1} />
      <Card x={104} rotate={-9} stop={2} label="NÀY" />
      <Card x={216} rotate={9} stop={7} label="KIA" />
      <circle cx={160} cy={104} r={22} style={inked('#1c110b')} strokeWidth={4} />
      <text x={160} y={105} textAnchor="middle" dominantBaseline="central" style={{ fill: ramp(1), fontFamily: DISPLAY, fontWeight: 800, fontSize: 16 }}>
        VS
      </text>
      <g transform="translate(276 160)">
        <rect x={-16} y={-22} width={30} height={40} rx={4} style={inked(ramp(0))} strokeWidth={3} />
        <path d="M 14 -14 Q 26 -14 26 -2 Q 26 10 14 10" fill="none" style={inked(ramp(0))} strokeWidth={3} />
        <path d="M -18 -22 Q -18 -32 -8 -30 Q -4 -38 6 -32 Q 16 -34 16 -24 Z" style={inked(CANVAS)} strokeWidth={3} strokeLinejoin="round" />
      </g>
      <Sparkle x={160} y={36} size={8} stop={0} />
      <Sparkle x={40} y={168} size={6} stop={3} />
    </svg>
  );
}
