// Màn chơi Tôi Chưa Từng: lật lá bài, chạm tên những ai đã từng làm để tính ngụm, bảng xếp hạng "từng trải" của cả bàn
'use client';

import { FaArrowRight, FaBeerMugEmpty } from 'react-icons/fa6';
import { ActionBar, CardStack, FlipCard, GameLayout, GameStage, LockedTeaser, PlayerToggleList, RankingPanel, levelLabel } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import useNeverHaveI from './useNeverHaveI';

function Back() {
  return (
    <span className="relative flex h-full w-full flex-col items-center justify-center gap-1 border border-[#12121a]/20 bg-[linear-gradient(135deg,var(--ramp-2),var(--ramp-4))] p-4 text-center rounded-xl">
      <span className="dot-screen absolute inset-0 opacity-60" />
      <FaBeerMugEmpty className="relative h-10 w-10 text-[#12121a]" />
      <span className="relative font-display text-2xl font-extrabold leading-tight text-[#12121a] sm:text-3xl">Tôi chưa từng...</span>
    </span>
  );
}

export default function NeverHaveIGame() {
  const { players } = usePlayers();
  const game = useNeverHaveI();

  return (
    <GameLayout
      main={
        <>
          <GameStage theme="bar" onTap={game.next} className="flex min-h-[340px] flex-col items-center justify-center gap-6 px-4 pb-10 pt-8 sm:px-8">
            {game.card ? (
              <div data-theme="light" className="w-full max-w-xl">
                <FlipCard
                  flipKey={`${game.card.id}-${game.round}`}
                  back={<Back />}
                  front={
                    <article className="surface flex min-h-[280px] flex-col shadow-[0_30px_50px_-24px_rgba(0,0,0,0.6)]">
                      <div className="h-2 rounded-t-[13px] bg-[linear-gradient(90deg,var(--ramp-2),var(--ramp-4))]" />
                      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center sm:p-9">
                        <span className="chip">
                          Lá {game.round} · {levelLabel(game.card.level)}
                        </span>
                        <p className="font-display text-xl font-bold text-muted">Tôi chưa từng...</p>
                        <p className="text-balance font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{game.card.text}</p>
                      </div>
                    </article>
                  }
                />
              </div>
            ) : (
              <>
                <p className="font-display text-xl font-bold text-ink">Chạm vào chồng bài để bắt đầu</p>
                <div data-theme="light" className="w-40 sm:w-48">
                  <CardStack label="Rút lá đầu tiên" face={<Back />} onDraw={game.next} />
                </div>
              </>
            )}
          </GameStage>

          {game.card && (
            <PlayerToggleList
              title="Ai đã từng? Chạm tên để tính 1 ngụm"
              players={players}
              selected={game.marked}
              onToggle={game.toggleMark}
              emptyHint="Thêm người chơi ở bảng bên cạnh để đếm ngụm cho từng người."
            />
          )}

          {game.deck.teaser && <LockedTeaser text={game.deck.teaser} />}

          <ActionBar>
            <Button size="lg" onClick={game.next}>
              {game.card ? 'Lá tiếp theo' : 'Rút lá đầu tiên'}
              <FaArrowRight className="h-4 w-4" />
            </Button>
          </ActionBar>
        </>
      }
      aside={
        <>
          <RankingPanel title="Ai từng trải nhất" stop={2} startStop={0} ranking={game.ranking} unit="ngụm" empty="Chưa ai phải uống. Lật lá đầu tiên nào!" onReset={game.reset} />
          <Panel title="Mức độ" stop={4}>
            <SegmentedControl label="Chọn mức độ câu hỏi" options={game.deck.options} value={game.deck.level} onChange={game.deck.setLevel} />
          </Panel>
          <PlayerPanel hint="Danh sách dùng để đếm ngụm cho từng người." />
        </>
      }
    />
  );
}
