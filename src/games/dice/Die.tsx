// Khối xí ngầu 3D bằng CSS transform: sáu mặt bo góc bọc quanh một lõi vuông nhỏ hơn để góc khối không hở; mỗi lần lắc cộng thêm số vòng nguyên nên luôn dừng đúng mặt đích
import { DICE_FACES } from '@/data';
import { faceStyle } from './face-style';
import { ROLL_DURATION_MS, type SpinTurns } from './useDiceGame';

const HALF_SIZE_PX = 80;
const CORE_INSET_PX = 4;

const FACE_PLACEMENT: Record<number, string> = {
  1: 'rotateY(0deg)',
  2: 'rotateY(90deg)',
  3: 'rotateY(180deg)',
  4: 'rotateY(-90deg)',
  5: 'rotateX(90deg)',
  6: 'rotateX(-90deg)',
};

const FACE_ORIENTATION: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: 0, y: 180 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 90, y: 0 },
};

interface DieProps {
  faceId: number;
  turns: SpinTurns;
}

export default function Die({ faceId, turns }: DieProps) {
  const orientation = FACE_ORIENTATION[faceId];
  const cubeTransform = `rotateX(${turns.x * 360 + orientation.x}deg) rotateY(${turns.y * 360 + orientation.y}deg) rotateZ(${turns.z * 360}deg)`;

  return (
    <div data-theme="light" className="mx-auto h-40 w-40 [perspective:900px]">
      <div
        className="preserve-3d relative h-full w-full"
        style={{
          transform: cubeTransform,
          transition: `transform ${ROLL_DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
        }}
      >
        {Object.entries(FACE_PLACEMENT).map(([id, placement]) => (
          <div
            key={`core-${id}`}
            aria-hidden
            className="absolute bg-edge"
            style={{ inset: CORE_INSET_PX, transform: `${placement} translateZ(${HALF_SIZE_PX - CORE_INSET_PX}px)` }}
          />
        ))}
        {DICE_FACES.map((face) => {
          const { Icon, color } = faceStyle(face);
          return (
            <div
              key={face.id}
              className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-edge bg-canvas p-2 text-center rounded-lg"
              style={{ transform: `${FACE_PLACEMENT[face.id]} translateZ(${HALF_SIZE_PX}px)`, color }}
            >
              <Icon className="h-14 w-14" />
              <span className="text-lg font-bold">{face.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
