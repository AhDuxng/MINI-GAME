// Luật chia lì xì thuần: chia đúng tổng ngân sách thành các bao ngẫu nhiên theo bước 1.000đ, trộn thêm bao vui và câu chúc
import { LUCKY_FUN_PRIZES, LUCKY_WISHES } from '@/data';
import { randomInt, shuffle } from '@/shared/lib/random';
import { formatCurrency } from '@/shared/lib/utils';

export const AMOUNT_STEP = 1000;
export const FUN_RATIO = 0.2;

export interface EnvelopePrize {
  amount: number;
  label?: string;
  extraTurn?: boolean;
}

export interface Envelope {
  id: number;
  prize: EnvelopePrize;
  wish: string;
  openedBy: string | null;
  opened: boolean;
}

export interface BoardSettings {
  size: number;
  budget: number;
  withFun: boolean;
}

export function funCount(settings: Pick<BoardSettings, 'size' | 'withFun'>) {
  return settings.withFun ? Math.round(settings.size * FUN_RATIO) : 0;
}

export function minBudget(settings: Pick<BoardSettings, 'size' | 'withFun'>) {
  return (settings.size - funCount(settings)) * AMOUNT_STEP;
}

export function splitBudget(total: number, count: number) {
  const units = Math.floor(total / AMOUNT_STEP);
  if (count <= 0 || units < count) return [];
  const spare = units - count;
  const cuts = Array.from({ length: count - 1 }, () => randomInt(spare + 1)).sort((a, b) => a - b);
  const edges = [0, ...cuts, spare];
  return edges.slice(1).map((edge, index) => (edge - edges[index] + 1) * AMOUNT_STEP);
}

export function buildEnvelopes(settings: BoardSettings): Envelope[] {
  const funTotal = funCount(settings);
  const budget = Math.max(settings.budget, minBudget(settings));
  const money: EnvelopePrize[] = splitBudget(budget, settings.size - funTotal).map((amount) => ({ amount }));
  const funPool = shuffle(LUCKY_FUN_PRIZES);
  const fun: EnvelopePrize[] = Array.from({ length: funTotal }, (_, index) => ({ amount: 0, ...funPool[index % funPool.length] }));
  const wishes = shuffle(LUCKY_WISHES);

  return shuffle([...money, ...fun]).map((prize, id) => ({
    id,
    prize,
    wish: wishes[id % wishes.length],
    openedBy: null,
    opened: false,
  }));
}

export function prizeLabel(prize: EnvelopePrize) {
  return prize.amount > 0 ? formatCurrency(prize.amount) : prize.label ?? '';
}
