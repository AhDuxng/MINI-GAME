// Màn chơi Luật Bài: chồng bài 3D để rút, lá bài lật kèm luật uống, đồng hồ đếm lá K cho ly chung, bảng luật 13 lá và hộp thoại cạn ly chung
'use client';

import { FaArrowRight, FaCrown, FaShuffle } from 'react-icons/fa6';
import { ActionBar, CardStack, FlipCard, GameLayout, GameStage } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import { CARD_RULES } from '@/data';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import ResultModal from '@/shared/ui/ResultModal';
import { rampFill, rampWash } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import { DECK_SIZE, KING_LIMIT } from './card-deck';
import { CardBack, CardFace } from './PlayingCardFace';
import useCardRules from './useCardRules';

function KingMeter({ kings }: { kings: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`Đã ra ${kings} trên ${KING_LIMIT} lá K`}>
      {Array.from({ length: KING_LIMIT }, (_, index) => (
        <span
          key={index}
          className={cn('flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300', index < kings ? 'text-[#12121a]' : 'border border-line text-muted/40')}
          style={index < kings ? { background: rampFill(index === KING_LIMIT - 1 ? 3 : 1) } : undefined}
        >
          <FaCrown className="h-4 w-4" />
        </span>
      ))}
    </div>
  );
}

export default function CardRulesGame() {
  const { players } = usePlayers();
  const game = useCardRules(players);
  const empty = game.left === 0;

  return (
    <>
      <GameLayout
        main={
          <>
            <GameStage theme="felt" onTap={empty ? game.reshuffle : game.draw} className="flex min-h-[340px] flex-col items-center justify-center gap-6 px-6 pb-12 pt-9 sm:px-10">
              {game.current ? (
                <div data-theme="light" className="w-full max-w-[300px]">
                  <FlipCard
                    flipKey={`${game.current.card.id}-${game.current.order}`}
                    back={<CardBack />}
                    front={<CardFace card={game.current.card} order={game.current.order} drawer={game.current.drawer} />}
                  />
                </div>
              ) : (
                <>
                  <p className="text-center font-display text-xl font-bold text-ink">Chạm vào bộ bài để rút lá đầu tiên</p>
                  <div data-theme="light" className="w-40 sm:w-44">
                    <CardStack label="Rút lá đầu tiên" face={<CardBack />} onDraw={game.draw} />
                  </div>
                </>
              )}
            </GameStage>

            <div className="surface flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="eyebrow">{empty ? 'Hết bài' : 'Lượt rút tiếp theo'}</p>
                <p className="font-display text-xl font-bold text-ink">{empty ? 'Xào bài để chơi tiếp' : (game.nextPlayer ?? 'Người kế bên')}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge>
                  Còn {game.left}/{DECK_SIZE} lá
                </Badge>
                <KingMeter kings={game.kings} />
              </div>
            </div>

            <ActionBar>
              {empty ? (
                <Button size="lg" onClick={game.reshuffle}>
                  <FaShuffle className="h-4 w-4" />
                  Xào bài lại
                </Button>
              ) : (
                <Button size="lg" onClick={game.draw}>
                  {game.current ? 'Rút lá tiếp' : 'Rút lá đầu tiên'}
                  <FaArrowRight className="h-4 w-4" />
                </Button>
              )}
            </ActionBar>
          </>
        }
        aside={
          <>
            <Panel
              title="Ly chung"
              stop={3}
              action={
                game.drawnCount > 0 && !empty ? (
                  <button type="button" onClick={game.reshuffle} className="text-action">
                    Xào lại
                  </button>
                ) : null
              }
            >
              <KingMeter kings={game.kings} />
              <p className="mt-3 text-sm text-muted">
                {game.kings >= KING_LIMIT
                  ? 'Ly chung đã được cạn. Xào bài để bắt đầu vòng mới.'
                  : `Mỗi lá K góp một ít vào ly chung. Còn ${KING_LIMIT - game.kings} lá K, ai rút lá cuối cùng phải cạn ly.`}
              </p>
            </Panel>

            <Panel title="Luật từng lá" stop={1}>
              <ol className="-mx-2 space-y-0.5">
                {CARD_RULES.map((rule) => {
                  const active = game.current?.card.rank === rule.rank;
                  return (
                    <li
                      key={rule.rank}
                      className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-300"
                      style={active ? { background: rampWash(1, 32) } : undefined}
                    >
                      <span className="w-8 flex-shrink-0 text-center font-display text-lg font-extrabold text-ink">{rule.rank}</span>
                      <span className={cn('text-sm', active ? 'font-bold text-ink' : 'font-semibold text-muted')}>{rule.title}</span>
                    </li>
                  );
                })}
              </ol>
            </Panel>

            <PlayerPanel hint="Lượt rút đi lần lượt theo danh sách." />
          </>
        }
      />

      <ResultModal
        open={game.cupOpen}
        onClose={game.closeCup}
        title="Lá K thứ tư!"
        subtitle="Người phải cạn ly chung:"
        result={game.current?.drawer ?? 'Người vừa rút'}
        detail={<p>Uống cạn ly chung giữa bàn. Xào bài lại để đếm lá K từ đầu.</p>}
        actions={[{ label: 'Cạn xong, rút tiếp', onClick: game.closeCup }]}
      />
    </>
  );
}
