// Lá vai bí mật: úp sẵn để người ngồi cạnh không nhìn trộm, nhấn giữ để lật xem vai, phe, năng lực và đồng bọn nếu là sói
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { GiHood } from 'react-icons/gi';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import { ROLES, TEAM_NAMES, type RoleId } from '../engine/roles';
import type { PlayerView } from '../engine/types';
import { RoleIcon } from './role-art';

interface RoleCardProps {
  role: RoleId;
  mates: PlayerView[];
  compact?: boolean;
}

export default function RoleCard({ role, mates, compact = false }: RoleCardProps) {
  const [open, setOpen] = useState(false);
  const info = ROLES[role];
  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <div className="[perspective:1200px]">
      <motion.button
        type="button"
        onPointerDown={show}
        onPointerUp={hide}
        onPointerLeave={hide}
        onPointerCancel={hide}
        onKeyDown={(event) => (event.key === ' ' || event.key === 'Enter') && show()}
        onKeyUp={hide}
        onContextMenu={(event) => event.preventDefault()}
        aria-label="Nhấn giữ để xem vai của bạn"
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className={cn('preserve-3d relative block w-full touch-none select-none', compact ? 'h-28' : 'h-[300px] sm:h-[340px]')}
      >
        <span className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-edge bg-[radial-gradient(circle_at_50%_30%,#2a2f4a,#0b0d18)] p-4 text-center text-[#e8e6f0] rounded-xl">
          <span className="dot-screen absolute inset-0 opacity-20" />
          <GiHood className={cn('relative', compact ? 'h-8 w-8' : 'h-20 w-20')} />
          <span className={cn('relative font-display font-extrabold', compact ? 'text-base' : 'text-2xl')}>Vai bí mật</span>
          <span className="relative text-sm font-semibold opacity-80">Nhấn giữ để xem, che màn hình khỏi người bên cạnh</span>
        </span>

        <span
          className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-edge p-4 text-center text-[#12121a] [transform:rotateY(180deg)] rounded-xl"
          style={{ background: `linear-gradient(160deg, ${rampFill(info.stop)}, color-mix(in srgb, ${rampFill(info.stop)} 55%, #ffffff))` }}
        >
          <RoleIcon role={role} className={compact ? 'h-9 w-9' : 'h-24 w-24'} />
          <span className={cn('font-display font-extrabold leading-none', compact ? 'text-xl' : 'text-4xl')}>{info.name}</span>
          <span className="text-xs font-extrabold uppercase tracking-wider opacity-75">{TEAM_NAMES[info.team]}</span>
          {!compact && <span className="max-w-xs text-sm font-semibold">{info.summary}</span>}
          {role === 'wolf' && mates.length > 0 && <span className="text-sm font-bold">Đồng bọn: {mates.map((mate) => mate.name).join(', ')}</span>}
        </span>
      </motion.button>
      {!compact && <p className="mt-3 min-h-[2.5rem] text-center text-sm text-muted">{open ? info.tip : 'Chỉ mình bạn được biết vai này, đừng để lộ.'}</p>}
    </div>
  );
}
