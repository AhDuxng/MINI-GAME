// Luật Bom Số thuần: giấu số bom trong khoảng, chỉ nhận số đoán nằm trong khoảng an toàn, thu hẹp khoảng sau mỗi lượt và báo nổ khi trúng
export const RANGE_OPTIONS = [50, 100, 200, 500] as const;
export type RangeMax = (typeof RANGE_OPTIONS)[number];

export type GuessOutcome = 'below' | 'above' | 'boom';
export type GuessCheck = 'ok' | 'empty' | 'out-of-range' | 'finished';

export interface Guess {
  value: number;
  player: string | null;
  outcome: GuessOutcome;
}

export interface BombRound {
  max: number;
  secret: number;
  low: number;
  high: number;
  guesses: Guess[];
  exploded: boolean;
}

export function createRound(max: number, random: () => number = Math.random): BombRound {
  return { max, secret: 1 + Math.floor(random() * max), low: 0, high: max + 1, guesses: [], exploded: false };
}

export function safeMin(round: BombRound) {
  return round.low + 1;
}

export function safeMax(round: BombRound) {
  return round.high - 1;
}

export function remaining(round: BombRound) {
  return round.high - round.low - 1;
}

export function heat(round: BombRound) {
  if (round.exploded) return 1;
  return round.max <= 1 ? 1 : 1 - (remaining(round) - 1) / (round.max - 1);
}

export function checkGuess(round: BombRound, value: number | null): GuessCheck {
  if (round.exploded) return 'finished';
  if (value === null || !Number.isInteger(value)) return 'empty';
  return value > round.low && value < round.high ? 'ok' : 'out-of-range';
}

export function applyGuess(round: BombRound, value: number, player: string | null): BombRound {
  if (checkGuess(round, value) !== 'ok') return round;
  if (value === round.secret) return { ...round, exploded: true, guesses: [...round.guesses, { value, player, outcome: 'boom' }] };
  const below = value < round.secret;
  return {
    ...round,
    low: below ? value : round.low,
    high: below ? round.high : value,
    guesses: [...round.guesses, { value, player, outcome: below ? 'below' : 'above' }],
  };
}
