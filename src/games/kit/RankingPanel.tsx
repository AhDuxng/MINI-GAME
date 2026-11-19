// Khối bảng xếp hạng dùng chung cho các game đếm theo người: số thứ tự tô dải màu, người đứng đầu nổi bật, đơn vị tuỳ game, nút làm lại và lời nhắc khi chưa có ai
import type { ReactNode } from 'react';
import Panel from '@/shared/ui/Panel';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import type { Ranking } from './useTally';

interface RankingPanelProps {
  title: string;
  ranking: Ranking;
  unit: string;
  stop?: number;
  empty?: ReactNode;
  onReset?: () => void;
  startStop?: number;
}

export default function RankingPanel({ title, ranking, unit, stop = 7, empty, onReset, startStop = 5 }: RankingPanelProps) {
  if (ranking.length === 0 && !empty) return null;
  return (
    <Panel
      title={title}
      stop={stop}
      action={
        onReset && ranking.length > 0 ? (
          <button type="button" onClick={onReset} className="text-action">
            Làm lại
          </button>
        ) : null
      }
    >
      {ranking.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ol className="divide-y divide-line">
          {ranking.map(([name, count], index) => (
            <li key={name} className="flex items-center gap-3 py-2.5">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md font-display text-sm font-bold text-[#12121a]" style={{ background: rampFill(index * 2 + startStop) }}>
                {index + 1}
              </span>
              <span className={cn('min-w-0 flex-1 truncate font-semibold', index === 0 ? 'text-ramp font-display text-lg font-bold' : 'text-ink')}>{name}</span>
              <span className="font-display text-lg font-bold text-ink">
                {count} {unit}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
