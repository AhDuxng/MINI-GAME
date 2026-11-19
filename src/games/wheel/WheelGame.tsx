// Màn chơi Vòng quay may mắn: vòng quay 3D trên giá đỡ, chọn dải màu, cấu hình danh sách và hộp thoại kết quả
'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { ActionBar, GameLayout, GameStage, Stage3D, StageLoading } from '@/games/kit';
import Button from '@/shared/ui/Button';
import ResultModal from '@/shared/ui/ResultModal';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { useSound } from '@/features/settings';
import { WHEEL_THEMES } from '@/data';
import useWheelGame from './useWheelGame';
import Wheel from './Wheel';
import WheelSettings from './WheelSettings';

const Wheel3D = dynamic(() => import('./Wheel3D'), { ssr: false, loading: StageLoading });

const THEME_OPTIONS = WHEEL_THEMES.map((theme) => ({ value: theme.id, label: theme.name }));

export default function WheelGame() {
  const wheel = useWheelGame();
  const { play } = useSound();
  const tick = useCallback(() => play('tick'), [play]);

  return (
    <>
      <GameLayout
        main={
          <>
            <GameStage theme="show" className="overflow-hidden">
              <Stage3D
                className="stage-fit aspect-square max-h-[560px] w-full md:aspect-[4/3]"
                scene={
                  <Wheel3D
                    segments={wheel.segments}
                    stops={wheel.theme.stops}
                    rotation={wheel.rotation}
                    isSpinning={wheel.isSpinning}
                    canSpin={wheel.canSpin}
                    onSpin={wheel.spin}
                    onSpinEnd={wheel.finishSpin}
                    onTick={tick}
                  />
                }
                fallback={
                  <div className="px-4 pb-6 pt-12 sm:px-10">
                    <Wheel
                      segments={wheel.segments}
                      colors={wheel.colors}
                      rotation={wheel.rotation}
                      isSpinning={wheel.isSpinning}
                      canSpin={wheel.canSpin}
                      onSpin={wheel.spin}
                      onSpinEnd={wheel.finishSpin}
                    />
                  </div>
                }
              />
              <p className="border-t border-white/10 bg-black/35 px-4 py-3 text-center text-sm font-semibold text-muted">
                {wheel.segments.length < 2 ? 'Cần ít nhất 2 ô để quay.' : `${wheel.segments.length} ô · chạm vào trục giữa hoặc bấm Quay`}
              </p>
            </GameStage>

            <ActionBar>
              <Button size="lg" onClick={wheel.spin} disabled={!wheel.canSpin}>
                {wheel.isSpinning ? 'Đang quay...' : 'Quay'}
              </Button>
            </ActionBar>

            <SegmentedControl label="Dải màu" options={THEME_OPTIONS} value={wheel.theme.id} onChange={wheel.setThemeId} />
          </>
        }
        aside={
          <WheelSettings
            segments={wheel.segments}
            onChange={wheel.setSegments}
            onShuffle={wheel.shuffleSegments}
            disabled={wheel.isSpinning}
          />
        }
      />

      <ResultModal
        open={wheel.resultOpen}
        onClose={wheel.closeResult}
        title="kết quả"
        subtitle="Kim dừng ở ô:"
        result={wheel.winner?.label}
        actions={[
          { label: 'Quay tiếp', onClick: wheel.spin },
          { label: 'Loại khỏi vòng quay', onClick: wheel.removeWinner, variant: 'secondary' },
        ]}
      />
    </>
  );
}
