// Thanh thời gian thảo luận theo dải màu, chuyển sang đỏ san hô khi sắp hết giờ
import { cn } from '@/shared/lib/utils';

const WARNING_RATIO = 0.2;

export default function SpyTimer({ timeLeftMs, totalMs }: { timeLeftMs: number; totalMs: number }) {
  const ratio = totalMs > 0 ? Math.min(timeLeftMs / totalMs, 1) : 0;
  const warning = ratio <= WARNING_RATIO;
  const seconds = Math.ceil(timeLeftMs / 1000);

  return (
    <div className="flex items-center gap-3" role="timer" aria-live="off">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
        <div className={cn('h-full rounded-full transition-[width] duration-200 ease-linear', warning ? 'bg-ramp-3' : 'rule-ramp')} style={{ width: `${ratio * 100}%` }} />
      </div>
      <span className={cn('w-16 text-right font-display text-2xl font-bold leading-none', warning ? 'text-ramp-text-3' : 'text-ink')}>
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </span>
    </div>
  );
}
