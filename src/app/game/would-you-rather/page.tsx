// Trang trò chơi Này Hay Kia
import GameShell from '@/layout/GameShell';
import WouldYouRatherGame from '@/games/would-you-rather';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('would-you-rather');

export default function WouldYouRatherPage() {
  return (
    <GameShell slug="would-you-rather">
      <WouldYouRatherGame />
    </GameShell>
  );
}
