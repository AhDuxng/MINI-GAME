// Trang trò chơi Tôi Chưa Từng
import GameShell from '@/layout/GameShell';
import NeverHaveIGame from '@/games/never-have-i';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('never-have-i');

export default function NeverHaveIPage() {
  return (
    <GameShell slug="never-have-i">
      <NeverHaveIGame />
    </GameShell>
  );
}
