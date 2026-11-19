// Danh sách các mục dạng chip, chấm màu lấy lần lượt theo dải ramp
import { rampFill } from '../lib/ramp';
import { cn } from '../lib/utils';

interface ChipListProps {
  items: string[];
  emptyText: string;
  className?: string;
}

export default function ChipList({ items, emptyText, className }: ChipListProps) {
  if (items.length === 0) {
    return <p className={cn('text-sm text-muted', className)}>{emptyText}</p>;
  }

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="inline-flex items-center gap-2 border border-line bg-canvas px-2.5 py-1 text-sm font-semibold text-ink rounded-xl">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: rampFill(index) }} />
          {item}
        </li>
      ))}
    </ul>
  );
}
