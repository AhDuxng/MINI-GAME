// Nhóm nút chọn một giá trị duy nhất, dùng cho chế độ chơi, mức độ, thời gian, kích thước bàn
import { cn } from '../lib/utils';

interface Option<T> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export default function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  disabled,
}: SegmentedControlProps<T>) {
  return (
    <div className="space-y-2">
      <p className="eyebrow">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                'h-10 border px-3.5 text-sm font-bold transition-colors duration-200 ease-house disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:px-3 rounded-xl',
                selected
                  ? 'fill-ramp border-transparent font-semibold'
                  : 'border-line bg-canvas text-muted hover:bg-elevated hover:text-ink',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
