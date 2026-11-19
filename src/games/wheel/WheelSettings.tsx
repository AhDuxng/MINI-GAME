// Bảng cấu hình vòng quay: nạp nhanh danh sách mẫu, trộn thứ tự và chỉnh sửa từng ô
'use client';

import { FaShuffle, FaSkull, FaUsers } from 'react-icons/fa6';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import ListEditor from '@/shared/ui/ListEditor';
import Panel from '@/shared/ui/Panel';
import { usePlayers } from '@/features/players';
import { PUNISHMENTS } from '@/data';

interface WheelSettingsProps {
  segments: string[];
  onChange: (segments: string[]) => void;
  onShuffle: () => void;
  disabled: boolean;
}

export default function WheelSettings({ segments, onChange, onShuffle, disabled }: WheelSettingsProps) {
  const { players } = usePlayers();

  return (
    <Panel title="Cấu hình vòng quay" stop={1} action={<Badge>{segments.length} ô</Badge>}>
      <div className="mb-5 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled || players.length < 2}
          title={players.length < 2 ? 'Cần ít nhất 2 người chơi đã lưu' : undefined}
          onClick={() => onChange(players)}
        >
          <FaUsers className="h-3 w-3" />
          Người chơi
        </Button>
        <Button variant="secondary" size="sm" disabled={disabled} onClick={() => onChange(PUNISHMENTS)}>
          <FaSkull className="h-3 w-3" />
          Hình phạt
        </Button>
        <Button variant="secondary" size="sm" disabled={disabled || segments.length < 2} onClick={onShuffle}>
          <FaShuffle className="h-3 w-3" />
          Trộn
        </Button>
      </div>

      <ListEditor
        label="Người tham gia / phần thưởng"
        items={segments}
        onSave={onChange}
        disabled={disabled}
        placeholder="Mỗi dòng một ô..."
      />
    </Panel>
  );
}
