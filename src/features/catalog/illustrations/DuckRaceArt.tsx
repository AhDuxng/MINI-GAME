// Minh hoạ hoạt hình cho Đua vịt: đàn vịt cao su vàng bập bềnh trên sóng nước, phao chia làn và cờ đích ca-rô
import { Backdrop, CANVAS, INK, ON_RAMP, Sparkle, inked, ramp } from './art-kit';

function wave(top: number, amplitude: number, length: number) {
  let d = `M -10 ${top}`;
  for (let x = -10; x < 330; x += length) {
    d += ` q ${length / 4} ${-amplitude} ${length / 2} 0 t ${length / 2} 0`;
  }
  return `${d} L 330 210 L -10 210 Z`;
}

const BACK_WATER = wave(100, 5, 40);
const BACK_FRONT = wave(110, 4, 32);
const FRONT_WATER = wave(146, 6, 48);
const FRONT_FRONT = wave(158, 5, 36);

function Duck({ x, y, scale, tilt }: { x: number; y: number; scale: number; tilt: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${tilt})`}>
      <path d="M -18 -6 L -30 -18 L -14 -12 Z" style={inked(ramp(0))} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={22} ry={13} style={inked(ramp(0))} strokeWidth={3} />
      <path d="M -10 -2 Q -1 -11 8 -1 Q -1 5 -10 -2 Z" style={inked(ramp(1))} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={12} cy={-17} r={11} style={inked(ramp(0))} strokeWidth={3} />
      <path d="M 21 -18 Q 33 -17 31 -11 Q 25 -9 21 -12 Z" style={inked(ramp(2))} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={15} cy={-20} r={2.4} style={{ fill: ON_RAMP }} />
      <ellipse cx={8} cy={-12} rx={3.5} ry={2} style={{ fill: ramp(4), opacity: 0.9 }} />
    </g>
  );
}

const BUOYS = Array.from({ length: 16 }, (_, index) => ({ x: 8 + index * 20, stop: index % 2 === 0 ? 3 : 0 }));

export default function DuckRaceArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Đua vịt" className={className}>
      <defs>
        <pattern id="duck-race-checker" width={12} height={12} patternUnits="userSpaceOnUse">
          <rect width={12} height={12} style={{ fill: CANVAS }} />
          <rect width={6} height={6} style={{ fill: INK }} />
          <rect x={6} y={6} width={6} height={6} style={{ fill: INK }} />
        </pattern>
      </defs>
      <Backdrop id="duck-race" dot={6} />

      <circle cx={44} cy={40} r={16} style={inked(ramp(0))} strokeWidth={3} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={44 + 22 * Math.cos((angle * Math.PI) / 180)}
          y1={40 + 22 * Math.sin((angle * Math.PI) / 180)}
          x2={44 + 30 * Math.cos((angle * Math.PI) / 180)}
          y2={40 + 30 * Math.sin((angle * Math.PI) / 180)}
          style={{ stroke: INK }}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}

      <rect x={266} y={34} width={6} height={124} style={inked(ramp(5))} strokeWidth={2.5} />
      <path d="M 272 38 Q 288 32 304 38 T 316 38 L 316 70 Q 302 64 288 70 T 272 70 Z" fill="url(#duck-race-checker)" style={{ stroke: INK }} strokeWidth={3} strokeLinejoin="round" />

      <path d={BACK_WATER} style={inked(ramp(6))} strokeWidth={3} strokeLinejoin="round" />
      <Duck x={86} y={100} scale={0.72} tilt={-6} />
      <Duck x={164} y={98} scale={0.72} tilt={4} />
      <Duck x={226} y={101} scale={0.72} tilt={-3} />
      <path d={BACK_FRONT} style={inked(ramp(6))} strokeWidth={3} strokeLinejoin="round" />

      {BUOYS.map((buoy) => (
        <circle key={buoy.x} cx={buoy.x} cy={132} r={4} style={inked(ramp(buoy.stop))} strokeWidth={1.5} />
      ))}

      <path d={FRONT_WATER} style={inked(ramp(7))} strokeWidth={3} strokeLinejoin="round" />
      <Duck x={120} y={150} scale={1} tilt={5} />
      <Duck x={238} y={148} scale={1} tilt={-5} />
      <path d={FRONT_FRONT} style={inked(ramp(7))} strokeWidth={3} strokeLinejoin="round" />

      {[[96, 168], [214, 166], [150, 186], [40, 180], [286, 184]].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M ${x} ${y} q 8 -5 16 0`} fill="none" style={{ stroke: INK, opacity: 0.55 }} strokeWidth={2.5} strokeLinecap="round" />
      ))}
      <Sparkle x={128} y={30} size={7} stop={1} />
      <Sparkle x={214} y={56} size={6} stop={2} />
    </svg>
  );
}
