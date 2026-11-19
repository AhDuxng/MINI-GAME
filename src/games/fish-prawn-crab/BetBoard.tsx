// Bàn cược Bầu Cua 3×2: chạm ô để đặt phỉnh cho người đang cược, nút xoá gỡ cược của người đó; ô trúng được tô viền sau khi mở bát
import type { CSSProperties } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { rampFill, rampWash } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import { countMatches, type Bets, type SymbolId } from './fish-prawn-crab-rules';
import { SYMBOLS, SymbolIcon } from '@/features/catalog';

interface BetBoardProps {
  myBets: Bets;
  totals: Partial<Record<SymbolId, number>>;
  roll: SymbolId[] | null;
  revealed: boolean;
  disabled: boolean;
  onPlace: (symbol: SymbolId) => void;
  onClear: (symbol: SymbolId) => void;
}

export default function BetBoard({ myBets, totals, roll, revealed, disabled, onPlace, onClear }: BetBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {SYMBOLS.map((symbol) => {
        const mine = myBets[symbol.id] ?? 0;
        const total = totals[symbol.id] ?? 0;
        const matches = revealed && roll ? countMatches(roll, symbol.id) : 0;
        const tileStyle = {
          background: rampWash(symbol.stop, matches > 0 ? 34 : 16),
          outline: matches > 0 ? `3px solid ${rampFill(symbol.stop)}` : undefined,
          outlineOffset: '-3px',
        } as CSSProperties;

        return (
          <div key={symbol.id} className="relative">
            <button
              type="button"
              onClick={() => onPlace(symbol.id)}
              disabled={disabled}
              aria-label={`Cược ${symbol.name}`}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1 border border-line p-2 transition-transform duration-200 ease-house active:scale-[0.97] disabled:cursor-not-allowed rounded-xl"
              style={tileStyle}
            >
              <SymbolIcon id={symbol.id} className="h-12 w-12 sm:h-16 sm:w-16" />
              <span className="font-display text-lg font-bold leading-none text-ink sm:text-xl">{symbol.name}</span>
              {total > 0 ? (
                <span className="rounded-full border-2 border-[#12121a]/30 bg-ramp-1 px-2 font-display text-xs font-bold leading-5 text-[#12121a]">
                  {total}
                </span>
              ) : (
                <span className="h-5" />
              )}
            </button>
            {matches > 0 && (
              <span className="pointer-events-none absolute left-1.5 top-1.5 bg-[#12121a] px-1.5 font-display text-xs font-bold leading-5 text-canvas">
                ×{matches}
              </span>
            )}
            {mine > 0 && !disabled && (
              <button
                type="button"
                onClick={() => onClear(symbol.id)}
                aria-label={`Gỡ cược ${symbol.name}`}
                className={cn('absolute right-0 top-0 flex h-9 min-w-9 items-center justify-center gap-1 bg-ink px-1.5 text-xs font-bold text-canvas')}
              >
                {mine}
                <FaXmark className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
