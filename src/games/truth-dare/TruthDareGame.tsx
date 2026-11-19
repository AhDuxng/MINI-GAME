// Màn chơi Thật hay Thách: rút lá từ chồng bài 3D, thực hiện rồi chuyển lượt cho người tiếp theo
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowRight, FaDice, FaRotate } from 'react-icons/fa6';
import { ActionBar, CardStack, FlipCard, GameLayout, GameStage, LockedTeaser, levelLabel } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { CardBack, CardFront, KIND_STYLES } from './PromptCardView';
import useTruthDare, { type PromptKind, type TurnOrder } from './useTruthDare';

const ORDER_OPTIONS: { value: TurnOrder; label: string }[] = [
  { value: 'sequential', label: 'Lần lượt' },
  { value: 'random', label: 'Ngẫu nhiên' },
];

const KINDS: PromptKind[] = ['truth', 'dare'];

export default function TruthDareGame() {
  const { players } = usePlayers();
  const game = useTruthDare(players);
  const stats = [
    { label: 'Nói thật', value: game.stats.truth, stop: 7 },
    { label: 'Nhận thách', value: game.stats.dare, stop: 3 },
    { label: 'Đổi câu', value: game.stats.skipped, stop: 5 },
  ];

  return (
    <GameLayout
      main={
        <>
          <GameStage theme="show" onTap={game.prompt ? game.complete : game.drawRandom} className="flex flex-col gap-6 px-4 pb-10 pt-5 sm:px-8">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-muted">
                Đến lượt <span className="text-ramp font-display text-2xl font-extrabold">{game.currentPlayer ?? 'bạn'}</span>
              </p>
              <span className="chip">{levelLabel(game.deck.level)}</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {game.prompt ? (
                <motion.div key="card" data-theme="light" className="mx-auto w-full max-w-xl" exit={{ opacity: 0, transition: { delay: 0.32, duration: 0.12 } }}>
                  <FlipCard
                    flipKey={game.prompt.card.id}
                    front={<CardFront kind={game.prompt.kind} card={game.prompt.card} />}
                    back={<CardBack kind={game.prompt.kind} />}
                  />
                </motion.div>
              ) : (
                <motion.div key="stacks" className="flex min-h-[280px] flex-col items-center justify-center gap-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p className="font-display text-xl font-bold text-ink">Chọn một chồng bài</p>
                  <div data-theme="light" className="grid w-full max-w-md grid-cols-2 gap-6 sm:gap-10">
                    {KINDS.map((kind, index) => (
                      <CardStack
                        key={kind}
                        label={`Rút lá ${KIND_STYLES[kind].label}`}
                        face={<CardBack kind={kind} />}
                        onDraw={() => game.draw(kind)}
                        delay={index * 600}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GameStage>

          {game.deck.teaser && <LockedTeaser text={game.deck.teaser} />}

          <ActionBar>
            {game.prompt ? (
              <>
                <Button size="lg" onClick={game.complete}>
                  Xong, lượt tiếp
                  <FaArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="lg" onClick={game.skip}>
                  <FaRotate className="h-4 w-4" />
                  Đổi câu
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={game.drawRandom}>
                <FaDice className="h-4 w-4" />
                Để số phận quyết định
              </Button>
            )}
          </ActionBar>

          <dl className="grid grid-cols-3 gap-px border border-line bg-line rounded-xl overflow-hidden">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse items-center gap-0.5 bg-canvas py-4">
                <dt className="text-xs font-bold text-muted">{stat.label}</dt>
                <dd className="font-display text-3xl font-extrabold" style={{ color: `var(--ramp-text-${stat.stop})` }}>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      }
      aside={
        <>
          <Panel title="Tuỳ chọn" stop={3}>
            <div className="space-y-5">
              <SegmentedControl label="Mức độ" options={game.deck.options} value={game.deck.level} onChange={game.deck.setLevel} />
              <SegmentedControl label="Thứ tự lượt" options={ORDER_OPTIONS} value={game.order} onChange={game.setOrder} />
            </div>
          </Panel>
          <PlayerPanel hint="Thêm người chơi để game tự xoay vòng lượt. Không có ai thì cả bàn tự chỉ định." />
        </>
      }
    />
  );
}
