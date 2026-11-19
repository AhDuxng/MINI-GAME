// Màn chơi Gián Điệp: chuyển giữa thiết lập và ván đang chơi, cột bên hiển thị người chơi và trạng thái bị loại, công bố phe thắng
'use client';

import { useEffect, useState } from 'react';
import { GameLayout } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import ResultModal from '@/shared/ui/ResultModal';
import { cn } from '@/shared/lib/utils';
import SpyBoard from './SpyBoard';
import SpySetup from './SpySetup';
import useSpyWord from './useSpyWord';

export default function SpyWordGame() {
  const { players } = usePlayers();
  const game = useSpyWord(players);
  const { state } = game;
  const [resultOpen, setResultOpen] = useState(false);
  const finished = state.phase === 'finished';
  const inGame = state.phase !== 'setup';
  const spies = state.players.filter((player) => player.spy).map((player) => player.name);

  useEffect(() => {
    setResultOpen(finished);
  }, [finished]);

  return (
    <>
      <GameLayout
        main={
          inGame ? (
            <SpyBoard
              state={state}
              timeLeftMs={game.timeLeftMs}
              onFlip={game.flip}
              onHide={game.hide}
              onStartVote={game.startVote}
              onBackToDiscuss={game.backToDiscuss}
              onEliminate={game.eliminate}
              onRestart={game.start}
              onExit={game.exit}
            />
          ) : (
            <SpySetup
              playerCount={players.length}
              spyCount={game.spyCount}
              spySetting={game.settings.spyCount}
              discussSeconds={game.settings.discussSeconds}
              canStart={game.canStart}
              onChange={game.setSettings}
              onStart={game.start}
            />
          )
        }
        aside={
          inGame ? (
            <Panel title="Người chơi" stop={5} action={<Badge>{state.players.filter((player) => player.alive).length} còn lại</Badge>}>
              <ul className="divide-y divide-line border-y border-line">
                {state.players.map((player) => (
                  <li key={player.name} className={cn('flex items-center justify-between gap-3 py-2.5', !player.alive && 'opacity-60')}>
                    <span className={cn('font-semibold', player.alive ? 'text-ink' : 'text-muted line-through')}>{player.name}</span>
                    {!player.alive && (
                      <span className={cn('text-xs font-bold', player.spy ? 'text-ramp-text-3' : 'text-ramp-text-7')}>
                        {player.spy ? 'Gián điệp' : 'Dân'}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {!finished && (
                <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={game.exit}>
                  Kết thúc ván
                </Button>
              )}
            </Panel>
          ) : (
            <PlayerPanel hint="Cần ít nhất 4 người. Mỗi người sẽ lần lượt cầm máy để xem từ bí mật." />
          )
        }
      />

      <ResultModal
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        title={state.winner === 'civilians' ? 'Dân làng thắng!' : 'Gián điệp thắng!'}
        subtitle={spies.length > 1 ? 'Các gián điệp là:' : 'Gián điệp là:'}
        result={spies.join(', ')}
        detail={
          state.pair && (
            <p>
              Từ của dân: <strong>{state.pair.civilian}</strong>
              <br />
              Từ gián điệp: <strong className="text-ramp-text-3">{state.pair.spy}</strong>
            </p>
          )
        }
        actions={[
          { label: 'Ván mới', onClick: game.start },
          { label: 'Xem lại vai', onClick: () => setResultOpen(false), variant: 'secondary' },
        ]}
      />
    </>
  );
}
