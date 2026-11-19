// Luật thuần của Nhanh Tay Lẹ Mắt: bốn kiểu vòng (đèn xanh, tìm con vịt, số 7, chữ đúng màu), mỗi vòng sinh sẵn một chuỗi khung hình có đúng một khung đích
import { pickRandom, randomBetween, randomInt } from '@/shared/lib/random';

export type ChallengeKind = 'light' | 'duck' | 'seven' | 'color';
export type AnimalId = 'duck' | 'frog' | 'cat' | 'dog' | 'chicken' | 'pig' | 'rabbit' | 'fish' | 'snail' | 'turtle';
export type ColorId = 'red' | 'yellow' | 'purple' | 'blue';

export type Display =
  | { type: 'light'; state: 'red' | 'yellow' | 'green' }
  | { type: 'icon'; animal: AnimalId }
  | { type: 'number'; value: number }
  | { type: 'word'; word: ColorId; ink: ColorId };

export interface Frame {
  display: Display;
  duration: number;
  target: boolean;
}

export const CHALLENGES: Record<ChallengeKind, { rule: string; short: string }> = {
  light: { rule: 'Chạm khi đèn chuyển XANH', short: 'Đèn xanh' },
  duck: { rule: 'Chạm khi thấy CON VỊT', short: 'Tìm con vịt' },
  seven: { rule: 'Chạm khi hiện SỐ 7', short: 'Số 7' },
  color: { rule: 'Chạm khi CHỮ ĐÚNG MÀU', short: 'Chữ đúng màu' },
};

export const COLOR_WORDS: Record<ColorId, { label: string; ink: string }> = {
  red: { label: 'ĐỎ', ink: '#e5484d' },
  yellow: { label: 'VÀNG', ink: '#e8b10c' },
  purple: { label: 'TÍM', ink: '#8b5cf6' },
  blue: { label: 'XANH', ink: '#2563eb' },
};

const DISTRACTOR_ANIMALS: AnimalId[] = ['frog', 'cat', 'dog', 'chicken', 'pig', 'rabbit', 'fish', 'snail', 'turtle'];
const COLOR_IDS = Object.keys(COLOR_WORDS) as ColorId[];
const LIGHT_GREEN_MS = 2600;
const AFTER_TARGET_FRAMES = 3;

function lightFrames(): Frame[] {
  const frames: Frame[] = [{ display: { type: 'light', state: 'red' }, duration: randomBetween(900, 2200), target: false }];
  if (Math.random() < 0.45) {
    frames.push({ display: { type: 'light', state: 'yellow' }, duration: randomBetween(450, 800), target: false });
    frames.push({ display: { type: 'light', state: 'red' }, duration: randomBetween(700, 1600), target: false });
  } else {
    frames.push({ display: { type: 'light', state: 'red' }, duration: randomBetween(500, 2000), target: false });
  }
  frames.push({ display: { type: 'light', state: 'green' }, duration: LIGHT_GREEN_MS, target: true });
  return frames;
}

function sequence<T>(length: number, targetAt: number, distractor: (previous: T | null) => T, target: T, toDisplay: (value: T) => Display, duration: number): Frame[] {
  const frames: Frame[] = [];
  let previous: T | null = null;
  for (let index = 0; index < length; index++) {
    const isTarget = index === targetAt;
    const value: T = isTarget ? target : distractor(previous);
    previous = value;
    frames.push({ display: toDisplay(value), duration, target: isTarget });
  }
  return frames;
}

function differentFrom<T>(options: T[], previous: T | null) {
  const pool = options.filter((option) => option !== previous);
  return pickRandom(pool.length > 0 ? pool : options);
}

export function buildRound(kind: ChallengeKind, speedUp: number): Frame[] {
  const pace = Math.max(0.7, 1 - speedUp * 0.04);
  if (kind === 'light') return lightFrames();
  if (kind === 'duck') {
    const targetAt = 3 + randomInt(6);
    return sequence<AnimalId>(targetAt + AFTER_TARGET_FRAMES, targetAt, (previous) => differentFrom(DISTRACTOR_ANIMALS, previous), 'duck', (animal) => ({ type: 'icon', animal }), 680 * pace);
  }
  if (kind === 'seven') {
    const digits = [1, 2, 3, 4, 5, 6, 8, 9];
    const targetAt = 3 + randomInt(6);
    return sequence<number>(targetAt + AFTER_TARGET_FRAMES, targetAt, (previous) => differentFrom(digits, previous), 7, (value) => ({ type: 'number', value }), 620 * pace);
  }
  const targetAt = 2 + randomInt(5);
  const frames: Frame[] = [];
  for (let index = 0; index < targetAt + AFTER_TARGET_FRAMES; index++) {
    const word = pickRandom(COLOR_IDS);
    const ink = index === targetAt ? word : differentFrom(COLOR_IDS, word);
    frames.push({ display: { type: 'word', word, ink }, duration: 980 * pace, target: index === targetAt });
  }
  return frames;
}

export function nextChallenge(previous: ChallengeKind | null): ChallengeKind {
  return differentFrom(Object.keys(CHALLENGES) as ChallengeKind[], previous);
}
