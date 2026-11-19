// Minh hoạ hoạt hình cho Vẽ Nhanh Đoán Lẹ: tờ giấy trên giá vẽ với bức vẽ nguệch ngoạc con mèo, cây bút đang vẽ, hộp màu và đồng hồ cát
import { Backdrop, CANVAS, INK, SHADOW, Sparkle, inked, ramp } from './art-kit';

export default function DrawGuessArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Vẽ Nhanh Đoán Lẹ" className={className}>
      <Backdrop id="draw-guess" dot={8} blob={5} />

      <path d="M 120 182 L 146 40 M 200 182 L 174 40 M 160 40 L 160 186" fill="none" style={{ stroke: INK }} strokeWidth={5} strokeLinecap="round" />
      <rect x={100} y={34} width={128} height={104} rx={8} style={SHADOW} />
      <rect x={94} y={28} width={128} height={104} rx={8} style={inked(CANVAS)} strokeWidth={4} />
      <g fill="none" style={{ stroke: INK }} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 132 108 Q 128 76 156 74 Q 186 74 182 108 Z" />
        <path d="M 136 80 L 134 60 L 148 74 M 168 74 L 182 60 L 180 80" />
        <circle cx={148} cy={92} r={2.5} />
        <circle cx={166} cy={92} r={2.5} />
        <path d="M 152 100 Q 157 104 162 100 M 126 96 L 112 92 M 126 102 L 110 104 M 188 96 L 202 92 M 188 102 L 204 104" />
      </g>
      <g transform="translate(232 70) rotate(38)">
        <rect x={-7} y={-40} width={14} height={60} rx={3} style={inked(ramp(1))} strokeWidth={3} />
        <path d="M -7 20 L 0 34 L 7 20 Z" style={inked(ramp(3))} strokeWidth={3} strokeLinejoin="round" />
      </g>
      {[0, 3, 5, 7, 8].map((stop, index) => (
        <circle key={stop} cx={40 + index * 16} cy={170} r={7} style={inked(ramp(stop))} strokeWidth={2.5} />
      ))}
      <g transform="translate(270 150)">
        <path d="M -14 -22 L 14 -22 L 0 0 L 14 22 L -14 22 L 0 0 Z" style={inked(ramp(0))} strokeWidth={3} strokeLinejoin="round" />
        <path d="M -6 16 L 6 16 L 0 6 Z" style={{ fill: ramp(2) }} />
      </g>
      <Sparkle x={52} y={52} size={8} stop={2} />
      <Sparkle x={270} y={36} size={6} stop={7} />
    </svg>
  );
}
