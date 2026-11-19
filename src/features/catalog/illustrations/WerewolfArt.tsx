// Minh hoạ hoạt hình cho Ma Sói: sói xám ngửa cổ hú dưới trăng tròn trên nền trời đêm đầy sao, mái nhà làng và ánh đèn cửa sổ
import { DISPLAY, INK, ON_RAMP, Sparkle, inked, ramp } from './art-kit';

const STARS = [
  [34, 30, 2.2],
  [70, 58, 1.6],
  [118, 24, 2],
  [150, 52, 1.4],
  [262, 30, 1.8],
  [292, 70, 2.2],
  [24, 86, 1.4],
  [204, 18, 1.6],
];

function House({ x, width, roof, stop }: { x: number; width: number; roof: number; stop: number }) {
  return (
    <g>
      <path d={`M ${x} 200 L ${x} ${200 - roof} L ${x + width / 2} ${200 - roof - 22} L ${x + width} ${200 - roof} L ${x + width} 200 Z`} style={inked('#1d2140')} strokeWidth={3} strokeLinejoin="round" />
      <rect x={x + width / 2 - 7} y={200 - roof + 10} width={14} height={14} style={inked(ramp(stop))} strokeWidth={2.5} />
    </g>
  );
}

export default function WerewolfArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ma Sói" className={className}>
      <defs>
        <radialGradient id="werewolf-sky" cx="70%" cy="10%" r="95%">
          <stop offset="0%" stopColor="#2a3160" />
          <stop offset="60%" stopColor="#11142a" />
          <stop offset="100%" stopColor="#070812" />
        </radialGradient>
      </defs>
      <rect width={320} height={200} fill="url(#werewolf-sky)" />
      {STARS.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} style={{ fill: '#f4f1ff' }} />
      ))}

      <circle cx={232} cy={70} r={52} style={{ fill: ramp(0), opacity: 0.18 }} />
      <circle cx={232} cy={70} r={40} style={inked(ramp(0))} strokeWidth={3.5} />
      <circle cx={218} cy={58} r={7} style={{ fill: ramp(1), opacity: 0.7 }} />
      <circle cx={246} cy={84} r={5} style={{ fill: ramp(1), opacity: 0.7 }} />

      <g transform="translate(92 150) rotate(-32)">
        <path d="M -30 80 L -38 52 L -48 44 L -38 34 L -50 22 L -38 12 L -46 0 L -34 -14 L -32 -50 L -18 -22 L -10 -56 L -2 -20 Q 14 -16 28 -10 L 52 -4 Q 60 -2 57 5 L 30 9 L 28 13 L 49 21 Q 44 30 24 29 L 8 35 L 4 80 Z" style={inked('#5d6286')} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 30 9 L 56 5 L 49 21 L 28 13 Z" style={inked(ON_RAMP)} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M 8 35 L 24 29 Q 38 27 44 23 L 28 15 L 10 16 Q 2 24 8 35 Z" style={{ fill: '#a3a8cc' }} />
        <path d="M -12 -48 L -6 -24 L -16 -26 Z" style={{ fill: ramp(4) }} />
        <path d="M -30 -42 L -22 -24 L -32 -20 Z" style={{ fill: ramp(4), opacity: 0.7 }} />
        <ellipse cx={14} cy={-9} rx={5.5} ry={3.2} style={inked(ramp(1))} strokeWidth={2} />
        <circle cx={15.5} cy={-9} r={1.8} style={{ fill: ON_RAMP }} />
        <circle cx={56} cy={0} r={4.5} style={{ fill: INK }} />
        <path d="M -20 30 l 10 -6 M -24 44 l 12 -6 M -16 58 l 10 -6" style={{ stroke: '#3f4366' }} strokeWidth={2.5} strokeLinecap="round" />
      </g>
      <text x={150} y={58} textAnchor="middle" transform="rotate(-14 150 58)" style={{ fill: ramp(0), fontFamily: DISPLAY, fontWeight: 800, fontSize: 22 }}>
        Huuu!
      </text>

      <House x={168} width={46} roof={30} stop={1} />
      <House x={222} width={58} roof={42} stop={0} />
      <House x={284} width={40} roof={26} stop={2} />
      <rect x={0} y={192} width={320} height={8} style={{ fill: '#05060c' }} />

      <Sparkle x={150} y={86} size={7} stop={0} />
      <Sparkle x={30} y={130} size={6} stop={4} />
    </svg>
  );
}
