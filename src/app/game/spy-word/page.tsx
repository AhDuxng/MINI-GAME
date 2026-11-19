// Trang trò chơi Gián Điệp
import GameShell from '@/layout/GameShell';
import SpyWordGame from '@/games/spy-word';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('spy-word');

export default function SpyWordPage() {
  return (
    <GameShell slug="spy-word">
      <SpyWordGame />
    </GameShell>
  );
}
