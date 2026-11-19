// Trang trò chơi Vẽ Nhanh Đoán Lẹ
import GameShell from '@/layout/GameShell';
import DrawGuessGame from '@/games/draw-guess';
import { gameMetadata } from '@/features/catalog';

export const metadata = gameMetadata('draw-guess');

export default function DrawGuessPage() {
  return (
    <GameShell slug="draw-guess">
      <DrawGuessGame />
    </GameShell>
  );
}
