// Danh sách tên người chơi bấm để đánh dấu (ai đã từng, ai bị chỉ nhiều nhất...): chip đổi màu theo dải màu khi được chọn, có lời nhắc khi chưa nhập người chơi
import type { ReactNode } from 'react';
import { FaBeerMugEmpty } from 'react-icons/fa6';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';

interface PlayerToggleListProps {
  title: ReactNode;
  players: string[];
  selected: string[];
  onToggle: (player: string) => void;
  emptyHint: string;
}

export default function PlayerToggleList({ title, players, selected, onToggle, emptyHint }: PlayerToggleListProps) {
  return (
    <div className="surface p-4">
      <p className="mb-3 font-display text-lg font-bold text-ink">{title}</p>
      {players.length === 0 ? (
        <p className="text-sm text-muted">{emptyHint}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {players.map((player, index) => {
            const active = selected.includes(player);
            return (
              <button
                key={player}
                type="button"
                onClick={() => onToggle(player)}
                aria-pressed={active}
                className={cn(
                  'flex h-11 items-center gap-2 rounded-xl border px-4 font-display text-base font-bold transition-colors',
                  active ? 'border-transparent text-[#12121a]' : 'border-line bg-canvas text-ink hover:bg-elevated',
                )}
                style={active ? { background: rampFill(index) } : undefined}
              >
                {active && <FaBeerMugEmpty className="h-4 w-4" />}
                {player}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
