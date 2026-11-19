// Màn chơi Đua vịt: hồ nước 3D với vịt cao su của từng người chơi, đếm ngược, bình luận và bảng xếp hạng
'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { FaFlagCheckered } from 'react-icons/fa6';
import { ActionBar, GameLayout, GameStage, Stage3D, StageLoading } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import ResultModal from '@/shared/ui/ResultModal';
import { DUCK_NAMES } from '@/data';
import { useVipAccess, FREE_LIMITS, VIP_LIMITS } from '@/features/billing';
import { cn } from '@/shared/lib/utils';
import RaceTrack, { rankLabel } from './RaceTrack';
import useDuckRace from './useDuckRace';

const DuckPond3D = dynamic(() => import('./DuckPond3D'), { ssr: false, loading: StageLoading });

const VIP_MAX_RACERS = VIP_LIMITS.duckRacers;
const DEFAULT_RACER_COUNT = 6;

export default function DuckRaceGame() {
  const { players } = usePlayers();
  const { isVip, requireVip } = useVipAccess('duck-race');
  const maxRacers = isVip ? VIP_MAX_RACERS : FREE_LIMITS.duckRacers;
  const usingPlayers = players.length >= 2;
  const racers = useMemo(
    () => (usingPlayers ? players.slice(0, maxRacers) : DUCK_NAMES.slice(0, DEFAULT_RACER_COUNT)),
    [players, usingPlayers, maxRacers],
  );
  const game = useDuckRace(racers);
  const lastIndex = racers.length - 1;
  const loser = game.ranking[lastIndex];
  const running = game.phase === 'racing';

  return (
    <>
      <GameLayout
        main={
          <>
            <div className="flex items-center gap-3 border border-line bg-elevated px-4 py-3 rounded-xl">
              <span className="flex-shrink-0 bg-ramp-3 px-2 py-0.5 font-display text-xs font-bold text-[#12121a] rounded-md">TRỰC TIẾP</span>
              <p aria-live="polite" className="truncate font-semibold text-ink">
                {game.commentary}
              </p>
            </div>

            <GameStage theme="pond" onTap={game.isRunning ? undefined : game.start} className="relative overflow-hidden">
              <Stage3D
                className="stage-fit h-[58vh] max-h-[520px] min-h-[340px] md:h-[460px]"
                scene={<DuckPond3D racers={racers} race={game.race} running={running} />}
                fallback={
                  <div className="p-3 sm:p-5">
                    <RaceTrack racers={racers} race={game.race} running={running} />
                  </div>
                }
              />
              {game.phase === 'countdown' && (
                <div className="absolute inset-0 flex items-center justify-center bg-canvas/45">
                  <motion.span
                    key={game.countdown}
                    initial={{ scale: 1.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                    className="text-ramp font-display text-9xl font-extrabold"
                  >
                    {game.countdown}
                  </motion.span>
                </div>
              )}
            </GameStage>

            <ActionBar>
              <Button size="lg" onClick={game.start} disabled={game.isRunning}>
                <FaFlagCheckered className="h-4 w-4" />
                {game.phase === 'finished' ? 'Đua lại' : 'Bắt đầu đua'}
              </Button>
              {game.phase === 'finished' && (
                <Button variant="secondary" size="lg" onClick={game.reset}>
                  Về vạch xuất phát
                </Button>
              )}
            </ActionBar>

            {!usingPlayers && <p className="text-sm text-muted">Chưa đủ 2 người chơi nên đang dùng vịt mặc định.</p>}
            {players.length > maxRacers && (
              <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-elevated px-4 py-3 rounded-xl">
                <p className="text-sm font-semibold text-ink">
                  Hồ đang có {maxRacers} làn, {maxRacers} người đầu danh sách được vào đua.
                </p>
                {!isVip && (
                  <Button size="sm" onClick={() => requireVip(`Đua tới ${VIP_MAX_RACERS} vịt`)}>
                    Mở khoá {VIP_MAX_RACERS} vịt
                  </Button>
                )}
              </div>
            )}
          </>
        }
        aside={
          <>
            {game.ranking.length > 0 && (
              <Panel title="Bảng xếp hạng" stop={7}>
                <ol className="divide-y divide-line border-y border-line">
                  {game.ranking.map((name, rank) => {
                    const isLoser = game.phase === 'finished' && rank === lastIndex;
                    return (
                      <li key={`${name}-${rank}`} className="flex items-center gap-3 py-2.5">
                        <span className={cn('w-8 font-display text-base font-bold', isLoser ? 'text-ramp-text-3' : 'text-ink')}>
                          {rankLabel(rank)}
                        </span>
                        <span className={cn('flex-1 truncate', rank === 0 ? 'text-ramp font-bold' : 'text-ink')}>{name}</span>
                        {isLoser && <span className="chip text-ramp-text-3">về chót</span>}
                      </li>
                    );
                  })}
                </ol>
              </Panel>
            )}
            <PlayerPanel disabled={game.isRunning} hint="Mỗi người chơi là một chú vịt. Cần ít nhất 2 người để đua." />
          </>
        }
      />

      <ResultModal
        open={game.resultOpen}
        onClose={game.closeResult}
        title="về nhất"
        subtitle="Chú vịt nhanh nhất là:"
        result={game.ranking[0]}
        detail={
          <p className="space-y-1">
            <span className="block text-muted">
              Về chót: <strong className="text-ink">{loser}</strong>
            </span>
            <span className="block">
              Hình phạt: <strong className="text-ramp-text-3">{game.punishment}</strong>
            </span>
          </p>
        }
        actions={[
          { label: 'Đua lại', onClick: game.start },
          { label: 'Xem bảng xếp hạng', onClick: game.closeResult, variant: 'secondary' },
        ]}
      />
    </>
  );
}
