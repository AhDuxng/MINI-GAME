// Nhóm nhãn MỚI/HOT/VIP của một game, dùng trên thẻ game và đầu trang game
import Badge from '@/shared/ui/Badge';
import type { GameInfo } from '../games';
import { cn } from '@/shared/lib/utils';

export default function GameBadges({ game, className }: { game: GameInfo; className?: string }) {
  if (game.badges.length === 0 && !game.vip) return null;
  return (
    <span className={cn('flex flex-wrap gap-1', className)}>
      {game.badges.map((badge) => (
        <Badge key={badge} tone={badge} />
      ))}
      {game.vip && <Badge tone="vip" />}
    </span>
  );
}
