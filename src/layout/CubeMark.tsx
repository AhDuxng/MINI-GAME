// Logo khối Rubik isometric: 27 sticker trên 3 mặt nhìn thấy, màu trải theo dải ramp từ trái sang phải
import { RAMP_SIZE, rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';

type Point3 = [number, number, number];

const COS30 = Math.cos(Math.PI / 6);
const INSET = 0.8;
const PAD = 0.25;

function project([x, y, z]: Point3): [number, number] {
  return [(x - z) * COS30, (x + z) * 0.5 - y];
}

function quad(corners: Point3[]) {
  const points = corners.map(project);
  const cx = points.reduce((sum, [x]) => sum + x, 0) / 4;
  const cy = points.reduce((sum, [, y]) => sum + y, 0) / 4;
  const shrunk = points.map(([x, y]) => [cx + (x - cx) * INSET, cy + (y - cy) * INSET]);
  const stop = Math.round(((cx + 3 * COS30) / (6 * COS30)) * (RAMP_SIZE - 1));
  return { points: shrunk.map((p) => p.map((v) => v.toFixed(3)).join(',')).join(' '), stop };
}

function buildStickers() {
  const stickers: { points: string; stop: number }[] = [];
  for (let u = 0; u < 3; u++) {
    for (let v = 0; v < 3; v++) {
      stickers.push(quad([[u, 3, v], [u + 1, 3, v], [u + 1, 3, v + 1], [u, 3, v + 1]]));
      stickers.push(quad([[u, v, 3], [u + 1, v, 3], [u + 1, v + 1, 3], [u, v + 1, 3]]));
      stickers.push(quad([[3, v, u], [3, v, u + 1], [3, v + 1, u + 1], [3, v + 1, u]]));
    }
  }
  return stickers;
}

const STICKERS = buildStickers();
const OUTLINE = ([[0, 3, 0], [3, 3, 0], [3, 0, 0], [3, 0, 3], [0, 0, 3], [0, 3, 3]] as Point3[])
  .map((corner) => project(corner).map((v) => v.toFixed(3)).join(','))
  .join(' ');
const VIEW_BOX = `${(-3 * COS30 - PAD).toFixed(3)} ${-3 - PAD} ${(6 * COS30 + 2 * PAD).toFixed(3)} ${6 + 2 * PAD}`;

export default function CubeMark({ className }: { className?: string }) {
  return (
    <svg viewBox={VIEW_BOX} aria-hidden className={cn('h-8 w-8', className)}>
      <polygon points={OUTLINE} className="fill-ink" stroke="rgb(var(--ink))" strokeWidth={0.35} strokeLinejoin="round" />
      {STICKERS.map((sticker, index) => (
        <polygon key={index} points={sticker.points} style={{ fill: rampFill(sticker.stop) }} strokeLinejoin="round" />
      ))}
    </svg>
  );
}
