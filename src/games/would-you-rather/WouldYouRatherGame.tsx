// Màn chơi Này Hay Kia: hai thẻ lựa chọn đối đầu trên quầy bar, đếm ngược 3-2-1 rồi "Chọn!", ghi phe từng người hoặc đếm tay, dấu "UỐNG!" đóng lên phe thua và bảng bị phạt
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowRight, FaBeerMugEmpty, FaMinus, FaPlus, FaRotate } from 'react-icons/fa6';
import { ActionBar, GameLayout, GameStage, LockedTeaser, RankingPanel, levelLabel } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import useWouldYouRather, { type Side } from './useWouldYouRather';


const SIDES: { side: Side; label: string; stop: number }[] = [
  { side: 'a', label: 'NÀY', stop: 2 },
  { side: 'b', label: 'KIA', stop: 7 },
];

function verdictText(outcome: 'a' | 'b' | 'tie' | 'unanimous') {
  if (outcome === 'unanimous') return 'Cả bàn đồng lòng, không ai phải uống!';
  if (outcome === 'tie') return 'Hai phe bằng nhau, cả bàn cùng cạn!';
  return `Phe ${outcome === 'a' ? 'NÀY' : 'KIA'} ít người hơn, uống đi nào!`;
}

export default function WouldYouRatherGame() {
  const { players } = usePlayers();
  const game = useWouldYouRather(players);
  const voting = game.phase === 'voting';
  const stageAction = { idle: game.next, reading: game.startCountdown, countdown: undefined, voting: game.settle, result: game.next }[game.phase];
  const showVotes = voting || game.phase === 'result';
  const losing = game.verdict?.outcome;

  return (
    <GameLayout
      main={
        <>
          <GameStage theme="bar" onTap={stageAction} className="relative overflow-hidden px-4 pb-8 pt-6 sm:px-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="chip">{game.card ? `Câu ${game.round} · ${levelLabel(game.card.level)}` : 'Chưa rút câu'}</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted">Phe ít người hơn uống</span>
            </div>

            <div className="relative grid grid-cols-2 gap-3 sm:gap-5">
              {SIDES.map(({ side, label, stop }) => {
                const text = game.card ? game.card[side] : null;
                const names = Object.entries(game.votes).filter(([, chosen]) => chosen === side).map(([name]) => name);
                const drinksHere = losing === side || losing === 'tie';
                return (
                  <motion.div
                    key={`${side}-${game.round}`}
                    initial={{ opacity: 0, y: 18, rotate: side === 'a' ? -3 : 3 }}
                    animate={{ opacity: 1, y: 0, rotate: side === 'a' ? -1.5 : 1.5 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: side === 'a' ? 0 : 0.08 }}
                    data-theme="light"
                    className="relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border-2 border-edge bg-canvas shadow-[0_24px_40px_-22px_rgba(0,0,0,0.8)] sm:min-h-[260px]"
                  >
                    <div className="flex items-center justify-between px-3 py-2 sm:px-4" style={{ background: rampFill(stop) }}>
                      <span className="font-display text-lg font-extrabold tracking-wider text-[#12121a]">{label}</span>
                      {showVotes && <span className="rounded-full bg-[#12121a]/15 px-2.5 py-0.5 font-display text-sm font-extrabold text-[#12121a]">{game.counts[side]} người</span>}
                    </div>
                    <div className="flex flex-1 items-center justify-center p-3 text-center sm:p-5">
                      <p className="text-balance font-display text-xl font-extrabold leading-snug text-ink sm:text-3xl">{text ?? '?'}</p>
                    </div>
                    {showVotes && names.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 px-3 pb-3">
                        {names.map((name) => (
                          <span key={name} className="rounded-full border border-line bg-elevated px-2 py-0.5 text-[11px] font-bold text-ink">
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                    <AnimatePresence>
                      {game.phase === 'result' && drinksHere && (
                        <motion.span
                          className="absolute right-2 top-12 rounded-lg border-2 border-[#e5484d] bg-canvas/90 px-3 py-1 font-display text-2xl font-extrabold text-[#e5484d] sm:text-3xl"
                          initial={{ scale: 3, rotate: -30, opacity: 0 }}
                          animate={{ scale: 1, rotate: -12, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                        >
                          UỐNG!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-edge bg-[#1c110b] font-display text-sm font-extrabold text-[#fbc175] shadow-lg sm:h-14 sm:w-14 sm:text-base">
                VS
              </span>
            </div>

            {game.verdict && <p className="mt-5 text-center font-display text-xl font-extrabold text-ink sm:text-2xl">{verdictText(game.verdict.outcome)}</p>}

            <AnimatePresence>
              {game.phase === 'countdown' && (
                <motion.div key="countdown" className="absolute inset-0 flex items-center justify-center bg-[#120a07]/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={game.count}
                      className="text-ramp font-display text-[9rem] font-extrabold leading-none"
                      initial={{ scale: 2.4, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.3, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    >
                      {game.count > 0 ? game.count : 'CHỌN!'}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </GameStage>

          {voting && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface p-4">
              {game.byName ? (
                <>
                  <p className="mb-3 font-display text-lg font-bold text-ink">Mỗi người chọn phe nào? Chạm để ghi</p>
                  <ul className="space-y-2">
                    {players.map((name) => (
                      <li key={name} className="flex items-center gap-2">
                        <span className="flex-1 truncate font-semibold text-ink">{name}</span>
                        {SIDES.map(({ side, label, stop }) => {
                          const active = game.votes[name] === side;
                          return (
                            <button
                              key={side}
                              type="button"
                              aria-pressed={active}
                              onClick={() => game.vote(name, side)}
                              className={cn('h-10 w-20 rounded-xl border font-display text-sm font-extrabold transition-colors', active ? 'border-transparent text-[#12121a]' : 'border-line bg-canvas text-muted hover:bg-elevated')}
                              style={active ? { background: rampFill(stop) } : undefined}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="mb-3 font-display text-lg font-bold text-ink">Đếm số tay giơ cho từng phe</p>
                  <div className="grid grid-cols-2 gap-3">
                    {SIDES.map(({ side, label, stop }) => (
                      <div key={side} className="flex items-center justify-between gap-2 rounded-xl border border-line p-2">
                        <button type="button" aria-label={`Bớt một người phe ${label}`} onClick={() => game.adjustHand(side, -1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink hover:bg-elevated">
                          <FaMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-center">
                          <span className="block text-xs font-extrabold" style={{ color: `var(--ramp-text-${stop})` }}>
                            {label}
                          </span>
                          <span className="font-display text-2xl font-extrabold text-ink">{game.counts[side]}</span>
                        </span>
                        <button type="button" aria-label={`Thêm một người phe ${label}`} onClick={() => game.adjustHand(side, 1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink hover:bg-elevated">
                          <FaPlus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-semibold text-muted">Thêm tên người chơi ở bảng bên cạnh để game nhớ ai bị phạt.</p>
                </>
              )}
            </motion.div>
          )}

          {game.deck.teaser && <LockedTeaser text={game.deck.teaser} />}

          <ActionBar>
            {game.phase === 'idle' && (
              <Button size="lg" onClick={game.next}>
                Rút câu đầu tiên
                <FaArrowRight className="h-4 w-4" />
              </Button>
            )}
            {game.phase === 'reading' && (
              <>
                <Button size="lg" variant="secondary" onClick={game.next} className="max-w-[40%]">
                  <FaRotate className="h-4 w-4" />
                  Đổi câu
                </Button>
                <Button size="lg" onClick={game.startCountdown}>
                  Đếm 3, 2, 1
                </Button>
              </>
            )}
            {game.phase === 'countdown' && (
              <Button size="lg" disabled>
                Chuẩn bị chọn phe...
              </Button>
            )}
            {voting && (
              <Button size="lg" onClick={game.settle} disabled={game.counts.a + game.counts.b === 0}>
                <FaBeerMugEmpty className="h-4 w-4" />
                Chốt phe
              </Button>
            )}
            {game.phase === 'result' && (
              <Button size="lg" onClick={game.next}>
                Câu tiếp theo
                <FaArrowRight className="h-4 w-4" />
              </Button>
            )}
          </ActionBar>
        </>
      }
      aside={
        <>
          <RankingPanel title="Bị phạt nhiều nhất" stop={2} startStop={2} ranking={game.ranking} unit="ngụm" empty="Chưa ai phải uống. Rút câu đầu tiên nào!" onReset={game.reset} />
          <Panel title="Mức độ" stop={5}>
            <SegmentedControl label="Chọn mức độ câu hỏi" options={game.deck.options} value={game.deck.level} onChange={game.deck.setLevel} />
          </Panel>
          <PlayerPanel hint="Danh sách dùng để ghi phe và đếm ngụm cho từng người." />
        </>
      }
    />
  );
}
