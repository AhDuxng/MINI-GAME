// Thanh thời gian còn lại của lượt theo dải màu, chuyển sang đỏ san hô khi sắp hết giờ
import { cn } from '@/shared/lib/utils';

const WARNING_RATIO = 0.25;

export default function TurnTimer({ timeLeftMs, totalMs }: { timeLeftMs: number; totalMs: number }) {
  const ratio = totalMs > 0 ? timeLeftMs / totalMs : 0;
  const warning = ratio <= WARNING_RATIO;

  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
        <div className={cn('h-full rounded-full transition-[width] duration-100 ease-linear', warning ? 'bg-ramp-3' : 'rule-ramp')} style={{ width: `${ratio * 100}%` }} />
      </div>
      <span className={cn('w-14 text-right font-display text-2xl font-extrabold', warning ? 'text-ramp-text-3' : 'text-ink')}>
        {Math.ceil(timeLeftMs / 1000)}s
      </span>
    </div>
  );
}
