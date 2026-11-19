// Lịch sử các lượt lắc: ai lắc, ra mặt gì, lúc nào, kèm thống kê số lần ra mỗi mặt
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import { DICE_FACES } from '@/data';
import { formatClock } from '@/shared/lib/utils';
import FaceBadge from './FaceBadge';
import { getFace } from './face-style';
import type { DiceRoll } from './useDiceGame';

interface DiceHistoryProps {
  history: DiceRoll[];
  onClear: () => void;
}

export default function DiceHistory({ history, onClear }: DiceHistoryProps) {
  const counts = new Map<number, number>();
  history.forEach((roll) => counts.set(roll.faceId, (counts.get(roll.faceId) ?? 0) + 1));

  return (
    <Panel title="Lịch sử" stop={6} action={<Badge>{history.length} lượt</Badge>}>
      <ul className="mb-5 grid grid-cols-6 gap-1">
        {DICE_FACES.map((face) => (
          <li key={face.id} className="flex flex-col items-center gap-1" title={face.label}>
            <FaceBadge face={face} className="h-8 w-8" />
            <span className="font-display text-sm font-bold text-ink">{counts.get(face.id) ?? 0}</span>
          </li>
        ))}
      </ul>

      <ol className="scrollbar-soft max-h-[360px] divide-y divide-line overflow-y-auto border-y border-line">
        {history.length === 0 && <li className="py-6 text-center text-sm text-muted">Chưa có lượt nào.</li>}
        {history.map((roll) => {
          const face = getFace(roll.faceId);
          return (
            <li key={roll.id} className="flex items-center gap-3 py-2.5">
              <FaceBadge face={face} className="h-8 w-8" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{face.label}</p>
                <p className="truncate text-xs text-muted">{roll.player ?? `Lượt ${roll.id}`}</p>
              </div>
              <time dateTime={roll.rolledAt.toISOString()} className="text-xs font-semibold text-muted">
                {formatClock(roll.rolledAt)}
              </time>
            </li>
          );
        })}
      </ol>

      {history.length > 0 && (
        <Button variant="danger" size="sm" className="mt-5 w-full" onClick={onClear}>
          Xoá lịch sử
        </Button>
      )}
    </Panel>
  );
}
