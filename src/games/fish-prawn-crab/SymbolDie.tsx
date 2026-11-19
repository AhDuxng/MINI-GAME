// Xúc xắc Bầu Cua 3D bằng CSS: sáu mặt là sáu linh vật, mỗi lần lắc cộng thêm vòng nguyên nên luôn dừng đúng mặt kết quả
import { SYMBOL_IDS, type SymbolId } from './fish-prawn-crab-rules';
import { SymbolIcon } from '@/features/catalog';
import type { SpinTurns } from './useFishPrawnCrab';

const HALF_SIZE_PX = 32;

const FACE_PLACEMENT = ['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'];

const FACE_ORIENTATION = [
  { x: 0, y: 0 },
  { x: 0, y: -90 },
  { x: 0, y: 180 },
  { x: 0, y: 90 },
  { x: -90, y: 0 },
  { x: 90, y: 0 },
];

interface SymbolDieProps {
  face: SymbolId;
  turns: SpinTurns;
  durationMs: number;
}

export default function SymbolDie({ face, turns, durationMs }: SymbolDieProps) {
  const orientation = FACE_ORIENTATION[SYMBOL_IDS.indexOf(face)];
  const transform = `rotateX(${turns.x * 360 + orientation.x}deg) rotateY(${turns.y * 360 + orientation.y}deg) rotateZ(${turns.z * 360}deg)`;

  return (
    <div className="preserve-3d h-16 w-16 [transform:rotateX(-16deg)_rotateY(-18deg)]">
      <div
        className="preserve-3d relative h-full w-full"
        style={{ transform, transition: `transform ${durationMs}ms cubic-bezier(0.2, 0.8, 0.2, 1)` }}
      >
        {SYMBOL_IDS.map((symbol, index) => (
          <div
            key={symbol}
            className="backface-hidden absolute inset-0 flex items-center justify-center border-2 border-edge bg-canvas rounded-lg"
            style={{ transform: `${FACE_PLACEMENT[index]} translateZ(${HALF_SIZE_PX}px)` }}
          >
            <SymbolIcon id={symbol} className="h-12 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
