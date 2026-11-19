// Minh hoạ hoạt hình cho Bầu Cua: đĩa đỏ với ba xúc xắc linh vật, nắp bát vừa nhấc và các linh vật vây quanh
import { SYMBOLS } from './fish-prawn-crab-symbols';
import { Backdrop, CANVAS, INK, SHADOW, Sparkle, inked, ramp } from './art-kit';

function GlyphAt({ index, x, y, size }: { index: number; x: number; y: number; size: number }) {
  const { Glyph } = SYMBOLS[index];
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 64})`}>
      <Glyph />
    </g>
  );
}

function Cube({ x, y, size, index, rotate }: { x: number; y: number; size: number; index: number; rotate: number }) {
  const depth = size * 0.28;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <polygon points={`0,0 ${size},0 ${size + depth},${-depth} ${depth},${-depth}`} style={inked(CANVAS)} strokeWidth={3} strokeLinejoin="round" />
      <polygon points={`${size},0 ${size + depth},${-depth} ${size + depth},${size - depth} ${size},${size}`} style={inked(ramp(SYMBOLS[index].stop))} strokeWidth={3} strokeLinejoin="round" />
      <rect width={size} height={size} style={inked(CANVAS)} strokeWidth={3.5} />
      <GlyphAt index={index} x={size * 0.08} y={size * 0.08} size={size * 0.84} />
    </g>
  );
}

export default function FishPrawnCrabArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Bầu Cua" className={className}>
      <Backdrop id="fish-prawn-crab" dot={3} blob={1} />
      <ellipse cx={164} cy={168} rx={118} ry={26} style={SHADOW} />
      <ellipse cx={160} cy={160} rx={118} ry={30} style={inked(ramp(3))} strokeWidth={4} />
      <ellipse cx={160} cy={156} rx={98} ry={22} style={inked(CANVAS)} strokeWidth={3} />
      <Cube x={88} y={118} size={40} index={1} rotate={-6} />
      <Cube x={140} y={124} size={40} index={4} rotate={3} />
      <Cube x={192} y={116} size={40} index={0} rotate={8} />
      <g transform="translate(206 20) rotate(18)">
        <path d="M6 70 Q6 8 64 6 Q122 8 122 70 Z" style={inked(CANVAS)} strokeWidth={4} strokeLinejoin="round" />
        <path d="M14 52 Q64 44 114 52 L116 62 Q64 54 12 62 Z" style={inked(ramp(6))} strokeWidth={2.5} />
        <rect x={0} y={66} width={128} height={10} style={inked(CANVAS)} strokeWidth={4} />
        <ellipse cx={64} cy={5} rx={12} ry={5} style={inked(ramp(6))} strokeWidth={3} />
      </g>
      <GlyphAt index={2} x={18} y={22} size={46} />
      <GlyphAt index={3} x={22} y={96} size={44} />
      <GlyphAt index={5} x={266} y={130} size={44} />
      <Sparkle x={150} y={40} size={9} stop={1} />
      <Sparkle x={86} y={64} size={6} stop={7} />
      <path d="M118 58 Q132 48 146 58" fill="none" style={{ stroke: INK }} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}
