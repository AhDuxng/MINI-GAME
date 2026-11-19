// Nhãn nhỏ: trung tính cho số đếm/trạng thái, hoặc nhãn nổi bật MỚI/HOT/VIP trên thẻ game
import type { CSSProperties, ReactNode } from 'react';
import { FaCrown, FaFire } from 'react-icons/fa6';
import { cn } from '../lib/utils';

type Tone = 'neutral' | 'new' | 'hot' | 'vip';

const TONES: Record<Exclude<Tone, 'neutral'>, { background: string; label: string }> = {
  new: { background: 'var(--ramp-7)', label: 'MỚI' },
  hot: { background: 'var(--ramp-3)', label: 'HOT' },
  vip: { background: 'var(--ramp-1)', label: 'VIP' },
};

interface BadgeProps {
  tone?: Tone;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function Badge({ tone = 'neutral', children, className, style }: BadgeProps) {
  if (tone === 'neutral') {
    return (
      <span className={cn('chip', className)} style={style}>
        {children}
      </span>
    );
  }

  const { background, label } = TONES[tone];
  return (
    <span
      className={cn('inline-flex items-center gap-1 px-2 py-0.5 font-display text-xs font-bold leading-5 tracking-wide text-[#12121a] rounded-md', className)}
      style={{ background, ...style }}
    >
      {tone === 'vip' && <FaCrown className="h-3 w-3" />}
      {tone === 'hot' && <FaFire className="h-3 w-3" />}
      {children ?? label}
    </span>
  );
}
