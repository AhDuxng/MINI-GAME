// Hình đại diện cho vai và người chơi: biểu tượng từng vai theo màu ramp, nhãn vai, ô chữ cái đầu của người chơi có trạng thái đã chết
import type { IconType } from 'react-icons';
import { GiCrossbow, GiCrystalBall, GiDeathSkull, GiFarmer, GiPotionBall, GiShield, GiWolfHead } from 'react-icons/gi';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import { ROLES, type RoleId } from '../engine/roles';

export const ROLE_ICONS: Record<RoleId, IconType> = {
  wolf: GiWolfHead,
  seer: GiCrystalBall,
  guard: GiShield,
  witch: GiPotionBall,
  hunter: GiCrossbow,
  villager: GiFarmer,
};

export function RoleIcon({ role, className }: { role: RoleId; className?: string }) {
  const Icon = ROLE_ICONS[role];
  return <Icon className={className} aria-hidden />;
}

export function RoleTag({ role, count, className }: { role: RoleId; count?: number; className?: string }) {
  const info = ROLES[role];
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2 py-1 font-display text-sm font-bold text-[#12121a] rounded-md', className)}
      style={{ background: rampFill(info.stop) }}
    >
      <RoleIcon role={role} className="h-4 w-4" />
      {count !== undefined && <span>{count}</span>}
      {info.name}
    </span>
  );
}

interface AvatarProps {
  name: string;
  seat: number;
  alive?: boolean;
  online?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AVATAR_SIZES = { sm: 'h-8 w-8 text-sm', md: 'h-11 w-11 text-lg', lg: 'h-16 w-16 text-2xl' };

export function Avatar({ name, seat, alive = true, online, size = 'md' }: AvatarProps) {
  return (
    <span className={cn('relative flex flex-shrink-0 items-center justify-center font-display font-extrabold uppercase text-[#12121a]', AVATAR_SIZES[size], !alive && 'grayscale')} style={{ background: rampFill(seat) }}>
      {alive ? name.charAt(0) : <GiDeathSkull className="h-3/5 w-3/5 opacity-80" aria-hidden />}
      {online !== undefined && (
        <span className={cn('absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-canvas', online ? 'bg-ramp-8' : 'bg-line')} />
      )}
    </span>
  );
}
