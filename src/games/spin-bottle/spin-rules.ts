// Hình học Xoay Chai: chỗ ngồi chia đều quanh bàn theo góc, tính góc dừng để cổ chai chỉ đúng người được chọn và đọc ngược ai đang bị chỉ
export const SPIN_SECONDS = 4.6;
export const MIN_TURNS = 4;
export const DEFAULT_SEATS = Array.from({ length: 6 }, (_, index) => `Người ${index + 1}`);

const MAX_JITTER = 0.35;

export function seatSlice(count: number) {
  return 360 / Math.max(count, 1);
}

export function seatHeading(index: number, count: number) {
  return index * seatSlice(count);
}

export function normalizeDegrees(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function spinTarget(current: number, target: number, count: number, turns: number, jitter: number) {
  const offset = Math.max(-1, Math.min(1, jitter)) * MAX_JITTER * seatSlice(count);
  const heading = normalizeDegrees(seatHeading(target, count) + offset);
  return current + turns * 360 + normalizeDegrees(heading - normalizeDegrees(current));
}

export function pickTarget(count: number, previous: number | null, random: () => number = Math.random) {
  if (count <= 1) return 0;
  if (previous === null || count < 3) return Math.floor(random() * count);
  return (previous + 1 + Math.floor(random() * (count - 1))) % count;
}
