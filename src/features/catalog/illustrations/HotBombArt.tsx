// Minh hoạ hoạt hình cho Bom Nổ Chậm: quả bom mặt hốt hoảng với ngòi đang cháy, mũi tên chuyền tay và chữ tích tắc
import { Backdrop, CANVAS, DISPLAY, INK, ON_RAMP, SHADOW, Sparkle, inked, ramp } from './art-kit';

const SPARK = 'M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z';

function Arrow({ d, head, stop }: { d: string; head: string; stop: number }) {
  return (
    <g>
      <path d={d} fill="none" style={{ stroke: INK }} strokeWidth={9} strokeLinecap="round" />
      <path d={d} fill="none" style={{ stroke: ramp(stop) }} strokeWidth={5} strokeLinecap="round" />
      <path d={head} style={inked(ramp(stop))} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
}

export default function HotBombArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Bom Nổ Chậm" className={className}>
      <Backdrop id="hot-bomb" dot={3} blob={2} />

      <Arrow d="M 72 150 Q 52 110 76 74" head="M 66 80 L 80 62 L 88 84 Z" stop={7} />
      <Arrow d="M 248 74 Q 272 112 248 148" head="M 258 142 L 244 160 L 236 138 Z" stop={3} />

      <circle cx={166} cy={128} r={56} style={SHADOW} />
      <circle cx={160} cy={124} r={56} style={{ fill: ON_RAMP, stroke: INK }} strokeWidth={4} />
      <ellipse cx={136} cy={98} rx={14} ry={8} transform="rotate(-30 136 98)" style={{ fill: ramp(0), opacity: 0.55 }} />
      <rect x={146} y={60} width={28} height={14} style={inked(ramp(6))} strokeWidth={4} />

      <path d="M 160 60 Q 150 30 190 24" fill="none" style={{ stroke: INK }} strokeWidth={9} strokeLinecap="round" />
      <path d="M 160 60 Q 150 30 190 24" fill="none" style={{ stroke: ramp(1) }} strokeWidth={5} strokeLinecap="round" strokeDasharray="5 4" />
      <g transform="translate(194 22)">
        <path d={SPARK} style={inked(ramp(1))} strokeWidth={2.5} strokeLinejoin="round" />
        <circle r={6} style={{ fill: ramp(2) }} />
      </g>
      <Sparkle x={218} y={14} size={5} stop={2} />
      <Sparkle x={210} y={44} size={4} stop={0} />

      <ellipse cx={142} cy={122} rx={11} ry={13} style={inked(CANVAS)} strokeWidth={3} />
      <ellipse cx={176} cy={122} rx={11} ry={13} style={inked(CANVAS)} strokeWidth={3} />
      <circle cx={145} cy={125} r={5} style={{ fill: ON_RAMP }} />
      <circle cx={173} cy={125} r={5} style={{ fill: ON_RAMP }} />
      <ellipse cx={159} cy={152} rx={10} ry={7} style={inked(ramp(3))} strokeWidth={3} />
      <path d="M 196 100 Q 204 112 198 118 Q 190 114 196 100 Z" style={inked(ramp(7))} strokeWidth={2.5} strokeLinejoin="round" />

      <text x={34} y={42} transform="rotate(-10 34 42)" style={{ fill: ramp(3), fontFamily: DISPLAY, fontWeight: 800, fontSize: 22 }}>
        TÍCH
      </text>
      <text x={238} y={186} transform="rotate(8 238 186)" style={{ fill: ramp(7), fontFamily: DISPLAY, fontWeight: 800, fontSize: 22 }}>
        TẮC!
      </text>
      <Sparkle x={290} y={40} size={7} stop={1} />
      <Sparkle x={36} y={176} size={6} stop={8} />
    </svg>
  );
}
