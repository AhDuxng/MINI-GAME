// Ván Gián Điệp đang diễn ra: lần lượt chuyền máy xem từ, thảo luận theo thứ tự nói, bỏ phiếu loại và tổng kết vai
'use client';

import { useEffect, useState } from 'react';
import { FaCheck, FaComments, FaGavel, FaRotate, FaXmark } from 'react-icons/fa6';
import { ActionBar, GameStage } from '@/games/kit';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import { rampFill, rampWash } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import SpyCard from './SpyCard';
import SpyTimer from './SpyTimer';
import { aliveCounts, wordFor, type SpyState } from './spy-state';

interface SpyBoardProps {
  state: SpyState;
  timeLeftMs: number;
  onFlip: () => void;
  onHide: () => void;
  onStartVote: () => void;
  onBackToDiscuss: () => void;
  onEliminate: (index: number) => void;
  onRestart: () => void;
  onExit: () => void;
}

function RoleTag({ spy }: { spy: boolean }) {
  return (
    <span
      className="px-2 py-0.5 font-display text-xs font-bold tracking-wide text-[#12121a] rounded-md"
      style={{ background: rampFill(spy ? 3 : 7) }}
    >
      {spy ? 'GIÁN ĐIỆP' : 'DÂN'}
    </span>
  );
}

export default function SpyBoard({
  state,
  timeLeftMs,
  onFlip,
  onHide,
  onStartVote,
  onBackToDiscuss,
  onEliminate,
  onRestart,
  onExit,
}: SpyBoardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const { players, pair } = state;
  const counts = aliveCounts(players);
  const eliminated = state.lastEliminated === null ? null : players[state.lastEliminated];

  useEffect(() => {
    setSelected(null);
  }, [state.phase, state.round]);

  if (!pair) return null;

  if (state.phase === 'reveal') {
    const current = players[state.revealIndex];
    return (
      <>
        <GameStage theme="noir" onTap={state.revealed ? onHide : onFlip} className="flex flex-col items-center gap-6 px-4 pb-16 pt-8 text-center">
          <div>
            <p className="eyebrow">
              Người {state.revealIndex + 1}/{players.length}
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-ink">
              Chuyền máy cho <span className="text-ramp">{current.name}</span>
            </p>
            <p className="mt-1 text-sm text-muted">Chỉ {current.name} được nhìn màn hình lúc này.</p>
          </div>
          <SpyCard word={state.revealed ? wordFor(current, pair) : null} revealed={state.revealed} onFlip={onFlip} />
        </GameStage>
        <ActionBar>
          {state.revealed ? (
            <Button size="lg" onClick={onHide}>
              <FaCheck className="h-4 w-4" />
              Đã nhớ, ẩn đi
            </Button>
          ) : (
            <Button size="lg" onClick={onFlip}>
              Lật bài
            </Button>
          )}
        </ActionBar>
      </>
    );
  }

  if (state.phase === 'finished') {
    const civiliansWon = state.winner === 'civilians';
    return (
      <>
        <div className="surface overflow-hidden">
          <div className="px-5 py-6 text-center" style={{ background: rampWash(civiliansWon ? 7 : 3, 22) }}>
            <p className="eyebrow">Kết thúc ván</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-ink">{civiliansWon ? 'Dân làng chiến thắng!' : 'Gián điệp chiến thắng!'}</p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-line border-y border-line text-center">
            <div className="px-3 py-4">
              <p className="eyebrow">Từ của dân</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{pair.civilian}</p>
            </div>
            <div className="px-3 py-4">
              <p className="eyebrow">Từ gián điệp</p>
              <p className="mt-1 font-display text-2xl font-bold text-ramp-text-3">{pair.spy}</p>
            </div>
          </div>
          <ul className="divide-y divide-line">
            {players.map((player) => (
              <li key={player.name} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className={cn('font-semibold', player.alive ? 'text-ink' : 'text-muted line-through')}>{player.name}</span>
                <RoleTag spy={player.spy} />
              </li>
            ))}
          </ul>
        </div>
        <ActionBar>
          <Button size="lg" onClick={onRestart}>
            <FaRotate className="h-4 w-4" />
            Ván mới
          </Button>
          <Button variant="secondary" size="lg" onClick={onExit}>
            Đổi thiết lập
          </Button>
        </ActionBar>
      </>
    );
  }

  const alivePlayers = players.map((player, index) => ({ player, index })).filter(({ player }) => player.alive);

  return (
    <>
      {eliminated && (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-line px-4 py-3 rounded-xl" style={{ background: rampWash(eliminated.spy ? 3 : 7, 16) }}>
          <p className="font-semibold text-ink">
            <strong>{eliminated.name}</strong> đã bị loại
          </p>
          <RoleTag spy={eliminated.spy} />
        </div>
      )}

      {state.phase === 'discuss' ? (
        <GameStage theme="noir" onTap={onStartVote} className="flex flex-col gap-5 p-5 pb-16 sm:p-6 sm:pb-20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="eyebrow">Vòng {state.round} · thảo luận</p>
            <Badge>
              Còn {counts.civilians} dân · {counts.spies} gián điệp
            </Badge>
          </div>
          <p className="font-display text-2xl font-bold leading-tight text-ink">Lần lượt mô tả từ của mình bằng một câu</p>
          <SpyTimer timeLeftMs={timeLeftMs} totalMs={state.discussSeconds * 1000} />
          <ol className="grid gap-2 sm:grid-cols-2">
            {state.order.map((index, position) => (
              <li
                key={players[index].name}
                className={cn('flex items-center gap-3 rounded-xl border border-line bg-canvas/80 px-3 py-2.5', position === 0 && 'border-edge bg-elevated')}
              >
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center font-display text-sm font-bold text-[#12121a] rounded-md"
                  style={{ background: rampFill(position) }}
                >
                  {position + 1}
                </span>
                <span className="flex-1 truncate font-semibold text-ink">{players[index].name}</span>
                {position === 0 && <span className="text-xs font-bold text-muted">Nói trước</span>}
              </li>
            ))}
          </ol>
        </GameStage>
      ) : (
        <GameStage theme="noir" className="flex flex-col gap-5 p-5 pb-16 sm:p-6 sm:pb-20">
          <div>
            <p className="eyebrow">Vòng {state.round} · bỏ phiếu</p>
            <p className="mt-1 font-display text-2xl font-bold leading-tight text-ink">Ai là gián điệp?</p>
            <p className="mt-1 text-sm text-muted">Cả bàn thống nhất rồi chọn một người để loại.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {alivePlayers.map(({ player, index }) => (
              <button
                key={player.name}
                type="button"
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
                className={cn(
                  'h-12 truncate border px-3 font-display text-base font-bold transition-colors rounded-xl',
                  selected === index ? 'fill-ramp border-transparent' : 'border-line bg-canvas text-ink hover:bg-elevated',
                )}
              >
                {player.name}
              </button>
            ))}
          </div>
        </GameStage>
      )}

      <ActionBar>
        {state.phase === 'discuss' ? (
          <Button size="lg" onClick={onStartVote}>
            <FaGavel className="h-4 w-4" />
            Bỏ phiếu ngay
          </Button>
        ) : (
          <>
            <Button size="lg" disabled={selected === null} onClick={() => selected !== null && onEliminate(selected)}>
              <FaXmark className="h-4 w-4" />
              {selected === null ? 'Chọn người để loại' : `Loại ${players[selected].name}`}
            </Button>
            <Button variant="secondary" size="lg" onClick={onBackToDiscuss}>
              <FaComments className="h-4 w-4" />
              Thảo luận thêm
            </Button>
          </>
        )}
      </ActionBar>
    </>
  );
}
