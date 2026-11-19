// Trang trò chơi Nhanh Tay Lẹ Mắt
import GameShell from '@/layout/GameShell';
import QuickTapGame from '@/games/quick-tap';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('quick-tap');

export default function QuickTapPage() {
  return (
    <GameShell slug="quick-tap">
      <QuickTapGame />
    </GameShell>
  );
}
