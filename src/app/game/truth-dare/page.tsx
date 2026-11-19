// Trang trò chơi Thật hay Thách
import GameShell from '@/layout/GameShell';
import TruthDareGame from '@/games/truth-dare';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('truth-dare');

export default function TruthDarePage() {
  return (
    <GameShell slug="truth-dare">
      <TruthDareGame />
    </GameShell>
  );
}
