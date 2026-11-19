// Khối quản lý danh sách người chơi dùng chung; trên điện thoại thu gọn ô soạn thảo khi đã đủ người để đỡ phải cuộn
'use client';

import { memo, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import ChipList from '@/shared/ui/ChipList';
import ListEditor from '@/shared/ui/ListEditor';
import Panel from '@/shared/ui/Panel';
import { usePlayers } from './PlayersContext';
import { cn } from '@/shared/lib/utils';

const MIN_PLAYERS = 2;

interface PlayerPanelProps {
  hint?: string;
  disabled?: boolean;
  className?: string;
}

function PlayerPanel({ hint, disabled, className }: PlayerPanelProps) {
  const { players, setPlayers, playersReady } = usePlayers();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (playersReady && players.length < MIN_PLAYERS) setExpanded(true);
  }, [playersReady, players.length]);

  return (
    <Panel
      title="Người chơi"
      stop={7}
      className={className}
      action={
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="chip h-8 md:pointer-events-none"
        >
          {players.length} người
          <FaChevronDown className={cn('h-2.5 w-2.5 transition-transform md:hidden', expanded && 'rotate-180')} />
        </button>
      }
    >
      <ChipList items={players} emptyText="Chưa có người chơi nào." />
      <div className={cn('mt-5 space-y-5', expanded ? 'block' : 'hidden', 'md:block')}>
        {hint && <p className="text-sm text-muted">{hint}</p>}
        <ListEditor
          label="Mỗi dòng một tên"
          items={players}
          onSave={setPlayers}
          unique
          disabled={disabled}
          placeholder={'Minh\nLan\nTuấn'}
          saveLabel="Lưu"
        />
      </div>
    </Panel>
  );
}

export default memo(PlayerPanel);
