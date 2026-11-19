// Minh hoạ hoạt hình cho Tôi Chưa Từng: bong bóng thoại "Tôi chưa từng..." bên cốc bia sủi bọt và hai thẻ đã từng, chưa từng
import { Backdrop, CANVAS, DISPLAY, INK, SANS, SHADOW, Sparkle, inked, ramp, rampText } from './art-kit';

function Verdict({ x, y, rotate, stop, kind }: { x: number; y: number; rotate: number; stop: number; kind: 'yes' | 'no' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-21} y={-15} width={46} height={34} style={SHADOW} />
      <rect x={-24} y={-18} width={46} height={34} style={inked(ramp(stop))} strokeWidth={3} />
      <path d={kind === 'yes' ? 'M -11 -1 l 7 7 l 14 -14' : 'M -9 -9 l 16 16 M 7 -9 l -16 16'} fill="none" style={{ stroke: INK }} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export default function NeverHaveIArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Tôi Chưa Từng" className={className}>
      <Backdrop id="never-have-i" dot={2} blob={4} />

      <g transform="translate(110 72)">
        <ellipse cx={6} cy={7} rx={92} ry={42} style={SHADOW} />
        <path d="M -44 30 L -60 64 L -16 38 Z" style={inked(CANVAS)} strokeWidth={3.5} strokeLinejoin="round" />
        <ellipse cx={0} cy={0} rx={92} ry={42} style={inked(CANVAS)} strokeWidth={3.5} />
        <path d="M -42 34 L -20 38" style={{ stroke: CANVAS }} strokeWidth={6} />
        <text x={0} y={-8} textAnchor="middle" dominantBaseline="central" style={{ fill: rampText(3), fontFamily: DISPLAY, fontWeight: 800, fontSize: 22 }}>
          Tôi chưa từng...
        </text>
        <text x={0} y={18} textAnchor="middle" dominantBaseline="central" style={{ fill: INK, fontFamily: SANS, fontWeight: 700, fontSize: 13 }}>
          ai từng làm thì uống!
        </text>
      </g>

      <g transform="translate(244 116)">
        <rect x={-24} y={-28} width={60} height={84} style={SHADOW} />
        <path d="M 30 -16 h 12 q 14 0 14 14 v 26 q 0 14 -14 14 h -12" fill="none" style={{ stroke: INK }} strokeWidth={13} strokeLinejoin="round" />
        <path d="M 30 -16 h 12 q 14 0 14 14 v 26 q 0 14 -14 14 h -12" fill="none" style={{ stroke: ramp(1) }} strokeWidth={6} strokeLinejoin="round" />
        <rect x={-30} y={-34} width={60} height={84} style={inked(ramp(1))} strokeWidth={3.5} />
        <path d="M -14 -8 v 50 M 0 -8 v 50 M 14 -8 v 50" style={{ stroke: CANVAS, opacity: 0.45 }} strokeWidth={3} strokeLinecap="round" />
        {[[-16, 20, 3], [6, 8, 2.5], [12, 32, 3.5], [-4, 38, 2]].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} style={{ fill: CANVAS, opacity: 0.8 }} />
        ))}
        <path d="M -38 -30 a 12 12 0 0 1 18 -12 a 13 13 0 0 1 24 -6 a 12 12 0 0 1 22 6 a 10 10 0 0 1 10 16 a 8 8 0 0 1 -6 12 L -34 -14 a 9 9 0 0 1 -4 -16 Z" style={inked(CANVAS)} strokeWidth={3.5} strokeLinejoin="round" />
      </g>

      <Verdict x={52} y={160} rotate={-8} stop={8} kind="yes" />
      <Verdict x={112} y={168} rotate={7} stop={3} kind="no" />

      <Sparkle x={28} y={30} size={8} stop={0} />
      <Sparkle x={292} y={36} size={7} stop={6} />
      <Sparkle x={190} y={172} size={6} stop={5} />
    </svg>
  );
}
