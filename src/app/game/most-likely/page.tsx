// Trang trò chơi Chỉ Mặt Đặt Tên
import GameShell from '@/layout/GameShell';
import MostLikelyGame from '@/games/most-likely';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('most-likely');

export default function MostLikelyPage() {
  return (
    <GameShell slug="most-likely">
      <MostLikelyGame />
    </GameShell>
  );
}
