// Màn thiết lập ván nối từ: chọn chế độ, thời gian mỗi lượt, xem luật và danh sách người chơi
'use client';

import { FaPlay } from 'react-icons/fa6';
import { ActionBar, GameLayout, GameStage } from '@/games/kit';
import { PlayerPanel } from '@/features/players';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { rampFill } from '@/shared/lib/ramp';
import { TURN_SECONDS_OPTIONS } from './useWordChain';
import WordTiles from './WordTiles';
import type { WordMode } from './word-rules';

const MODE_OPTIONS: { value: WordMode; label: string }[] = [
  { value: 'chain', label: 'Nối từ' },
  { value: 'topic', label: 'Theo chủ đề' },
];

const TIME_OPTIONS = TURN_SECONDS_OPTIONS.map((seconds) => ({ value: seconds, label: `${seconds}s` }));

const RULES: Record<WordMode, string[]> = {
  chain: [
    'Mỗi từ gồm đúng 2 tiếng, ví dụ "bàn ghế".',
    'Tiếng đầu của từ mới trùng tiếng cuối của từ trước: bàn ghế → ghế đá → đá bóng.',
    'Không lặp lại từ đã dùng. Từ vô nghĩa thì cả bàn bấm Bác bỏ.',
  ],
  topic: [
    'Game rút ngẫu nhiên một chủ đề, ví dụ "Động vật".',
    'Lần lượt kể tên một thứ thuộc chủ đề, không trùng người trước.',
    'Kể sai chủ đề thì cả bàn bấm Bác bỏ.',
  ],
};

interface WordChainSetupProps {
  mode: WordMode;
  turnSeconds: number;
  onChange: (settings: { mode: WordMode; turnSeconds: number }) => void;
  playerCount: number;
  onStart: () => void;
}

export default function WordChainSetup({ mode, turnSeconds, onChange, playerCount, onStart }: WordChainSetupProps) {
  const canStart = playerCount >= 2;
  const rules = [...RULES[mode], 'Hết giờ, chịu thua hoặc bị cả bàn bác bỏ từ sẽ bị loại và nhận hình phạt. Người trụ lại cuối cùng thắng!'];

  return (
    <GameLayout
      main={
        <>
          <GameStage theme="chalk" onTap={canStart ? onStart : undefined} className="px-6 py-14">
            <WordTiles key={mode} word={mode === 'chain' ? 'nối từ' : 'chủ đề'} highlightLast />
          </GameStage>

          <Panel title="Thiết lập ván chơi" stop={5}>
            <div className="grid gap-5 sm:grid-cols-2">
              <SegmentedControl label="Chế độ" options={MODE_OPTIONS} value={mode} onChange={(value) => onChange({ mode: value, turnSeconds })} />
              <SegmentedControl
                label="Thời gian mỗi lượt"
                options={TIME_OPTIONS}
                value={turnSeconds}
                onChange={(value) => onChange({ mode, turnSeconds: value })}
              />
            </div>
          </Panel>

          <Panel title="Luật chơi" stop={2}>
            <ol className="space-y-3">
              {rules.map((rule, index) => (
                <li key={rule} className="flex items-start gap-3 text-sm text-ink">
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center font-display text-sm font-bold text-[#12121a] rounded-md"
                    style={{ background: rampFill(index * 2) }}
                  >
                    {index + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ol>
          </Panel>

          <ActionBar>
            <Button size="lg" disabled={!canStart} onClick={onStart}>
              <FaPlay className="h-3.5 w-3.5" />
              {canStart ? 'Bắt đầu' : 'Cần ít nhất 2 người chơi'}
            </Button>
          </ActionBar>
        </>
      }
      aside={<PlayerPanel hint="Thứ tự lượt chơi theo thứ tự trong danh sách." />}
    />
  );
}
