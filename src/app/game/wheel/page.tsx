// Trang trò chơi Vòng quay may mắn
import GameShell from '@/layout/GameShell';
import WheelGame from '@/games/wheel';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('wheel');

export default function WheelPage() {
  return (
    <GameShell slug="wheel">
      <WheelGame />
    </GameShell>
  );
}
