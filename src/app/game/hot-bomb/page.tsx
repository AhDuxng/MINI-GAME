// Trang trò chơi Bom Nổ Chậm
import GameShell from '@/layout/GameShell';
import HotBombGame from '@/games/hot-bomb';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('hot-bomb');

export default function HotBombPage() {
  return (
    <GameShell slug="hot-bomb">
      <HotBombGame />
    </GameShell>
  );
}
