// Màn chơi Bom Số: quả bom ngòi ngắn dần, khoảng an toàn cỡ lớn, bàn phím số, thanh khoảng số, rung màn hình khi nổ và bảng ai dính bom
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { FaArrowDown, FaArrowUp, FaBomb } from 'react-icons/fa6';
import { ActionBar, GameLayout, GameStage, RankingPanel } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import ResultModal from '@/shared/ui/ResultModal';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampFill } from '@/shared/lib/ramp';
import BombVisual from './BombVisual';
import Keypad from './Keypad';
import RangeBar from './RangeBar';
import { RANGE_OPTIONS, heat, remaining, safeMax, safeMin } from './number-bomb-rules';
import useNumberBomb from './useNumberBomb';

const RANGE_CHOICES = RANGE_OPTIONS.map((value) => ({ value, label: `1 – ${value}` }));

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
}

export default function NumberBombGame() {
  const { players } = usePlayers();
  const game = useNumberBomb(players);
  const { round } = game;
  const left = remaining(round);
  const ranking = Object.entries(game.tally).sort((a, b) => b[1] - a[1]);
  const { pressDigit, backspace, submit } = game;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^[0-9]$/.test(event.key)) pressDigit(Number(event.key));
      else if (event.key === 'Backspace') backspace();
      else if (event.key === 'Enter' && !round.exploded) submit();
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pressDigit, backspace, submit, round.exploded]);

  return (
    <>
      <GameLayout
        main={
          <>
            <motion.div animate={game.shake}>
              <GameStage theme="danger" onTap={game.round.exploded ? game.newRound : undefined} className="relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-5 pb-3 pt-5">
                  <p className="font-semibold text-muted">
                    {round.exploded ? 'Bom nổ trên tay ' : 'Lượt của '}
                    <span className="text-ramp font-display text-xl font-bold">{(round.exploded ? game.loser : game.currentPlayer) ?? 'người cầm máy'}</span>
                  </p>
                  <Badge>{round.exploded ? `Bom là số ${round.secret}` : `Còn ${left} số an toàn`}</Badge>
                </div>

                <div className="grid gap-4 p-4 sm:gap-6 sm:p-5 md:grid-cols-2 md:items-center">
                  <div className="text-center">
                    <BombVisual heat={heat(round)} exploded={round.exploded} secret={round.secret} />
                    <p className="eyebrow mt-2">{round.exploded ? 'Con số bom' : 'Khoảng an toàn'}</p>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.p
                        key={round.exploded ? 'boom' : `${round.low}-${round.high}`}
                        initial={{ y: 18, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -18, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="font-display text-4xl font-extrabold text-ink sm:text-5xl"
                      >
                        {round.exploded ? (
                          round.secret
                        ) : (
                          <>
                            {safeMin(round)} <span className="text-muted">–</span> {safeMax(round)}
                          </>
                        )}
                      </motion.p>
                    </AnimatePresence>
                    {left === 1 && !round.exploded && <p className="mt-1 text-sm font-bold text-ramp-text-3">Chỉ còn đúng một số, ai tới lượt người đó dính!</p>}
                  </div>

                  <div className="space-y-3">
                    <div className="flex h-16 items-center justify-center rounded-xl border-2 border-edge bg-black/40 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                      {game.input ? (
                        <motion.span key={game.input} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="font-display text-4xl font-extrabold text-ink">
                          {game.input}
                        </motion.span>
                      ) : (
                        <span className="font-display text-xl font-bold text-muted/60">{round.exploded ? 'Ván đã kết thúc' : 'Nhập số'}</span>
                      )}
                    </div>
                    <p className={game.error ? 'text-sm font-bold text-ramp-text-3' : 'text-sm text-muted'}>
                      {game.error ?? (round.exploded ? 'Bấm Ván mới để giấu bom lần nữa.' : `Đoán một số từ ${safeMin(round)} đến ${safeMax(round)}.`)}
                    </p>
                    <Keypad disabled={round.exploded} onDigit={game.pressDigit} onBackspace={game.backspace} onClear={game.clear} />
                  </div>
                </div>

                <div className="border-t border-white/10 bg-black/40 px-5 pb-6 pt-4">
                  <RangeBar round={round} />
                </div>

                <AnimatePresence>
                  {round.exploded && (
                    <motion.div
                      key="flash"
                      className="pointer-events-none absolute inset-0"
                      style={{ background: 'radial-gradient(circle, var(--ramp-0), var(--ramp-3))' }}
                      initial={{ opacity: 0.9 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9 }}
                    />
                  )}
                </AnimatePresence>
              </GameStage>
            </motion.div>

            <ActionBar>
              {round.exploded ? (
                <Button size="lg" onClick={game.newRound}>
                  <FaBomb className="h-4 w-4" />
                  Ván mới
                </Button>
              ) : (
                <Button size="lg" onClick={game.submit} disabled={!game.input}>
                  {game.input ? `Đoán số ${game.input}` : 'Nhập số để đoán'}
                </Button>
              )}
            </ActionBar>
          </>
        }
        aside={
          <>
            <Panel title="Khoảng số" stop={3}>
              <SegmentedControl
                label="Bom nằm trong khoảng"
                options={RANGE_CHOICES}
                value={game.max}
                onChange={game.changeMax}
                disabled={round.guesses.length > 0 && !round.exploded}
              />
              <p className="mt-3 text-xs font-semibold text-muted">Khoảng càng rộng ván càng dài. Đổi khoảng sẽ giấu bom mới.</p>
            </Panel>

            <Panel title="Diễn biến" stop={2}>
              {round.guesses.length === 0 ? (
                <p className="text-sm text-muted">Chưa ai đoán. Bom đang nằm đâu đó từ 1 đến {round.max}.</p>
              ) : (
                <ol className="space-y-2">
                  {[...round.guesses].reverse().map((guess) => (
                    <li key={guess.value} className="flex items-center gap-3 text-sm">
                      <span className="w-12 flex-shrink-0 font-display text-xl font-bold text-ink">{guess.value}</span>
                      <span className="flex-1 truncate font-semibold text-muted">{guess.player ?? 'Người cầm máy'}</span>
                      {guess.outcome === 'boom' ? (
                        <span className="px-2 py-0.5 font-display text-xs font-bold text-[#12121a] rounded-md" style={{ background: rampFill(3) }}>
                          BÙM!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-muted">
                          {guess.outcome === 'below' ? <FaArrowUp className="h-3 w-3" /> : <FaArrowDown className="h-3 w-3" />}
                          Bom {guess.outcome === 'below' ? 'lớn hơn' : 'nhỏ hơn'}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </Panel>

            <RankingPanel title="Bảng dính bom" stop={4} startStop={2} ranking={ranking} unit="ly" onReset={game.resetTally} />

            <PlayerPanel hint="Lượt đoán đi lần lượt theo danh sách, người dính bom mở màn ván sau." />
          </>
        }
      />

      <ResultModal
        open={game.resultOpen}
        onClose={game.closeResult}
        title="BÙM!"
        subtitle="Bom nổ trên tay:"
        result={game.loser ?? 'Người cầm máy'}
        detail={
          <p>
            Con số bom là <strong className="text-ramp-text-3">{round.secret}</strong>, sau {round.guesses.length} lượt đoán. Uống cạn một ly rồi mở màn ván mới!
          </p>
        }
        actions={[
          { label: 'Ván mới', onClick: game.newRound },
          { label: 'Đóng', onClick: game.closeResult, variant: 'secondary' },
        ]}
      />
    </>
  );
}
