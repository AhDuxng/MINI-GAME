// Màn chơi Xí ngầu cạn ly: xoay lượt người chơi, bàn nỉ 3D, nút lắc trong tầm ngón cái, lắc điện thoại, bảng ý nghĩa và lịch sử
'use client';

import dynamic from 'next/dynamic';
import { BsDice5Fill } from 'react-icons/bs';
import { FaMobileScreenButton } from 'react-icons/fa6';
import { ActionBar, GameLayout, GameStage, Stage3D, StageLoading, useShake } from '@/games/kit';
import { PlayerPanel, usePlayers } from '@/features/players';
import Button from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import DiceHistory from './DiceHistory';
import DiceMeanings from './DiceMeanings';
import Die from './Die';
import { faceStyle, getFace } from './face-style';
import useDiceGame from './useDiceGame';

const Dice3D = dynamic(() => import('./Dice3D'), { ssr: false, loading: StageLoading });

export default function DiceGame() {
  const { players } = usePlayers();
  const { faceId, turns, isRolling, history, currentPlayer, roll, clearHistory } = useDiceGame(players);
  const shake = useShake(roll);
  const lastFace = history.length > 0 ? getFace(faceId) : null;

  return (
    <GameLayout
      main={
        <>
          <div className="flex items-center justify-between gap-3 border border-line bg-elevated px-4 py-3 rounded-xl">
            <p className="font-semibold text-muted">
              Đến lượt <span className="text-ramp font-display text-2xl font-extrabold">{currentPlayer ?? 'bạn'}</span>
            </p>
          </div>

          <GameStage theme="felt" onTap={isRolling ? undefined : roll} className="overflow-hidden">
            <Stage3D
              className="stage-fit aspect-square max-h-[520px] w-full md:aspect-[4/3]"
              scene={<Dice3D faceId={faceId} turns={turns} rolling={isRolling} />}
              fallback={
                <div className="flex justify-center px-4 py-14">
                  <Die faceId={faceId} turns={turns} />
                </div>
              }
            />
            <p aria-live="polite" className={cn('border-t border-white/10 bg-black/35 px-4 py-3 text-center transition-opacity', isRolling && 'opacity-0')}>
              {lastFace ? (
                <>
                  <span className="font-bold" style={{ color: faceStyle(lastFace).color }}>
                    {lastFace.label}
                  </span>
                  <span className="text-muted"> · {lastFace.description}</span>
                </>
              ) : (
                <span className="text-sm text-muted">Bấm Lắc ngay hoặc lắc điện thoại để tung xí ngầu.</span>
              )}
            </p>
          </GameStage>

          <ActionBar>
            <Button size="lg" onClick={roll} disabled={isRolling}>
              <span className="tracking-widest">LẮC NGAY</span>
              <BsDice5Fill className="h-5 w-5" />
            </Button>
          </ActionBar>

          {shake.permission === 'prompt' && (
            <Button variant="secondary" size="sm" onClick={shake.requestPermission}>
              <FaMobileScreenButton className="h-3.5 w-3.5" />
              Bật lắc điện thoại
            </Button>
          )}
          {shake.permission === 'granted' && (
            <p className="flex items-center gap-2 text-sm font-semibold text-muted">
              <FaMobileScreenButton className="h-3.5 w-3.5" />
              Lắc điện thoại để tung
            </p>
          )}

          <DiceMeanings />
        </>
      }
      aside={
        <>
          <DiceHistory history={history} onClear={clearHistory} />
          <PlayerPanel hint="Thêm người chơi để game tự xoay lượt lắc." disabled={isRolling} />
        </>
      }
    />
  );
}
