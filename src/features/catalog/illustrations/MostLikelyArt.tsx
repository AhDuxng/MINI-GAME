// Minh hoạ hoạt hình cho Chỉ Mặt Đặt Tên: gương mặt hốt hoảng bị bốn bàn tay chỉ vào cùng lúc, bong bóng "Ai?" và nhịp đếm 3-2-1
import { Backdrop, CANVAS, DISPLAY, INK, ON_RAMP, SHADOW, Sparkle, inked, ramp } from './art-kit';

function Hand({ x, y, rotate, stop }: { x: number; y: number; rotate: number; stop: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-64} y={-11} width={40} height={22} style={inked(ramp(stop))} strokeWidth={3} />
      <rect x={-26} y={-13} width={28} height={26} rx={8} style={inked(ramp(1))} strokeWidth={3} />
      <rect x={-2} y={-13} width={30} height={10} rx={5} style={inked(ramp(1))} strokeWidth={3} />
      <path d="M -16 13 Q -10 20 -2 14" fill="none" style={{ stroke: INK }} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

export default function MostLikelyArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Chỉ Mặt Đặt Tên" className={className}>
      <Backdrop id="most-likely" dot={6} blob={7} />

      <circle cx={166} cy={112} r={40} style={SHADOW} />
      <circle cx={160} cy={106} r={40} style={inked(ramp(0))} strokeWidth={4} />
      <ellipse cx={146} cy={98} rx={7} ry={9} style={inked(CANVAS)} strokeWidth={2.5} />
      <ellipse cx={174} cy={98} rx={7} ry={9} style={inked(CANVAS)} strokeWidth={2.5} />
      <circle cx={147} cy={100} r={3.5} style={{ fill: ON_RAMP }} />
      <circle cx={173} cy={100} r={3.5} style={{ fill: ON_RAMP }} />
      <ellipse cx={160} cy={124} rx={7} ry={9} style={inked(ramp(3))} strokeWidth={2.5} />
      <path d="M 196 82 Q 204 94 198 100 Q 190 96 196 82 Z" style={inked(ramp(7))} strokeWidth={2.5} strokeLinejoin="round" />

      <Hand x={84} y={104} rotate={0} stop={5} />
      <Hand x={238} y={100} rotate={180} stop={3} />
      <Hand x={102} y={168} rotate={-38} stop={8} />
      <Hand x={222} y={168} rotate={-142} stop={6} />

      <g transform="translate(248 38)">
        <path d="M -12 14 L -20 26 L -2 16 Z" style={inked(CANVAS)} strokeWidth={2.5} strokeLinejoin="round" />
        <ellipse cx={0} cy={0} rx={28} ry={18} style={inked(CANVAS)} strokeWidth={3} />
        <text x={0} y={1} textAnchor="middle" dominantBaseline="central" style={{ fill: ON_RAMP, fontFamily: DISPLAY, fontWeight: 800, fontSize: 18 }}>
          Ai?
        </text>
      </g>

      <text x={44} y={44} transform="rotate(-10 44 44)" style={{ fill: ramp(5), fontFamily: DISPLAY, fontWeight: 800, fontSize: 26 }}>
        3·2·1
      </text>
      <Sparkle x={290} y={150} size={7} stop={1} />
      <Sparkle x={30} y={130} size={6} stop={2} />
    </svg>
  );
}
