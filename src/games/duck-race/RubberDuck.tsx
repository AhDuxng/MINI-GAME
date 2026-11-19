// Hình vịt cao su vàng vẽ bằng SVG, quay mặt sang phải theo hướng đua
import { cn } from '@/shared/lib/utils';

export default function RubberDuck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" aria-hidden className={cn('h-8 w-10', className)}>
      <path d="M3 17 L1 10 L9 15 Z" style={{ fill: 'var(--ramp-0)' }} stroke="rgb(var(--ink) / 0.35)" strokeWidth={0.8} strokeLinejoin="round" />
      <ellipse cx={17} cy={21} rx={14} ry={8.5} style={{ fill: 'var(--ramp-0)' }} stroke="rgb(var(--ink) / 0.35)" strokeWidth={0.8} />
      <circle cx={27} cy={11} r={7} style={{ fill: 'var(--ramp-0)' }} stroke="rgb(var(--ink) / 0.35)" strokeWidth={0.8} />
      <path d="M33 9.5 L39.5 12 L33 14.5 Q31.5 12 33 9.5 Z" style={{ fill: 'var(--ramp-2)' }} />
      <path d="M10 20 Q17 15 22 21 Q16 25.5 10 20 Z" style={{ fill: 'var(--ramp-1)' }} />
      <circle cx={29} cy={9.5} r={1.4} className="fill-[#12121a]" />
    </svg>
  );
}
