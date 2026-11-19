// Bộ bài theo mức độ: lọc lá theo mức được phép, rút hết mới xáo lại và không để lá vừa rút xuất hiện lại ngay đầu bộ mới
import { shuffle } from '@/shared/lib/random';

export const ALL_LEVELS = 0;

export interface LeveledCard {
  id: string;
  level: number;
}

export function cardsForLevel<T extends LeveledCard>(cards: T[], level: number, maxLevel: number) {
  return cards.filter((card) => (level === ALL_LEVELS ? card.level <= maxLevel : card.level === level));
}

export function drawCard<T extends LeveledCard>(deck: T[], source: T[], lastId: string | null) {
  let pile = deck.length > 0 ? deck : shuffle(source);
  if (deck.length === 0 && pile.length > 1 && pile[0].id === lastId) pile = [...pile.slice(1), pile[0]];
  const [card, ...rest] = pile;
  return { card, rest };
}
