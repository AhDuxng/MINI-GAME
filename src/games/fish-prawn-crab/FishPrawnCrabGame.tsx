// Màn chơi Bầu Cua: bát lắc 3D, chọn người cược và mệnh giá phỉnh, bàn cược 6 linh vật, bảng điểm và lịch sử lắc
'use client';

import { FaArrowRotateLeft, FaHandSparkles } from 'react-icons/fa6';
import { ActionBar, GameLayout, GameStage } from '@/games/kit';
import { PlayerPanel } from '@/features/players';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import ResultModal from '@/shared/ui/ResultModal';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { cn } from '@/shared/lib/utils';
import BetBoard from './BetBoard';
import BettorBar from './BettorBar';
import BowlStage from './BowlStage';
import { getSymbol, SymbolIcon } from '@/features/catalog';
import useFishPrawnCrab, { CHIPS } from './useFishPrawnCrab';

const CHIP_OPTIONS = CHIPS.map((value) => ({ value, label: `${value} điểm` }));

function formatChange(change: number) {
  return change > 0 ? `+${change}` : `${change}`;
}

export default function FishPrawnCrabGame() {
  const game = useFishPrawnCrab();
  const busy = game.phase !== 'betting';
  const revealed = !game.lidClosed && game.phase === 'betting';
  const rolledNames = game.roll?.map((id) => getSymbol(id).name).join(' · ') ?? '';

  return (
    <>
      <GameLayout
        main={
          <>
            <GameStage theme="tet" onTap={busy || !game.hasBets ? undefined : game.shake} className="overflow-hidden px-3 pb-4 pt-14 sm:pt-6">
              <BowlStage roll={game.roll} turns={game.turns} phase={game.phase} lidClosed={game.lidClosed} />
              <p className="mx-auto mt-1 w-fit max-w-full rounded-full bg-black/25 px-4 py-1.5 text-center text-sm font-bold text-[#ffe9c2]" aria-live="polite">
                {game.phase === 'shaking'
                  ? 'Đang lắc bát...'
                  : game.roll === null
                    ? 'Đặt cược vào linh vật rồi bấm Lắc'
                    : `Kết quả: ${rolledNames}`}
              </p>
            </GameStage>

            <BettorBar
              roster={game.roster}
              active={game.active}
              pointsOf={game.pointsOf}
              available={game.available}
              onSelect={game.setActive}
              disabled={busy}
            />

            <SegmentedControl label="Mệnh giá phỉnh" options={CHIP_OPTIONS} value={game.chip} onChange={game.setChip} disabled={busy} />

            <BetBoard
              myBets={game.bets[game.active] ?? {}}
              totals={game.tileTotals}
              roll={game.roll}
              revealed={revealed}
              disabled={busy}
              onPlace={game.placeBet}
              onClear={game.clearBet}
            />

            <ActionBar>
              <Button size="lg" onClick={game.shake} disabled={busy || !game.hasBets}>
                <FaHandSparkles className="h-4 w-4" />
                {game.phase === 'shaking' ? 'Đang lắc...' : game.hasBets ? 'Lắc' : 'Đặt cược để lắc'}
              </Button>
              {game.hasBets && !busy && (
                <Button variant="secondary" size="lg" onClick={game.clearAllBets}>
                  Gỡ hết cược
                </Button>
              )}
            </ActionBar>

            {game.usingFallback && (
              <p className="text-sm text-muted">Chưa đủ 2 người chơi nên đang dùng tên mặc định. Thêm người chơi ở khung bên cạnh nhé!</p>
            )}
          </>
        }
        aside={
          <>
            <Panel
              title="Bảng điểm"
              stop={3}
              action={
                <Button variant="ghost" size="sm" onClick={game.newGame} disabled={busy}>
                  <FaArrowRotateLeft className="h-3 w-3" />
                  Ván mới
                </Button>
              }
            >
              <ol className="divide-y divide-line border-y border-line">
                {game.scoreboard.map((row, index) => (
                  <li key={row.name} className="flex items-center gap-3 py-2.5">
                    <span className="w-6 font-display text-base font-bold text-muted">{index + 1}</span>
                    <span className={cn('min-w-0 flex-1 truncate font-semibold', index === 0 ? 'text-ramp font-display text-lg font-bold' : 'text-ink')}>
                      {row.name}
                    </span>
                    {row.change !== null && row.change !== 0 && (
                      <span className={cn('text-xs font-bold', row.change > 0 ? 'text-ramp-text-8' : 'text-ramp-text-3')}>{formatChange(row.change)}</span>
                    )}
                    <span className="font-display text-base font-bold text-ink">{row.points.toLocaleString('vi-VN')}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted">Điểm ảo dùng để vui, không quy đổi thành tiền hay hiện vật.</p>
            </Panel>

            <Panel title="Lịch sử lắc" stop={1}>
              {game.history.length === 0 ? (
                <p className="text-sm text-muted">Chưa có ván nào.</p>
              ) : (
                <ol className="space-y-2">
                  {game.history.map((record, index) => (
                    <li key={record.id} className="flex items-center gap-3">
                      <span className="w-6 font-display text-sm font-bold text-muted">#{game.history.length - index}</span>
                      <span className="flex gap-1">
                        {record.roll.map((id, dieIndex) => (
                          <span key={dieIndex} className="flex h-9 w-9 items-center justify-center border border-line bg-canvas rounded-lg">
                            <SymbolIcon id={id} className="h-7 w-7" />
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>

            <PlayerPanel disabled={busy} hint="Danh sách người chơi dùng chung với các game khác. Đổi danh sách sẽ xoá cược đang đặt." />
          </>
        }
      />

      <ResultModal
        open={game.resultOpen}
        onClose={game.closeResult}
        title="Mở bát!"
        subtitle="Ba linh vật ra là:"
        result={rolledNames}
        detail={
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {game.roll?.map((id, index) => (
                <span key={index} className="flex h-14 w-14 items-center justify-center border-2 border-edge bg-canvas rounded-xl">
                  <SymbolIcon id={id} className="h-11 w-11" />
                </span>
              ))}
            </div>
            {game.changes && Object.keys(game.changes).length > 0 && (
              <ul className="space-y-1.5 text-left">
                {Object.entries(game.changes).map(([name, change]) => (
                  <li key={name} className="flex items-center justify-between gap-3">
                    <span className="truncate font-semibold">{name}</span>
                    <span className={cn('font-display text-base font-bold', change > 0 ? 'text-ramp-text-8' : change < 0 ? 'text-ramp-text-3' : 'text-muted')}>
                      {change === 0 ? 'Hoà' : `${formatChange(change)} điểm`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        }
        actions={[{ label: 'Đặt cược ván tiếp', onClick: game.closeResult }]}
      />
    </>
  );
}
