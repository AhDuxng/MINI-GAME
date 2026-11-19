// Truy cập dải màu ramp 9 stop: mọi thành phần có màu đều lấy theo chỉ số trên cùng một dải để cả trang đọc như một phổ màu
export const RAMP_SIZE = 9;

export function rampStop(index: number) {
  return ((index % RAMP_SIZE) + RAMP_SIZE) % RAMP_SIZE;
}

export function spreadStop(index: number, count: number) {
  return count <= 1 ? 0 : Math.round((index * (RAMP_SIZE - 1)) / (count - 1));
}

export function rampFill(index: number) {
  return `var(--ramp-${rampStop(index)})`;
}

export function rampText(index: number) {
  return `var(--ramp-text-${rampStop(index)})`;
}

export function rampWash(index: number, percent = 20) {
  return `color-mix(in srgb, var(--ramp-${rampStop(index)}) ${percent}%, transparent)`;
}
