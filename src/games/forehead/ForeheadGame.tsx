// Màn chơi Đoán Trên Trán: chọn chủ đề và thời gian, màn đoán toàn màn hình với chữ thật to cho cả nhóm đọc, nửa trái bỏ qua, nửa phải đoán đúng, chớp xanh hoặc cam, tổng kết lượt và bảng điểm
'use client';

import { FaCheck, FaCrown, FaForward, FaMobileScreen, FaPlay, FaXmark } from 'react-icons/fa6';
import { ActionBar, GameLayout, GameStage, RankingPanel, useFullscreenLock } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import { FOREHEAD_DECKS } from '@/data';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import useForehead from './useForehead';
import useTiltGesture from './useTiltGesture';

const DURATION_OPTIONS = [60, 90, 120].map((value) => ({ value, label: `${value} giây` }));
const CONTROL_OPTIONS = [
  { value: 'tilt', label: 'Chạm + nghiêng máy' },
  { value: 'tap', label: 'Chỉ chạm' },
];
const FLASH_BACKGROUND = { correct: '#1f9d5c', pass: '#e07b24' };
const IDLE_BACKGROUND = 'radial-gradient(120% 100% at 50% 0%, #4a2a80 0%, #26134a 55%, #150a2b 100%)';

function PlayScreen({ game }: { game: ReturnType<typeof useForehead> }) {
  const correct = game.results.filter((result) => result.correct).length;
  const progress = game.remaining / game.duration;

  useTiltGesture(game.phase === 'playing' && game.tiltReady && game.flash === null, (direction) => game.mark(direction === 'down'));

  if (game.phase === 'summary') {
    return (
      <div className="fixed inset-0 z-[70] overflow-y-auto px-5 py-10 text-white" style={{ background: IDLE_BACKGROUND }}>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-white/60">Hết giờ · {game.deck.name}</p>
          <p className="font-display text-3xl font-extrabold">{game.guesser ? `${game.guesser} đoán đúng` : 'Đoán đúng'}</p>
          <p className="text-ramp font-display text-8xl font-extrabold leading-none">{correct}</p>
          <p className="text-sm font-semibold text-white/70">trên {game.results.length} từ đã ra</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {game.results.map((result, index) => (
              <li
                key={`${result.word}-${index}`}
                className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold', result.correct ? 'border-transparent text-[#12121a]' : 'border-white/20 text-white/60 line-through')}
                style={result.correct ? { background: rampFill(8) } : undefined}
              >
                {result.correct ? <FaCheck className="h-3 w-3" /> : <FaForward className="h-3 w-3" />}
                {result.word}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
            <Button size="lg" onClick={game.nextTurn}>
              {game.nextGuesser ? `Chuyền máy cho ${game.nextGuesser}` : 'Lượt tiếp theo'}
            </Button>
            <Button size="lg" variant="secondary" onClick={game.close}>
              Về màn chọn chủ đề
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[70] touch-none select-none overflow-hidden text-white transition-[background] duration-150 [-webkit-touch-callout:none]"
      style={{ background: game.flash ? FLASH_BACKGROUND[game.flash] : IDLE_BACKGROUND }}
    >
      {game.phase === 'playing' && (
        <div className="absolute inset-0 grid grid-cols-2">
          <button type="button" aria-label="Bỏ qua từ này" onPointerDown={() => game.mark(false)} className="flex items-end justify-start p-5 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-sm font-extrabold uppercase tracking-wide">
              <FaForward className="h-3.5 w-3.5 rotate-180" />
              Bỏ qua
            </span>
          </button>
          <button type="button" aria-label="Đoán đúng" onPointerDown={() => game.mark(true)} className="flex items-end justify-end p-5 text-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-sm font-extrabold uppercase tracking-wide">
              Đúng rồi
              <FaCheck className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-4 px-5 pt-4">
        <span className="font-display text-3xl font-extrabold tabular-nums">{game.phase === 'playing' ? game.remaining : game.duration}</span>
        <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/15">
          <span className="block h-full rounded-full transition-[width] duration-200 ease-linear" style={{ width: `${(game.phase === 'playing' ? progress : 1) * 100}%`, background: progress < 0.2 ? '#ff6b5b' : rampFill(1) }} />
        </span>
        <span className="inline-flex items-center gap-1.5 font-display text-xl font-extrabold">
          <FaCheck className="h-4 w-4" />
          {correct}
        </span>
      </div>
      <button
        type="button"
        onClick={game.stop}
        aria-label="Dừng lượt"
        className="absolute right-4 top-16 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30"
      >
        <FaXmark className="h-4 w-4" />
      </button>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        {game.phase === 'countdown' && (
          <>
            <FaMobileScreen className="h-10 w-10 text-white/70" />
            <p className="font-display text-2xl font-extrabold">Áp máy lên trán, màn hình quay ra ngoài!</p>
            <p className="font-display text-[9rem] font-extrabold leading-none">{game.count}</p>
          </>
        )}
        {game.phase === 'playing' && (
          <>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/60">{game.flash === 'correct' ? 'Chính xác!' : game.flash === 'pass' ? 'Bỏ qua' : game.deck.name}</p>
            <p className="text-balance font-display text-[clamp(2.75rem,12vw,8rem)] font-extrabold leading-[1.02]">{game.word}</p>
            {game.tiltReady && <p className="text-sm font-semibold text-white/60">Cúi máy xuống: đúng · Ngửa máy lên: bỏ qua</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default function ForeheadGame() {
  const { players } = usePlayers();
  const game = useForehead(players);
  const playing = game.phase !== 'setup';
  const ranking = Object.entries(game.scores).sort((a, b) => b[1] - a[1]);

  useFullscreenLock(playing);

  return (
    <>
      <GameLayout
        main={
          <>
            <GameStage theme="show" onTap={() => void game.start()} className="space-y-5 px-4 py-6 sm:px-6">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="eyebrow">Người đoán</p>
                  <p className="text-ramp font-display text-3xl font-extrabold leading-tight">{game.guesser ?? 'Người cầm máy'}</p>
                </div>
                <p className="flex items-center gap-2 text-sm font-semibold text-muted">
                  <FaMobileScreen className="h-4 w-4" />
                  Áp máy lên trán, cả nhóm gợi ý
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {FOREHEAD_DECKS.map((deck, index) => {
                  const selected = deck.id === game.deckId;
                  const locked = deck.vip && !game.isVip;
                  return (
                    <button
                      key={deck.id}
                      type="button"
                      onClick={() => game.chooseDeck(deck.id)}
                      aria-pressed={selected}
                      className={cn(
                        'relative flex min-h-[84px] flex-col justify-between gap-2 rounded-xl border-2 p-3 text-left transition-transform duration-200 active:scale-[0.98]',
                        selected ? 'border-edge text-[#12121a]' : 'border-white/10 bg-white/5 text-ink',
                      )}
                      style={selected ? { background: rampFill(index) } : undefined}
                    >
                      <span className="font-display text-base font-bold leading-tight">{deck.name}</span>
                      <span className={cn('flex items-center gap-1.5 text-xs font-bold', selected ? 'text-[#12121a]/70' : 'text-muted')}>
                        {deck.words.length} từ
                        {deck.vip && <FaCrown className={cn('h-3 w-3', locked && !selected && 'text-ramp-text-1')} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GameStage>

            <ActionBar>
              <Button size="lg" onClick={() => void game.start()}>
                <FaPlay className="h-4 w-4" />
                Bắt đầu lượt {game.duration} giây
              </Button>
            </ActionBar>
          </>
        }
        aside={
          <>
            <Panel title="Thiết lập" stop={5}>
              <div className="space-y-4">
                <SegmentedControl label="Thời gian mỗi lượt" options={DURATION_OPTIONS} value={game.duration} onChange={game.setDuration} />
                <SegmentedControl label="Cách đánh dấu" options={CONTROL_OPTIONS} value={game.tiltWanted ? 'tilt' : 'tap'} onChange={(value) => game.setTiltWanted(value === 'tilt')} />
                <p className="text-xs font-semibold text-muted">Chạm nửa phải màn hình khi đoán đúng, nửa trái để bỏ qua. Bật nghiêng máy thì chỉ cần cúi đầu hoặc ngửa đầu.</p>
              </div>
            </Panel>
            <RankingPanel title="Bảng điểm" ranking={ranking} unit="từ" onReset={game.resetScores} />
            <PlayerPanel hint="Máy chuyền lần lượt theo danh sách, mỗi người một lượt đoán." />
          </>
        }
      />
      {playing && <PlayScreen game={game} />}
    </>
  );
}
