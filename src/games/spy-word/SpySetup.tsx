// Màn thiết lập Gián Điệp: chọn số gián điệp và thời gian thảo luận, xem tóm tắt ván rồi chia vai
'use client';

import { FaUserSecret } from 'react-icons/fa6';
import { ActionBar, GameStage } from '@/games/kit';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampFill } from '@/shared/lib/ramp';
import { DISCUSS_OPTIONS, MIN_PLAYERS, TWO_SPIES_MIN_PLAYERS, type SpyCountSetting } from './useSpyWord';

const SPY_OPTIONS: { value: SpyCountSetting; label: string }[] = [
  { value: 'auto', label: 'Tự động' },
  { value: 1, label: '1 gián điệp' },
  { value: 2, label: '2 gián điệp' },
];

function durationLabel(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest === 0 ? `${minutes} phút` : `${minutes} phút ${rest}s`;
}

const TIME_OPTIONS = DISCUSS_OPTIONS.map((seconds) => ({ value: seconds, label: durationLabel(seconds) }));

interface SpySetupProps {
  playerCount: number;
  spyCount: number;
  spySetting: SpyCountSetting;
  discussSeconds: number;
  canStart: boolean;
  onChange: (settings: { spyCount: SpyCountSetting; discussSeconds: number }) => void;
  onStart: () => void;
}

export default function SpySetup({ playerCount, spyCount, spySetting, discussSeconds, canStart, onChange, onStart }: SpySetupProps) {
  return (
    <>
      <GameStage theme="noir" onTap={canStart ? onStart : undefined} className="flex flex-col items-center gap-6 px-4 pb-16 pt-10 text-center">
        <div className="relative h-36 w-56 [perspective:900px]">
          {[-14, 0, 14].map((angle, index) => (
            <span
              key={angle}
              className="absolute left-1/2 top-0 flex h-36 w-24 -translate-x-1/2 items-center justify-center rounded-xl border border-[#12121a]/20 font-display text-5xl font-extrabold text-[#12121a] shadow-[0_18px_30px_-16px_rgba(0,0,0,0.7)]"
              style={{
                background: `linear-gradient(135deg, ${rampFill(5 + index)}, ${rampFill(7)})`,
                transform: `translateX(-50%) rotate(${angle}deg) translateY(${Math.abs(angle) / 2}px)`,
                transformOrigin: '50% 120%',
              }}
            >
              {index === 1 ? <FaUserSecret className="h-10 w-10" /> : '?'}
            </span>
          ))}
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-ink">
            {playerCount} người chơi · {spyCount} gián điệp ẩn mình
          </p>
          <p className="mt-1 text-sm text-muted">Gián điệp nhận một từ gần giống và không biết mình là gián điệp.</p>
        </div>
      </GameStage>

      <Panel title="Thiết lập ván" stop={5}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <SegmentedControl
              label="Số gián điệp"
              options={SPY_OPTIONS}
              value={spySetting}
              onChange={(value) => onChange({ spyCount: value, discussSeconds })}
            />
            {playerCount < TWO_SPIES_MIN_PLAYERS && (
              <p className="text-xs font-semibold text-muted">Từ {TWO_SPIES_MIN_PLAYERS} người trở lên mới có 2 gián điệp.</p>
            )}
          </div>
          <SegmentedControl
            label="Thời gian thảo luận"
            options={TIME_OPTIONS}
            value={discussSeconds}
            onChange={(value) => onChange({ spyCount: spySetting, discussSeconds: value })}
          />
        </div>
      </Panel>

      <ActionBar>
        <Button size="lg" disabled={!canStart} onClick={onStart}>
          <FaUserSecret className="h-4 w-4" />
          {canStart ? 'Chia vai & bắt đầu' : `Cần ít nhất ${MIN_PLAYERS} người chơi`}
        </Button>
      </ActionBar>
    </>
  );
}
