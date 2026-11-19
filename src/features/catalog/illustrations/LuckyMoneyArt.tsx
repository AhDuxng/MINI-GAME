// Minh hoạ hoạt hình cho Rút bao lì xì: ba bao lì xì đỏ hoa văn vàng có dấu "LỘC", đồng xu lỗ vuông và hoa mai
import { Backdrop, ELEVATED, INK, ON_RAMP, SANS, SHADOW, Sparkle, inked, ramp } from './art-kit';

function Envelope({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-30} y={-48} width={72} height={108} style={SHADOW} />
      <rect x={-36} y={-54} width={72} height={108} style={inked(ramp(3))} strokeWidth={3.5} />
      <rect x={-36} y={-54} width={72} height={108} fill="url(#lucky-money-gold)" opacity={0.7} />
      <rect x={-36} y={30} width={72} height={8} style={inked(ramp(1))} strokeWidth={2} />
      <path d="M -36 -54 L 0 -16 L 36 -54 Z" style={inked(ramp(3))} strokeWidth={3} strokeLinejoin="round" />
      <path d="M -36 -54 L 0 -16 L 36 -54 Z" style={{ fill: ON_RAMP, opacity: 0.14 }} />
      <circle cx={0} cy={-14} r={14} style={inked(ramp(1))} strokeWidth={3} />
      <text x={0} y={-13} textAnchor="middle" dominantBaseline="central" style={{ fill: ON_RAMP, fontFamily: SANS, fontWeight: 800, fontSize: 9.5 }}>
        LỘC
      </text>
    </g>
  );
}

function Coin({ x, y, r }: { x: number; y: number; r: number }) {
  const hole = r * 0.5;
  return (
    <g>
      <circle cx={x} cy={y} r={r} style={inked(ramp(1))} strokeWidth={3} />
      <circle cx={x} cy={y} r={r * 0.72} fill="none" style={{ stroke: INK }} strokeWidth={1.5} />
      <rect x={x - hole / 2} y={y - hole / 2} width={hole} height={hole} style={inked(ELEVATED)} strokeWidth={1.5} />
    </g>
  );
}

function Blossom({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <circle
          key={angle}
          cx={size * Math.cos(((angle - 90) * Math.PI) / 180)}
          cy={size * Math.sin(((angle - 90) * Math.PI) / 180)}
          r={size * 0.8}
          style={inked(ramp(0))}
          strokeWidth={1.8}
        />
      ))}
      <circle r={size * 0.6} style={inked(ramp(2))} strokeWidth={1.5} />
    </g>
  );
}

export default function LuckyMoneyArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Rút bao lì xì" className={className}>
      <defs>
        <pattern id="lucky-money-gold" width={12} height={12} patternUnits="userSpaceOnUse">
          <circle cx={3} cy={3} r={1.6} style={{ fill: ramp(1) }} />
          <circle cx={9} cy={9} r={2.4} style={{ fill: ramp(1) }} />
          <circle cx={9} cy={9} r={0.9} style={{ fill: ramp(0) }} />
        </pattern>
      </defs>
      <Backdrop id="lucky-money" dot={3} blob={1} />

      <Envelope x={112} y={108} rotate={-16} />
      <Envelope x={208} y={108} rotate={15} />
      <Envelope x={160} y={98} rotate={0} />

      <Coin x={52} y={150} r={16} />
      <Coin x={82} y={172} r={11} />
      <Coin x={266} y={156} r={15} />
      <Coin x={292} y={126} r={10} />
      <Coin x={60} y={70} r={10} />

      <Blossom x={36} y={36} size={7} />
      <Blossom x={282} y={44} size={8} />
      <Blossom x={244} y={186} size={6} />
      <Sparkle x={104} y={30} size={8} stop={0} />
      <Sparkle x={220} y={30} size={7} stop={4} />
      <Sparkle x={130} y={184} size={6} stop={1} />
    </svg>
  );
}
