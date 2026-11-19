// Trang trò chơi Luật Bài
import GameShell from '@/layout/GameShell';
import CardRulesGame from '@/games/card-rules';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('card-rules');

export default function CardRulesPage() {
  return (
    <GameShell slug="card-rules">
      <CardRulesGame />
    </GameShell>
  );
}
