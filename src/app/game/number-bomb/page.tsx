// Trang trò chơi Bom Số
import GameShell from '@/layout/GameShell';
import NumberBombGame from '@/games/number-bomb';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('number-bomb');

export default function NumberBombPage() {
  return (
    <GameShell slug="number-bomb">
      <NumberBombGame />
    </GameShell>
  );
}
