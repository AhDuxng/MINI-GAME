// Bộ công cụ vẽ minh hoạ hoạt hình: màu lấy theo token, viền mực, nền chấm halftone và các hoạ tiết nhỏ dùng chung
import type { CSSProperties } from 'react';

export const INK = 'rgb(var(--ink))';
export const CANVAS = 'rgb(var(--canvas))';
export const ELEVATED = 'rgb(var(--elevated))';
export const ON_RAMP = '#12121a';
export const SANS = 'var(--font-sans), sans-serif';
export const DISPLAY = 'var(--font-display), var(--font-sans), sans-serif';

export const ramp = (stop: number) => `var(--ramp-${stop})`;
export const rampText = (stop: number) => `var(--ramp-text-${stop})`;

export function inked(fill: string, extra: CSSProperties = {}): CSSProperties {
  return { fill, stroke: INK, ...extra };
}

export const SHADOW: CSSProperties = { fill: ON_RAMP, opacity: 0.16 };

interface BackdropProps {
  id: string;
  dot: number;
  blob?: number;
  base?: string;
}

export function Backdrop({ id, dot, blob, base = ELEVATED }: BackdropProps) {
  return (
    <>
      <defs>
        <pattern id={`${id}-dots`} width={10} height={10} patternUnits="userSpaceOnUse">
          <circle cx={5} cy={5} r={1.5} style={{ fill: ramp(dot) }} />
        </pattern>
      </defs>
      <rect width={320} height={200} style={{ fill: base }} />
      {blob !== undefined && <ellipse cx={160} cy={104} rx={150} ry={92} style={{ fill: ramp(blob), opacity: 0.28 }} />}
      <rect width={320} height={200} fill={`url(#${id}-dots)`} opacity={0.5} />
    </>
  );
}

export function Sparkle({ x, y, size, stop }: { x: number; y: number; size: number; stop: number }) {
  const d = `M ${x} ${y - size} Q ${x} ${y} ${x + size} ${y} Q ${x} ${y} ${x} ${y + size} Q ${x} ${y} ${x - size} ${y} Q ${x} ${y} ${x} ${y - size} Z`;
  return <path d={d} style={inked(ramp(stop))} strokeWidth={2} strokeLinejoin="round" />;
}

export function Confetti({ x, y, rotate, stop }: { x: number; y: number; rotate: number; stop: number }) {
  return <rect x={x - 4} y={y - 2.5} width={8} height={5} transform={`rotate(${rotate} ${x} ${y})`} style={inked(ramp(stop))} strokeWidth={1.5} />;
}
