// Đường đua nhiều làn trên mặt nước: mỗi vịt di chuyển theo vị trí phần trăm và nhận thứ hạng khi về đích
import { rampWash } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import { TICK_MS, type RaceState } from './race-engine';
import RubberDuck from './RubberDuck';

export function rankLabel(rank: number) {
  return `#${rank + 1}`;
}

interface RaceTrackProps {
  racers: string[];
  race: RaceState;
  running: boolean;
}

export default function RaceTrack({ racers, race, running }: RaceTrackProps) {
  return (
    <ol className="space-y-1.5">
      {racers.map((name, index) => {
        const position = race.positions[index] ?? 0;
        const rank = race.finishOrder.indexOf(index);
        const finished = rank >= 0;

        return (
          <li key={`${name}-${index}`} className="flex items-center gap-3">
            <span className="w-20 flex-shrink-0 truncate text-right text-xs font-semibold text-ink sm:w-28 sm:text-sm" title={name}>
              <span className="mr-1.5 font-normal text-muted">{index + 1}</span>
              {name}
            </span>
            <div
              className="relative h-11 flex-1 overflow-hidden border border-line rounded-xl"
              style={{ background: rampWash(index % 2 === 0 ? 6 : 7, 14) }}
            >
              <div className="absolute inset-y-0 right-0 w-2 bg-[repeating-linear-gradient(0deg,rgb(var(--ink))_0_5px,rgb(var(--canvas))_5px_10px)]" />
              {finished && (
                <span
                  className={cn(
                    'absolute left-2 top-1/2 -translate-y-1/2 font-display text-sm font-bold',
                    rank === racers.length - 1 ? 'text-ramp-text-3' : 'text-ink',
                  )}
                >
                  {rankLabel(rank)}
                </span>
              )}
              <div className="absolute inset-y-0 left-0 right-10">
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-[left] ease-linear"
                  style={{ left: `${position}%`, transitionDuration: `${TICK_MS}ms` }}
                >
                  <span className={cn('block', running && !finished && 'animate-waddle')}>
                    <RubberDuck />
                  </span>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
