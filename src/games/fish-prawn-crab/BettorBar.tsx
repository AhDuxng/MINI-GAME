// Hàng chọn người đang đặt cược: mỗi người hiện điểm còn lại và tổng cược, người được chọn tô dải màu
import { cn } from '@/shared/lib/utils';

interface BettorBarProps {
  roster: string[];
  active: string;
  pointsOf: (name: string) => number;
  available: (name: string) => number;
  onSelect: (name: string) => void;
  disabled: boolean;
}

export default function BettorBar({ roster, active, pointsOf, available, onSelect, disabled }: BettorBarProps) {
  return (
    <div className="space-y-2">
      <p className="eyebrow">Người đang đặt cược</p>
      <div role="radiogroup" aria-label="Người đang đặt cược" className="scrollbar-soft -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {roster.map((name) => {
          const selected = name === active;
          const points = pointsOf(name);
          const staked = points - available(name);
          return (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onSelect(name)}
              className={cn(
                'flex min-h-12 min-w-[7.5rem] flex-shrink-0 flex-col items-start justify-center border px-3 py-1.5 text-left transition-colors duration-200 disabled:opacity-60 rounded-xl',
                selected ? 'fill-ramp border-transparent' : 'border-line bg-canvas text-ink hover:bg-elevated',
              )}
            >
              <span className="max-w-[9rem] truncate text-sm font-bold">{name}</span>
              <span className={cn('font-display text-base font-bold leading-tight', points <= 0 && 'text-ramp-text-3')}>
                {points <= 0 ? 'Hết điểm' : `${points.toLocaleString('vi-VN')} điểm`}
                {staked > 0 && <span className="ml-1 text-xs font-semibold opacity-75">(cược {staked})</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
