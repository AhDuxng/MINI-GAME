// Trang trò chơi Rút bao lì xì
import GameShell from '@/layout/GameShell';
import LuckyMoneyGame from '@/games/lucky-money';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('lucky-money');

export default function LuckyMoneyPage() {
  return (
    <GameShell slug="lucky-money">
      <LuckyMoneyGame />
    </GameShell>
  );
}
