// Màn chơi Vẽ Nhanh Đoán Lẹ: tờ giấy vẽ trên bảng gỗ, bấm giữ để xem lén từ khoá, đồng hồ đếm ngược, hộp màu, cỡ bút, tẩy, hoàn tác, chọn người đoán đúng và bảng điểm
'use client';

import { useRef, useState } from 'react';
import { FaArrowRight, FaCheck, FaEraser, FaEye, FaPaintbrush, FaRotateLeft, FaStopwatch, FaTrashCan } from 'react-icons/fa6';
import { ActionBar, GameLayout, GameStage, RankingPanel } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import { DRAW_DECKS } from '@/data';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import DrawingBoard, { type DrawingBoardHandle } from './DrawingBoard';
import useDrawGuess from './useDrawGuess';

const INKS = ['#1f2328', '#e5484d', '#f08a24', '#e8b10c', '#22a565', '#2563eb', '#8b5cf6', '#8b5d3b'];
const PAPER = '#ffffff';
const SIZES = [4, 9, 18];
const DURATION_OPTIONS = [45, 60, 90].map((value) => ({ value, label: `${value} giây` }));

function PeekButton({ word }: { word: string }) {
  const [peeking, setPeeking] = useState(false);
  return (
    <button
      type="button"
      onPointerDown={() => setPeeking(true)}
      onPointerUp={() => setPeeking(false)}
      onPointerLeave={() => setPeeking(false)}
      onPointerCancel={() => setPeeking(false)}
      onKeyDown={(event) => (event.key === ' ' || event.key === 'Enter') && setPeeking(true)}
      onKeyUp={() => setPeeking(false)}
      onContextMenu={(event) => event.preventDefault()}
      className={cn(
        'flex min-h-[88px] w-full max-w-sm select-none items-center justify-center gap-2 rounded-2xl border-2 border-edge px-5 py-4 font-display font-extrabold transition-colors',
        peeking ? 'bg-[#12121a] text-white' : 'bg-elevated text-ink',
      )}
    >
      {peeking ? <span className="text-balance text-3xl leading-tight sm:text-4xl">{word}</span> : (
        <>
          <FaEye className="h-5 w-5" />
          <span className="text-lg">Bấm giữ để xem từ</span>
        </>
      )}
    </button>
  );
}

export default function DrawGuessGame() {
  const { players } = usePlayers();
  const game = useDrawGuess(players);
  const board = useRef<DrawingBoardHandle>(null);
  const [ink, setInk] = useState(INKS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [erasing, setErasing] = useState(false);
  const [picking, setPicking] = useState(false);
  const drawing = game.phase === 'drawing';
  const guessers = players.filter((name) => name !== game.drawer);
  const ranking = Object.entries(game.scores).sort((a, b) => b[1] - a[1]);
  const deckOptions = DRAW_DECKS.map((deck) => ({ value: deck.id, label: deck.vip && !game.isVip ? `${deck.name} 👑` : deck.name }));

  const claim = () => {
    if (guessers.length === 0) {
      game.markGuessed(null);
      return;
    }
    setPicking(true);
  };

  const credit = (name: string | null) => {
    setPicking(false);
    game.markGuessed(name);
  };

  const passOn = () => {
    setPicking(false);
    game.nextDrawer();
    game.newTurn();
  };

  return (
    <GameLayout
      main={
        <>
          <GameStage theme="chalk" onTap={game.phase === 'idle' ? game.newTurn : game.phase === 'reveal' ? passOn : undefined} className="space-y-3 p-3 sm:p-5">
            <div className="flex items-center justify-between gap-3 px-1">
              <div className="min-w-0">
                <p className="eyebrow">Người vẽ</p>
                <p className="truncate font-display text-2xl font-extrabold text-ink">{game.drawer ?? 'Người cầm máy'}</p>
              </div>
              <div className="flex items-center gap-2">
                {drawing && <PeekMini word={game.word} />}
                <span className={cn('inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-display text-xl font-extrabold tabular-nums', drawing && game.remaining <= 10 ? 'border-transparent bg-[#e5484d] text-white' : 'border-white/15 bg-black/25 text-ink')}>
                  <FaStopwatch className="h-4 w-4" />
                  {drawing || game.phase === 'reveal' ? game.remaining : game.duration}
                </span>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-edge bg-white shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)]">
              <DrawingBoard key={game.round} ref={board} color={erasing ? PAPER : ink} size={erasing ? size * 2.2 : size} disabled={!drawing} />

              {game.phase === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white p-6 text-center text-[#1f2328]">
                  <FaPaintbrush className="h-10 w-10" style={{ color: rampFill(5) }} />
                  <p className="font-display text-2xl font-extrabold">Lượt vẽ của {game.drawer ?? 'người cầm máy'}</p>
                  <p className="max-w-xs text-sm font-semibold text-[#5b616b]">Bấm Lượt mới để nhận từ khoá. Chỉ người vẽ được nhìn, cả nhóm còn lại đoán.</p>
                </div>
              )}

              {game.phase === 'ready' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white p-5 text-center text-[#1f2328]">
                  <p className="font-display text-xl font-extrabold">Chỉ {game.drawer ?? 'người vẽ'} được xem!</p>
                  <PeekButton word={game.word} />
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5b616b]">
                    {game.deck.name} · {game.duration} giây
                  </p>
                </div>
              )}

              {game.phase === 'reveal' && (
                <div className="absolute inset-x-3 bottom-3 rounded-xl border-2 border-edge bg-white/95 p-4 text-center text-[#1f2328] shadow-lg">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#5b616b]">Đáp án</p>
                  <p className="font-display text-3xl font-extrabold leading-tight">{game.word}</p>
                  <p className="mt-1 text-sm font-semibold">
                    {game.solved
                      ? game.guessedBy
                        ? `${game.guessedBy} đoán đúng! ${game.drawer ?? 'Người vẽ'} và ${game.guessedBy} cùng được 1 điểm.`
                        : 'Có người đoán đúng, người vẽ được 1 điểm.'
                      : 'Hết giờ mà chưa ai đoán ra!'}
                  </p>
                </div>
              )}
            </div>

            <div className={cn('flex flex-wrap items-center justify-between gap-3 px-1 transition-opacity', !drawing && 'pointer-events-none opacity-40')}>
              <div className="flex flex-wrap items-center gap-1.5">
                {INKS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Màu ${color}`}
                    aria-pressed={!erasing && ink === color}
                    onClick={() => {
                      setInk(color);
                      setErasing(false);
                    }}
                    className={cn('h-8 w-8 rounded-full border-2 transition-transform', !erasing && ink === color ? 'scale-110 border-edge' : 'border-white/30')}
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                {SIZES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`Cỡ nét ${value}`}
                    aria-pressed={size === value}
                    onClick={() => setSize(value)}
                    className={cn('flex h-9 w-9 items-center justify-center rounded-lg border', size === value ? 'border-edge bg-white/15' : 'border-white/15 bg-black/20')}
                  >
                    <span className="rounded-full bg-ink" style={{ width: value / 1.6 + 2, height: value / 1.6 + 2 }} />
                  </button>
                ))}
                <button type="button" aria-label="Tẩy" aria-pressed={erasing} onClick={() => setErasing((value) => !value)} className={cn('flex h-9 w-9 items-center justify-center rounded-lg border text-ink', erasing ? 'border-edge bg-white/15' : 'border-white/15 bg-black/20')}>
                  <FaEraser className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Hoàn tác" onClick={() => board.current?.undo()} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/20 text-ink">
                  <FaRotateLeft className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Xoá hết" onClick={() => board.current?.clear()} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/20 text-ink">
                  <FaTrashCan className="h-4 w-4" />
                </button>
              </div>
            </div>
          </GameStage>

          {picking && drawing && (
            <div className="surface space-y-3 p-4">
              <p className="font-display text-lg font-bold text-ink">Ai đoán đúng? Chạm tên để cộng điểm</p>
              <div className="flex flex-wrap gap-2">
                {guessers.map((name, index) => (
                  <button key={name} type="button" onClick={() => credit(name)} className="flex h-11 items-center gap-2 rounded-xl border border-line bg-canvas px-4 font-display text-base font-bold text-ink hover:bg-elevated">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: rampFill(index) }} />
                    {name}
                  </button>
                ))}
                <button type="button" onClick={() => credit(null)} className="flex h-11 items-center rounded-xl border border-line px-4 text-sm font-bold text-muted hover:bg-elevated">
                  Không ghi tên
                </button>
              </div>
            </div>
          )}

          <ActionBar>
            {game.phase === 'idle' && (
              <Button size="lg" onClick={game.newTurn}>
                Lượt mới
                <FaArrowRight className="h-4 w-4" />
              </Button>
            )}
            {game.phase === 'ready' && (
              <Button size="lg" onClick={game.startDrawing}>
                <FaPaintbrush className="h-4 w-4" />
                Đã nhớ, bắt đầu vẽ
              </Button>
            )}
            {drawing && (
              <>
                <Button size="lg" variant="secondary" onClick={game.giveUp} className="max-w-[38%]">
                  Bỏ cuộc
                </Button>
                <Button size="lg" onClick={claim}>
                  <FaCheck className="h-4 w-4" />
                  Đoán đúng rồi!
                </Button>
              </>
            )}
            {game.phase === 'reveal' && (
              <Button size="lg" onClick={passOn}>
                {game.nextDrawerName ? `Chuyền máy cho ${game.nextDrawerName}` : 'Lượt tiếp theo'}
                <FaArrowRight className="h-4 w-4" />
              </Button>
            )}
          </ActionBar>
        </>
      }
      aside={
        <>
          <Panel title="Bộ từ và thời gian" stop={5}>
            <div className="space-y-4">
              <SegmentedControl label="Bộ từ khoá" options={deckOptions} value={game.deckId} onChange={game.chooseDeck} disabled={drawing} />
              <SegmentedControl label="Thời gian mỗi lượt" options={DURATION_OPTIONS} value={game.duration} onChange={game.setDuration} disabled={drawing} />
            </div>
          </Panel>
          <RankingPanel title="Bảng điểm" ranking={ranking} unit="điểm" onReset={game.resetScores} />
          <PlayerPanel hint="Lượt vẽ chuyền lần lượt theo danh sách, ai đoán đúng thì chạm tên người đó." />
        </>
      }
    />
  );
}

function PeekMini({ word }: { word: string }) {
  const [peeking, setPeeking] = useState(false);
  return (
    <button
      type="button"
      onPointerDown={() => setPeeking(true)}
      onPointerUp={() => setPeeking(false)}
      onPointerLeave={() => setPeeking(false)}
      onPointerCancel={() => setPeeking(false)}
      onContextMenu={(event) => event.preventDefault()}
      aria-label="Bấm giữ để xem lại từ"
      className="inline-flex h-10 select-none items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-3 text-sm font-bold text-ink"
    >
      <FaEye className="h-4 w-4" />
      {peeking ? word : 'Xem lại'}
    </button>
  );
}
