// Trang trò chơi Đua vịt
import GameShell from '@/layout/GameShell';
import DuckRaceGame from '@/games/duck-race';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('duck-race');

export default function DuckRacePage() {
  return (
    <GameShell slug="duck-race">
      <DuckRaceGame />
    </GameShell>
  );
}
