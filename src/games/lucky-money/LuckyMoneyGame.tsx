// Màn chơi Rút bao lì xì: chủ xị đặt ngân sách và số bao, bàn bao lì xì 3D, lượt rút, bảng lộc và hộp thoại mở bao
'use client';

import { useEffect, useState } from 'react';
import { FaRotate } from 'react-icons/fa6';
import { GameLayout, GameStage } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import ResultModal from '@/shared/ui/ResultModal';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampFill } from '@/shared/lib/ramp';
import { cn, formatCurrency } from '@/shared/lib/utils';
import EnvelopeCard from './EnvelopeCard';
import { AMOUNT_STEP, funCount, minBudget, prizeLabel } from './lucky-rules';
import useLuckyMoney, { BOARD_SIZES, BUDGET_PRESETS } from './useLuckyMoney';

const SIZE_OPTIONS = BOARD_SIZES.map((size) => ({ value: size, label: `${size} bao` }));
const BUDGET_OPTIONS = BUDGET_PRESETS.map((value) => ({ value, label: value >= 1000000 ? `${value / 1000000} triệu` : `${value / 1000}k` }));

const BOARD_LAYOUT: Record<number, string> = {
  6: 'max-w-md',
  9: 'max-w-md',
  12: 'max-w-2xl sm:grid-cols-4',
  16: 'max-w-2xl sm:grid-cols-4',
  20: 'sm:grid-cols-5',
};

export default function LuckyMoneyGame() {
  const { players } = usePlayers();
  const game = useLuckyMoney(players);
  const revealed = game.revealed;
  const [budgetDraft, setBudgetDraft] = useState(String(game.settings.budget));
  const funTotal = funCount(game.settings);

  useEffect(() => {
    setBudgetDraft(String(game.settings.budget));
  }, [game.settings.budget]);

  const applyBudget = () => {
    const value = Math.round(Number(budgetDraft) / AMOUNT_STEP) * AMOUNT_STEP;
    if (Number.isFinite(value) && value > 0) game.updateSettings({ budget: value });
    else setBudgetDraft(String(game.settings.budget));
  };

  return (
    <>
      <GameLayout
        main={
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-elevated px-4 py-3 rounded-xl">
              <p className="font-semibold text-muted">
                {game.allOpened ? (
                  'Đã rút hết bao lì xì!'
                ) : (
                  <>
                    Lượt rút của <span className="text-ramp font-display text-2xl font-extrabold">{game.currentPlayer ?? 'bạn'}</span>
                  </>
                )}
              </p>
              <Badge>
                Đã mở {game.openedCount}/{game.board.length}
              </Badge>
            </div>

            <GameStage theme="tet" className="px-4 pb-6 pt-14 sm:px-6 sm:pt-12">
              <div className={cn('mx-auto grid grid-cols-3 gap-x-3 gap-y-14 pt-12 sm:gap-x-4 sm:gap-y-16 sm:pt-20', BOARD_LAYOUT[game.settings.size])}>
                {game.board.map((envelope) => (
                  <EnvelopeCard key={envelope.id} envelope={envelope} onOpen={game.open} />
                ))}
              </div>
            </GameStage>

            {game.allOpened && (
              <Button size="lg" className="w-full" onClick={game.reshuffle}>
                <FaRotate className="h-4 w-4" />
                Xếp bàn mới
              </Button>
            )}
          </>
        }
        aside={
          <>
            <Panel title="Bảng lộc" stop={3} action={<Badge>{formatCurrency(game.handedOut)}</Badge>}>
              {game.tally.length === 0 ? (
                <p className="text-sm text-muted">Chưa ai rút bao nào.</p>
              ) : (
                <ol className="divide-y divide-line">
                  {game.tally.map((entry, index) => (
                    <li key={entry.player} className="py-2.5">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center font-display text-sm font-bold text-[#12121a] rounded-md"
                          style={{ background: rampFill(index * 2) }}
                        >
                          {index + 1}
                        </span>
                        <span className={cn('flex-1 truncate font-semibold', index === 0 ? 'text-ramp font-display text-lg font-bold' : 'text-ink')}>
                          {entry.player}
                        </span>
                        <span className="font-display text-base font-bold text-ink">{formatCurrency(entry.total)}</span>
                      </div>
                      {entry.gifts.length > 0 && <p className="mt-1 pl-10 text-xs text-muted">{entry.gifts.join(' · ')}</p>}
                    </li>
                  ))}
                </ol>
              )}
              <p className="mt-4 border-t border-line pt-3 text-sm text-muted">
                Đã phát <strong className="text-ink">{formatCurrency(game.handedOut)}</strong> / {formatCurrency(game.budget)}
              </p>
            </Panel>

            <Panel title="Thiết lập bàn" stop={1}>
              <div className="space-y-5">
                <SegmentedControl label="Số bao" options={SIZE_OPTIONS} value={game.settings.size} onChange={(size) => game.updateSettings({ size })} />
                <SegmentedControl
                  label="Tổng ngân sách"
                  options={BUDGET_OPTIONS}
                  value={game.settings.budget}
                  onChange={(budget) => game.updateSettings({ budget })}
                />
                <label className="block space-y-2">
                  <span className="eyebrow">Hoặc nhập số khác (đồng)</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={minBudget(game.settings)}
                    step={AMOUNT_STEP * 10}
                    value={budgetDraft}
                    onChange={(event) => setBudgetDraft(event.target.value)}
                    onBlur={applyBudget}
                    onKeyDown={(event) => event.key === 'Enter' && applyBudget()}
                    className="field font-display text-lg font-bold"
                  />
                </label>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={game.settings.withFun}
                    onChange={(event) => game.updateSettings({ withFun: event.target.checked })}
                    className="h-5 w-5 accent-[var(--ramp-3)]"
                  />
                  Trộn bao vui (uống 1 ly, hát, rút thêm...)
                </label>
                <p className="text-sm text-muted">
                  {formatCurrency(game.settings.budget)} chia ngẫu nhiên vào {game.settings.size - funTotal} bao tiền
                  {funTotal > 0 && ` và ${funTotal} bao vui`}.
                </p>
                <Button variant="secondary" size="sm" className="w-full" onClick={game.reshuffle}>
                  <FaRotate className="h-3 w-3" />
                  Xáo lại bàn
                </Button>
              </div>
            </Panel>

            <PlayerPanel hint="Thêm người chơi để game tự xoay lượt rút và cộng lộc cho từng người." />
          </>
        }
      />

      <ResultModal
        open={game.revealOpen}
        onClose={game.closeReveal}
        title={revealed?.openedBy ? `Lộc của ${revealed.openedBy}` : 'Bạn nhận được'}
        subtitle="Trong bao lì xì là:"
        result={revealed && prizeLabel(revealed.prize)}
        detail={
          revealed && (
            <>
              <p className="font-display text-lg font-bold">&ldquo;{revealed.wish}&rdquo;</p>
              {revealed.prize.extraTurn && <p className="mt-2 text-sm font-bold text-ramp-text-8">Bạn được rút thêm một bao nữa!</p>}
            </>
          )
        }
      />
    </>
  );
}
