// Trang trò chơi Xí ngầu cạn ly
import GameShell from '@/layout/GameShell';
import DiceGame from '@/games/dice';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('dice');

export default function DicePage() {
  return (
    <GameShell slug="dice">
      <DiceGame />
    </GameShell>
  );
}
