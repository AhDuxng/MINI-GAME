// Trang trò chơi Nối từ
import GameShell from '@/layout/GameShell';
import WordChainGame from '@/games/word-chain';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('word-chain');

export default function WordChainPage() {
  return (
    <GameShell slug="word-chain">
      <WordChainGame />
    </GameShell>
  );
}
