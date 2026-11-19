// Minh hoạ hoạt hình cho Đoán Trên Trán: gương mặt bối rối áp điện thoại lên trán hiện chữ "CON VỊT", bạn bè gợi ý "Quạc quạc!" và dấu hỏi bay quanh
import { Backdrop, CANVAS, DISPLAY, INK, ON_RAMP, SHADOW, Sparkle, inked, ramp } from './art-kit';

export default function ForeheadArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Đoán Trên Trán" className={className}>
      <Backdrop id="forehead" dot={5} blob={1} />

      <circle cx={146} cy={136} r={50} style={SHADOW} />
      <circle cx={140} cy={130} r={50} style={inked(ramp(1))} strokeWidth={4} />
      <ellipse cx={122} cy={134} rx={6} ry={8} style={inked(CANVAS)} strokeWidth={2.5} />
      <ellipse cx={158} cy={134} rx={6} ry={8} style={inked(CANVAS)} strokeWidth={2.5} />
      <circle cx={124} cy={136} r={3} style={{ fill: ON_RAMP }} />
      <circle cx={156} cy={136} r={3} style={{ fill: ON_RAMP }} />
      <path d="M 126 160 Q 140 152 154 162" fill="none" style={{ stroke: INK }} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={110} cy={150} rx={7} ry={4} style={{ fill: ramp(3), opacity: 0.6 }} />
      <ellipse cx={170} cy={150} rx={7} ry={4} style={{ fill: ramp(3), opacity: 0.6 }} />

      <g transform="rotate(-4 140 70)">
        <rect x={92} y={48} width={96} height={52} rx={10} style={inked('#26134a')} strokeWidth={4} />
        <rect x={99} y={55} width={82} height={38} rx={6} style={inked(ramp(5))} strokeWidth={2} />
        <text x={140} y={75} textAnchor="middle" dominantBaseline="central" style={{ fill: CANVAS, fontFamily: DISPLAY, fontWeight: 800, fontSize: 15 }}>
          CON VỊT
        </text>
      </g>

      <g transform="translate(246 64)">
        <path d="M -14 16 L -24 30 L -2 18 Z" style={inked(CANVAS)} strokeWidth={2.5} strokeLinejoin="round" />
        <ellipse cx={0} cy={0} rx={44} ry={22} style={inked(CANVAS)} strokeWidth={3} />
        <text x={0} y={1} textAnchor="middle" dominantBaseline="central" style={{ fill: ON_RAMP, fontFamily: DISPLAY, fontWeight: 800, fontSize: 14 }}>
          Quạc quạc!
        </text>
      </g>
      <text x={44} y={70} transform="rotate(-14 44 70)" style={{ fill: ramp(7), fontFamily: DISPLAY, fontWeight: 800, fontSize: 40 }}>
        ?
      </text>
      <text x={70} y={40} transform="rotate(10 70 40)" style={{ fill: ramp(3), fontFamily: DISPLAY, fontWeight: 800, fontSize: 26 }}>
        ?
      </text>
      <Sparkle x={262} y={150} size={8} stop={0} />
      <Sparkle x={34} y={150} size={6} stop={8} />
    </svg>
  );
}
