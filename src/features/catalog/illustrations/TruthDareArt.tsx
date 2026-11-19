// Minh hoạ hoạt hình cho Thật hay Thách: hai lá bài "THẬT" và "THÁCH" xoè chéo kèm bong bóng hỏi và ngọn lửa
import { Backdrop, CANVAS, INK, DISPLAY, SANS, SHADOW, Sparkle, inked, ramp, rampText } from './art-kit';

interface CardProps {
  x: number;
  y: number;
  rotate: number;
  label: string;
  stop: number;
  corner: string;
  kind: 'truth' | 'dare';
}

function SpeechBubble({ stop }: { stop: number }) {
  return (
    <g transform="translate(0 32)">
      <path d="M -6 10 L -12 20 L 2 12 Z" style={inked(ramp(stop))} strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={18} ry={13} style={inked(ramp(stop))} strokeWidth={2.5} />
      <text x={0} y={1} textAnchor="middle" dominantBaseline="central" style={{ fill: '#12121a', fontFamily: SANS, fontWeight: 800, fontSize: 16 }}>
        ?
      </text>
    </g>
  );
}

function Flame({ stop }: { stop: number }) {
  return (
    <g transform="translate(0 30)">
      <path d="M 0 -18 C 12 -6 16 4 12 12 C 8 20 -8 20 -12 12 C -16 4 -8 -2 -4 -10 C -2 -4 2 -6 0 -18 Z" style={inked(ramp(stop))} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 0 0 C 6 6 6 12 2 15 C -2 17 -7 14 -6 9 C -5 5 -2 4 0 0 Z" style={{ fill: ramp(0) }} />
    </g>
  );
}

function Card({ x, y, rotate, label, stop, corner, kind }: CardProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-40} y={-56} width={92} height={128} style={SHADOW} />
      <rect x={-46} y={-64} width={92} height={128} style={inked(CANVAS)} strokeWidth={3.5} />
      <rect x={-38} y={-56} width={76} height={112} fill="none" style={{ stroke: ramp(stop) }} strokeWidth={2} />
      {[[-30, -44], [30, 48]].map(([cx, cy]) => (
        <text key={cx} x={cx} y={cy} textAnchor="middle" dominantBaseline="central" style={{ fill: rampText(stop), fontFamily: DISPLAY, fontWeight: 700, fontSize: 12 }}>
          {corner}
        </text>
      ))}
      <text x={0} y={-10} textAnchor="middle" dominantBaseline="central" style={{ fill: rampText(stop), fontFamily: SANS, fontWeight: 800, fontSize: 19 }}>
        {label}
      </text>
      {kind === 'truth' ? <SpeechBubble stop={stop} /> : <Flame stop={stop} />}
    </g>
  );
}

export default function TruthDareArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Thật hay Thách" className={className}>
      <Backdrop id="truth-dare" dot={4} blob={1} />

      <Card x={124} y={104} rotate={-12} label="THẬT" stop={7} corner="?" kind="truth" />
      <Card x={200} y={98} rotate={9} label="THÁCH" stop={3} corner="!" kind="dare" />

      {[
        { x: 42, y: 62, text: '?', stop: 6, size: 30, rotate: -14 },
        { x: 278, y: 158, text: '!', stop: 2, size: 30, rotate: 12 },
        { x: 284, y: 52, text: '?', stop: 8, size: 20, rotate: 10 },
        { x: 50, y: 160, text: '!', stop: 5, size: 20, rotate: -8 },
      ].map((mark) => (
        <text
          key={`${mark.x}-${mark.y}`}
          x={mark.x}
          y={mark.y}
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(${mark.rotate} ${mark.x} ${mark.y})`}
          strokeWidth={1.5}
          paintOrder="stroke"
          style={{ fill: rampText(mark.stop), stroke: CANVAS, fontFamily: SANS, fontWeight: 800, fontSize: mark.size }}
        >
          {mark.text}
        </text>
      ))}

      <Sparkle x={86} y={28} size={9} stop={0} />
      <Sparkle x={250} y={22} size={7} stop={4} />
      <Sparkle x={248} y={180} size={8} stop={1} />
      <path d="M 100 180 q 10 -8 22 0" fill="none" style={{ stroke: INK }} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}
