// Lưới ghế người chơi dùng cho mọi pha: hiện trạng thái sống/chết, vai đã lộ, phiếu đang dồn vào ai, và cho chọn mục tiêu khi tới lượt hành động
'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FaCrown } from 'react-icons/fa6';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import { ROLES } from '../engine/roles';
import type { PlayerView } from '../engine/types';
import { Avatar, RoleIcon } from './role-art';

interface PlayerGridProps {
  players: PlayerView[];
  online?: string[];
  selectedId?: string | null;
  canPick?: (player: PlayerView) => boolean;
  onPick?: (player: PlayerView) => void;
  markers?: Record<string, PlayerView[]>;
  note?: (player: PlayerView) => ReactNode;
  dense?: boolean;
  single?: boolean;
}

export default function PlayerGrid({ players, online, selectedId, canPick, onPick, markers, note, dense = false, single = false }: PlayerGridProps) {
  return (
    <ul className={cn('grid gap-2', single ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : dense ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4')}>
      {players.map((player) => {
        const pickable = Boolean(onPick) && (canPick ? canPick(player) : true);
        const selected = selectedId === player.id;
        const voters = markers?.[player.id] ?? [];
        const content = (
          <>
            <Avatar name={player.name} seat={player.seat} alive={player.alive} online={online ? online.includes(player.id) : undefined} size={dense ? 'sm' : 'md'} />
            <span className="min-w-0 flex-1 text-left">
              <span className="flex items-center gap-1.5">
                <span className={cn('truncate font-display font-bold', player.alive ? 'text-ink' : 'text-muted line-through', dense ? 'text-sm' : 'text-base')}>{player.name}</span>
                {player.isHost && <FaCrown className="h-3 w-3 flex-shrink-0 text-ramp-text-1" aria-label="Chủ phòng" />}
              </span>
              <span className="flex flex-wrap items-center gap-x-2 text-xs font-bold text-muted">
                {player.isMe && <span className="text-ramp-text-6">Bạn</span>}
                {player.role && (
                  <span className="flex items-center gap-1" style={{ color: `var(--ramp-text-${ROLES[player.role].stop})` }}>
                    <RoleIcon role={player.role} className="h-3.5 w-3.5" />
                    {ROLES[player.role].name}
                  </span>
                )}
                {!player.alive && <span>Đã chết</span>}
                {note?.(player)}
              </span>
            </span>
            {voters.length > 0 && (
              <motion.span key={voters.length} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                <span className="hidden -space-x-1.5 sm:flex">
                  {voters.slice(0, 4).map((voter) => (
                    <span key={voter.id} className="flex h-5 w-5 items-center justify-center border border-canvas text-[10px] font-extrabold uppercase text-[#12121a] rounded-md" style={{ background: rampFill(voter.seat) }}>
                      {voter.name.charAt(0)}
                    </span>
                  ))}
                </span>
                <span className="flex h-7 min-w-[1.75rem] items-center justify-center bg-ink px-1.5 font-display text-sm font-extrabold text-canvas">{voters.length}</span>
              </motion.span>
            )}
          </>
        );

        const tileClass = cn(
          'flex w-full items-center gap-2.5 border-2 bg-canvas transition-[background-color,opacity,transform] duration-200 rounded-xl',
          dense ? 'p-2' : 'p-2.5',
          selected ? 'border-edge bg-elevated' : 'border-line',
          !player.alive && 'opacity-60',
        );

        return (
          <li key={player.id}>
            {onPick ? (
              <button type="button" disabled={!pickable} onClick={() => onPick(player)} aria-pressed={selected} className={cn(tileClass, pickable ? 'hover:bg-elevated active:scale-[0.98]' : 'cursor-not-allowed opacity-40')}>
                {content}
              </button>
            ) : (
              <div className={tileClass}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
