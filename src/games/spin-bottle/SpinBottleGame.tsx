// Màn chơi Xoay Chai: bàn 3D với chai xoay giữa bàn, hộp thoại cho người bị chỉ chọn Thật, Thách hoặc cạn ly, bảng ai bị chỉ nhiều nhất
'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { FaArrowsRotate, FaBeerMugEmpty, FaComment, FaFire } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { ActionBar, GameLayout, GameStage, Stage3D, StageLoading } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import { VIP_LIMITS } from '@/features/billing';
import { useSound } from '@/features/settings';
import Button from '@/shared/ui/Button';
import Modal from '@/shared/ui/Modal';
import Panel from '@/shared/ui/Panel';
import { rampFill, rampWash } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import BottleBoard from './BottleBoard';
import useSpinBottle, { type ChoiceKind } from './useSpinBottle';

const Bottle3D = dynamic(() => import('./Bottle3D'), { ssr: false, loading: StageLoading });

const CHOICES: { kind: ChoiceKind; label: string; hint: string; stop: number; icon: IconType }[] = [
  { kind: 'truth', label: 'Thật', hint: 'Trả lời một câu hỏi', stop: 7, icon: FaComment },
  { kind: 'dare', label: 'Thách', hint: 'Làm một thử thách', stop: 3, icon: FaFire },
  { kind: 'drink', label: 'Uống 1 ly', hint: 'Cạn ly để qua lượt', stop: 1, icon: FaBeerMugEmpty },
];

const KIND_LABELS: Record<ChoiceKind, string> = { truth: 'Thật', dare: 'Thách', drink: 'Uống' };
const KIND_STOPS: Record<ChoiceKind, number> = { truth: 7, dare: 3, drink: 1 };

export default function SpinBottleGame() {
  const { players } = usePlayers();
  const game = useSpinBottle(players);
  const { play } = useSound();
  const tick = useCallback(() => play('tick'), [play]);
  const ranking = Object.entries(game.stats).sort((a, b) => b[1].picked - a[1].picked || b[1].drinks - a[1].drinks);

  return (
    <>
      <GameLayout
        main={
          <>
            <GameStage theme="bar">
              <Stage3D
                className="stage-fit aspect-square max-h-[560px] w-full md:aspect-[4/3]"
                scene={
                  <Bottle3D
                    seats={game.seats}
                    rotation={game.rotation}
                    spinning={game.spinning}
                    winner={game.winner}
                    onSpin={game.spin}
                    onSpinEnd={game.finishSpin}
                    onTick={tick}
                  />
                }
                fallback={
                  <div className="p-4 sm:p-8">
                    <BottleBoard
                      seats={game.seats}
                      rotation={game.rotation}
                      spinning={game.spinning}
                      winner={game.winner}
                      onSpin={game.spin}
                      onSpinEnd={game.finishSpin}
                    />
                  </div>
                }
              />
              <p className="rounded-b-2xl border-t border-white/10 bg-black/25 px-4 py-3 text-center text-sm font-semibold text-muted">
                {game.spinning ? (
                  'Chai đang xoay, chuẩn bị tinh thần...'
                ) : game.pickedName ? (
                  <>
                    Lượt vừa rồi: <span className="font-display text-base font-bold text-ink">{game.pickedName}</span>
                  </>
                ) : (
                  `${game.seats.length} người quanh bàn · chạm vào chai hoặc bấm Xoay chai`
                )}
              </p>
            </GameStage>

            {game.overflow > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-elevated px-4 py-3">
                <p className="text-sm font-semibold text-ink">Bàn miễn phí có {game.maxSeats} chỗ, còn {game.overflow} người chưa được ngồi.</p>
                <Button size="sm" onClick={() => game.requireVip(`Xoay chai cho bàn ${VIP_LIMITS.bottleSeats} người`)}>
                  Mở bàn {VIP_LIMITS.bottleSeats} chỗ
                </Button>
              </div>
            )}

            {game.usingDefaults && (
              <p className="border border-line bg-elevated px-4 py-3 text-sm font-semibold text-muted rounded-xl">
                Đang dùng tên tạm Người 1 đến Người 6. Thêm tên thật ở bảng Người chơi để chai gọi đúng tên.
              </p>
            )}

            <ActionBar>
              <Button size="lg" onClick={game.spin} disabled={game.spinning}>
                <FaArrowsRotate className={cn('h-4 w-4', game.spinning && 'animate-spin')} />
                {game.spinning ? 'Chai đang xoay...' : 'Xoay chai'}
              </Button>
            </ActionBar>
          </>
        }
        aside={
          <>
            <Panel
              title="Ai bị chai chỉ nhiều nhất"
              stop={8}
              action={
                ranking.length > 0 ? (
                  <button type="button" onClick={game.reset} className="text-action">
                    Làm lại
                  </button>
                ) : null
              }
            >
              {ranking.length === 0 ? (
                <p className="text-sm text-muted">Chưa ai bị chỉ. Xoay chai để bắt đầu!</p>
              ) : (
                <ol className="divide-y divide-line">
                  {ranking.map(([name, stat], index) => (
                    <li key={name} className="flex items-center gap-3 py-2.5">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center font-display text-sm font-bold text-[#12121a] rounded-md" style={{ background: rampFill(index * 2) }}>
                        {index + 1}
                      </span>
                      <span className={cn('flex-1 truncate font-semibold', index === 0 ? 'text-ramp font-display text-lg font-bold' : 'text-ink')}>{name}</span>
                      <span className="text-right text-sm font-bold text-muted">
                        <span className="font-display text-lg text-ink">{stat.picked}</span> lần · {stat.drinks} ly
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>

            {game.history.length > 0 && (
              <Panel title="Lượt gần đây" stop={2}>
                <ul className="space-y-2">
                  {game.history.map((turn) => (
                    <li key={turn.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-semibold text-ink">{turn.name}</span>
                      {turn.kind ? (
                        <span className="px-2 py-0.5 font-display text-xs font-bold text-[#12121a] rounded-md" style={{ background: rampFill(KIND_STOPS[turn.kind]) }}>
                          {KIND_LABELS[turn.kind]}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-muted">Bỏ qua</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            <PlayerPanel disabled={game.spinning} hint="Mỗi người một chỗ quanh bàn theo đúng thứ tự trong danh sách." />
          </>
        }
      />

      <Modal open={game.resultOpen} onClose={game.close} label="Chai chỉ vào">
        <p className="eyebrow">Chai chỉ vào</p>
        <p className="text-ramp mt-1 break-words font-display text-title font-extrabold">{game.pickedName}</p>

        {!game.choice && (
          <div className="mt-6 grid gap-2">
            {CHOICES.map(({ kind, label, hint, stop, icon: Icon }, index) => (
              <motion.button
                key={kind}
                type="button"
                onClick={() => game.choose(kind)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.35 }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[#12121a] transition-transform active:scale-[0.98]"
                style={{ background: rampFill(stop) }}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                <span className="flex-1">
                  <span className="block font-display text-xl font-extrabold leading-tight">{label}</span>
                  <span className="block text-sm font-semibold opacity-80">{hint}</span>
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {game.choice && game.choice.kind !== 'drink' && (
          <motion.div key={game.choice.card.id} initial={{ rotateX: -80, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.45 }} className="mt-6 [perspective:800px]">
            <div className="border-2 border-edge p-5 rounded-xl" style={{ background: rampWash(KIND_STOPS[game.choice.kind], 16) }}>
              <span className="px-2 py-0.5 font-display text-sm font-bold text-[#12121a] rounded-md" style={{ background: rampFill(KIND_STOPS[game.choice.kind]) }}>
                {KIND_LABELS[game.choice.kind]}
              </span>
              <p className="mt-3 text-balance font-display text-2xl font-bold leading-snug text-ink">{game.choice.card.text}</p>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button size="lg" onClick={game.spinAgain}>
                Xong, xoay tiếp
              </Button>
              <Button size="lg" variant="secondary" onClick={game.chicken}>
                Không dám, uống 1 ly
              </Button>
            </div>
          </motion.div>
        )}

        {game.choice?.kind === 'drink' && (
          <div className="mt-6">
            <motion.div initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-full" style={{ background: rampFill(1) }}>
              <FaBeerMugEmpty className="h-11 w-11 text-[#12121a]" />
            </motion.div>
            <p className="mt-4 font-display text-3xl font-extrabold text-ink">Cạn ly!</p>
            <p className="mt-1 text-sm text-muted">Uống xong thì xoay lượt mới.</p>
            <Button size="lg" className="mt-6 w-full" onClick={game.spinAgain}>
              Xoay tiếp
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
