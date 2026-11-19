// Minh hoạ hoạt hình cho Vòng quay may mắn: bánh xe nhiều màu trên giá đỡ, kim chỉ và đèn quanh vành
import { Backdrop, CANVAS, Confetti, INK, SHADOW, Sparkle, inked, ramp } from './art-kit';

const CX = 160;
const CY = 94;
const R = 60;
const STOPS = [0, 1, 2, 3, 4, 6, 7, 8];

const SLICES = STOPS.map((stop, index) => {
  const start = (index / STOPS.length) * Math.PI * 2 - Math.PI / 2;
  const end = ((index + 1) / STOPS.length) * Math.PI * 2 - Math.PI / 2;
  const point = (angle: number) => `${(CX + R * Math.cos(angle)).toFixed(2)} ${(CY + R * Math.sin(angle)).toFixed(2)}`;
  return { stop, d: `M ${CX} ${CY} L ${point(start)} A ${R} ${R} 0 0 1 ${point(end)} Z` };
});

const BULBS = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2;
  return { x: CX + (R + 9) * Math.cos(angle), y: CY + (R + 9) * Math.sin(angle), lit: index % 2 === 0 };
});

export default function WheelArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Vòng quay may mắn" className={className}>
      <Backdrop id="wheel" dot={1} blob={4} />

      <polygon points="152,140 166,140 130,186 116,186" style={inked(ramp(5))} strokeWidth={3} strokeLinejoin="round" />
      <polygon points="154,140 168,140 204,186 190,186" style={inked(ramp(5))} strokeWidth={3} strokeLinejoin="round" />
      <rect x={100} y={182} width={120} height={12} style={inked(ramp(6))} strokeWidth={3} />

      <circle cx={CX + 6} cy={CY + 6} r={R + 15} style={SHADOW} />
      <circle cx={CX} cy={CY} r={R + 15} style={inked(ramp(5))} strokeWidth={3.5} />
      <circle cx={CX} cy={CY} r={R + 3} style={{ fill: INK }} />
      {SLICES.map((slice) => (
        <path key={slice.stop} d={slice.d} style={inked(ramp(slice.stop))} strokeWidth={2.5} strokeLinejoin="round" />
      ))}
      {BULBS.map((bulb, index) => (
        <circle key={index} cx={bulb.x} cy={bulb.y} r={3.4} style={inked(bulb.lit ? ramp(0) : CANVAS)} strokeWidth={1.5} />
      ))}

      <circle cx={CX} cy={CY} r={14} style={inked(CANVAS)} strokeWidth={3.5} />
      <circle cx={CX - 4.5} cy={CY - 2} r={1.8} style={{ fill: INK }} />
      <circle cx={CX + 4.5} cy={CY - 2} r={1.8} style={{ fill: INK }} />
      <path d={`M ${CX - 5} ${CY + 3} Q ${CX} ${CY + 8} ${CX + 5} ${CY + 3}`} fill="none" style={{ stroke: INK }} strokeWidth={2} strokeLinecap="round" />

      <polygon points="148,4 172,4 160,30" style={inked(ramp(3))} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={160} cy={9} r={3} style={inked(CANVAS)} strokeWidth={1.5} />

      <Sparkle x={44} y={44} size={11} stop={0} />
      <Sparkle x={276} y={52} size={9} stop={2} />
      <Sparkle x={290} y={146} size={7} stop={7} />
      <Sparkle x={34} y={140} size={7} stop={4} />
      <Confetti x={66} y={92} rotate={24} stop={3} />
      <Confetti x={256} y={104} rotate={-30} stop={8} />
      <Confetti x={84} y={164} rotate={-12} stop={1} />
      <Confetti x={244} y={26} rotate={40} stop={6} />
      <Confetti x={262} y={176} rotate={14} stop={2} />
    </svg>
  );
}
