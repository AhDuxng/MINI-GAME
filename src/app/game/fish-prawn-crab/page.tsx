// Trang trò chơi Bầu Cua
import GameShell from '@/layout/GameShell';
import FishPrawnCrabGame from '@/games/fish-prawn-crab';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('fish-prawn-crab');

export default function FishPrawnCrabPage() {
  return (
    <GameShell slug="fish-prawn-crab">
      <FishPrawnCrabGame />
    </GameShell>
  );
}
