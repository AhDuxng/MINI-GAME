// Trang trò chơi Đoán Trên Trán
import GameShell from '@/layout/GameShell';
import ForeheadGame from '@/games/forehead';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('forehead');

export default function ForeheadPage() {
  return (
    <GameShell slug="forehead">
      <ForeheadGame />
    </GameShell>
  );
}
