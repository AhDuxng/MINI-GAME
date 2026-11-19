// Trang trò chơi Xoay Chai
import GameShell from '@/layout/GameShell';
import SpinBottleGame from '@/games/spin-bottle';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('spin-bottle');

export default function SpinBottlePage() {
  return (
    <GameShell slug="spin-bottle">
      <SpinBottleGame />
    </GameShell>
  );
}
