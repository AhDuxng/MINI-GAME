// Hình học vòng quay: vẽ lát cắt SVG và tính góc quay để kim chỉ dừng đúng ô đã chọn trước
const FULL_TURN = 360;
const POINTER_ANGLE = 270;
const MIN_TURNS = 5;
const EDGE_PADDING_RATIO = 0.1;

export const SPIN_DURATION_S = 5;

function mod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export function polarToCartesian(center: number, radius: number, angleDeg: number) {
  const radians = (angleDeg * Math.PI) / 180;
  return { x: center + radius * Math.cos(radians), y: center + radius * Math.sin(radians) };
}

export function slicePath(center: number, radius: number, startDeg: number, endDeg: number) {
  if (endDeg - startDeg >= FULL_TURN) {
    return `M ${center - radius} ${center} a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
  }

  const start = polarToCartesian(center, radius, startDeg);
  const end = polarToCartesian(center, radius, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export function targetRotation(currentRotation: number, winnerIndex: number, segmentCount: number) {
  const slice = FULL_TURN / segmentCount;
  const padding = slice * EDGE_PADDING_RATIO;
  const landingAngle = winnerIndex * slice + padding + Math.random() * (slice - 2 * padding);
  const alignedRotation = mod(POINTER_ANGLE - landingAngle, FULL_TURN);
  const extraRotation = mod(alignedRotation - mod(currentRotation, FULL_TURN), FULL_TURN);
  return currentRotation + MIN_TURNS * FULL_TURN + extraRotation;
}

export function segmentColor(index: number, count: number, palette: string[]) {
  const color = palette[index % palette.length];
  const clashesWithFirst = count > 1 && index === count - 1 && color === palette[0];
  return clashesWithFirst ? palette[Math.floor(palette.length / 2)] : color;
}

export function isLeftHalf(angleDeg: number) {
  const angle = mod(angleDeg, FULL_TURN);
  return angle > 90 && angle < 270;
}

export function labelStyle(count: number) {
  if (count <= 6) return { fontSize: 22, maxChars: 16 };
  if (count <= 10) return { fontSize: 18, maxChars: 16 };
  if (count <= 16) return { fontSize: 14, maxChars: 14 };
  return { fontSize: 11, maxChars: 12 };
}
