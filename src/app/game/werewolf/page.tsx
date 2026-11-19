// Trang trò chơi Ma Sói online
import GameShell from '@/layout/GameShell';
import WerewolfGame from '@/games/werewolf';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('werewolf');

export default function WerewolfPage() {
  return (
    <GameShell slug="werewolf">
      <WerewolfGame />
    </GameShell>
  );
}
