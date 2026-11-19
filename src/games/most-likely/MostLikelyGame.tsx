// Màn chơi Chỉ Mặt Đặt Tên: lá câu hỏi lật 3D, đếm ngược 3-2-1 cỡ lớn rồi dấu "Chỉ!", chạm tên người bị chỉ nhiều nhất và bảng bị chỉ mặt
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowRight, FaHandPointRight, FaRotate } from 'react-icons/fa6';
import { ActionBar, CardStack, FlipCard, GameLayout, GameStage, LockedTeaser, PlayerToggleList, RankingPanel, levelLabel } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampFill } from '@/shared/lib/ramp';
import useMostLikely from './useMostLikely';



const HANDS = [
  { from: { x: -160, y: 0 }, rotate: 0 },
  { from: { x: 160, y: 0 }, rotate: 180 },
  { from: { x: 0, y: 140 }, rotate: -90 },
  { from: { x: -120, y: -110 }, rotate: 40 },
  { from: { x: 120, y: -110 }, rotate: 140 },
];

function Back() {
  return (
    <span className="relative flex h-full w-full flex-col items-center justify-center gap-2 border border-[#12121a]/20 bg-[linear-gradient(135deg,var(--ramp-7),var(--ramp-5))] p-4 text-center rounded-xl">
      <span className="dot-screen absolute inset-0 opacity-60" />
      <FaHandPointRight className="relative h-10 w-10 text-[#12121a]" />
      <span className="relative font-display text-2xl font-extrabold leading-tight text-[#12121a] sm:text-3xl">Ai dễ... nhất?</span>
    </span>
  );
}

function PointBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {HANDS.map(({ from, rotate }, index) => (
        <motion.span
          key={index}
          className="absolute"
          initial={{ x: from.x, y: from.y, opacity: 0, scale: 0.6 }}
          animate={{ x: from.x * 0.35, y: from.y * 0.35, opacity: [0, 1, 1, 0], scale: 1 }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1], delay: index * 0.04 }}
        >
          <FaHandPointRight className="h-12 w-12" style={{ color: rampFill(index * 2), transform: `rotate(${rotate}deg)` }} />
        </motion.span>
      ))}
    </div>
  );
}

export default function MostLikelyGame() {
  const { players } = usePlayers();
  const game = useMostLikely();
  const pointing = game.phase === 'pointing';
  const stageAction = game.phase === 'reading' ? game.startCountdown : game.phase === 'countdown' ? undefined : game.next;

  return (
    <GameLayout
      main={
        <>
          <GameStage theme="party" onTap={stageAction} className="flex min-h-[340px] flex-col items-center justify-center gap-6 px-4 pb-10 pt-8 sm:px-8">
            {game.card ? (
              <div data-theme="light" className="w-full max-w-xl">
                <FlipCard
                  flipKey={`${game.card.id}-${game.round}`}
                  back={<Back />}
                  front={
                    <article className="surface relative flex min-h-[300px] flex-col overflow-hidden shadow-[0_30px_50px_-24px_rgba(0,0,0,0.6)]">
                      <div className="h-2 bg-[linear-gradient(90deg,var(--ramp-7),var(--ramp-5))]" />
                      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center sm:p-9">
                        <span className="chip">
                          Câu {game.round} · {levelLabel(game.card.level)}
                        </span>
                        <p className="text-balance font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{game.card.text}</p>
                        <p className="text-sm font-semibold text-muted">
                          {pointing ? 'Giữ nguyên tay, đếm xem ai bị chỉ nhiều nhất!' : 'Đọc to câu hỏi, chưa ai được chỉ trước khi đếm xong.'}
                        </p>
                      </div>

                      <AnimatePresence>
                        {game.phase === 'countdown' && (
                          <motion.div
                            key="countdown"
                            className="absolute inset-0 flex items-center justify-center bg-canvas/90"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <AnimatePresence mode="popLayout">
                              <motion.span
                                key={game.count}
                                className="text-ramp font-display text-[9rem] font-extrabold leading-none"
                                initial={{ scale: 2.4, opacity: 0, rotate: -10 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0.3, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                              >
                                {game.count}
                              </motion.span>
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {pointing && (
                        <>
                          <PointBurst />
                          <motion.span
                            className="fill-ramp absolute right-3 top-5 rounded-lg px-3 py-1 font-display text-2xl font-extrabold"
                            initial={{ scale: 3, rotate: -30, opacity: 0 }}
                            animate={{ scale: 1, rotate: -10, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                          >
                            CHỈ!
                          </motion.span>
                        </>
                      )}
                    </article>
                  }
                />
              </div>
            ) : (
              <>
                <p className="text-center font-display text-xl font-bold text-ink">Chạm vào chồng bài để rút câu đầu tiên</p>
                <div data-theme="light" className="w-40 sm:w-48">
                  <CardStack label="Rút câu đầu tiên" face={<Back />} onDraw={game.next} />
                </div>
              </>
            )}
          </GameStage>

          {pointing && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <PlayerToggleList
                title="Ai bị chỉ nhiều nhất? Chạm tên để tính 1 ngụm"
                players={players}
                selected={game.marked}
                onToggle={game.toggleMark}
                emptyHint="Thêm người chơi ở bảng bên cạnh để đếm ngụm cho từng người."
              />
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
                Chuẩn bị chỉ...
              </Button>
            )}
            {pointing && (
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
          <RankingPanel title="Bị chỉ mặt nhiều nhất" ranking={game.ranking} unit="ngụm" empty="Chưa ai bị chỉ mặt. Rút câu đầu tiên nào!" onReset={game.reset} />
          <Panel title="Mức độ" stop={5}>
            <SegmentedControl label="Chọn mức độ câu hỏi" options={game.deck.options} value={game.deck.level} onChange={game.deck.setLevel} />
          </Panel>
          <PlayerPanel hint="Danh sách dùng để đếm ngụm cho người bị chỉ." />
        </>
      }
    />
  );
}
