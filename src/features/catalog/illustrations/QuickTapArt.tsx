// Minh hoạ hoạt hình cho Nhanh Tay Lẹ Mắt: điện thoại nằm giữa bàn chia bốn góc màu, đèn xanh "CHẠM!" ở giữa và bốn ngón tay lao vào cùng lúc
import { Backdrop, CANVAS, DISPLAY, ON_RAMP, SHADOW, Sparkle, inked, ramp } from './art-kit';

function Finger({ x, y, rotate, stop }: { x: number; y: number; rotate: number; stop: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-9} y={-4} width={18} height={44} rx={9} style={inked(ramp(1))} strokeWidth={3} />
      <rect x={-12} y={28} width={24} height={26} rx={6} style={inked(ramp(stop))} strokeWidth={3} />
      <path d="M -4 2 L 4 2" style={{ stroke: ON_RAMP, opacity: 0.4 }} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

export default function QuickTapArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Nhanh Tay Lẹ Mắt" className={className}>
      <Backdrop id="quick-tap" dot={7} blob={3} />

      <rect x={112} y={34} width={104} height={146} rx={18} style={SHADOW} />
      <rect x={106} y={28} width={104} height={146} rx={18} style={inked('#1d1235')} strokeWidth={4} />
      <rect x={114} y={38} width={42} height={60} rx={9} style={inked(ramp(3))} strokeWidth={2.5} />
      <rect x={160} y={38} width={42} height={60} rx={9} style={inked(ramp(7))} strokeWidth={2.5} />
      <rect x={114} y={104} width={42} height={60} rx={9} style={inked(ramp(1))} strokeWidth={2.5} />
      <rect x={160} y={104} width={42} height={60} rx={9} style={inked(ramp(5))} strokeWidth={2.5} />
      <circle cx={158} cy={101} r={24} style={inked('#22a565')} strokeWidth={3.5} />
      <text x={158} y={102} textAnchor="middle" dominantBaseline="central" style={{ fill: CANVAS, fontFamily: DISPLAY, fontWeight: 800, fontSize: 12 }}>
        CHẠM!
      </text>

      <Finger x={78} y={52} rotate={-128} stop={3} />
      <Finger x={242} y={52} rotate={128} stop={7} />
      <Finger x={78} y={154} rotate={-52} stop={1} />
      <Finger x={242} y={154} rotate={52} stop={5} />

      <Sparkle x={158} y={18} size={8} stop={0} />
      <Sparkle x={36} y={104} size={6} stop={2} />
      <Sparkle x={286} y={104} size={6} stop={8} />
    </svg>
  );
}
