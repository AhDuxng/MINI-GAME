// Bộ bài 52 lá cho Luật Bài: tạo và xáo bộ bài, tra chất đỏ hay đen, tra luật theo lá và nhận biết lá K thứ tư phải cạn ly chung
import { CARD_RULES, type CardRule } from '@/data';
import { shuffle } from '@/shared/lib/random';

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
export type Rank = (typeof RANKS)[number];

export type SuitId = 'spade' | 'heart' | 'diamond' | 'club';

export const SUITS: { id: SuitId; symbol: string; name: string; red: boolean }[] = [
  { id: 'spade', symbol: '♠', name: 'Bích', red: false },
  { id: 'heart', symbol: '♥', name: 'Cơ', red: true },
  { id: 'diamond', symbol: '♦', name: 'Rô', red: true },
  { id: 'club', symbol: '♣', name: 'Chuồn', red: false },
];

export const KING_RANK: Rank = 'K';
export const KING_LIMIT = 4;
export const DECK_SIZE = RANKS.length * SUITS.length;

export interface PlayingCard {
  id: string;
  rank: Rank;
  suit: SuitId;
}

export function buildDeck(): PlayingCard[] {
  return SUITS.flatMap((suit) => RANKS.map((rank) => ({ id: `${rank}-${suit.id}`, rank, suit: suit.id })));
}

export function shuffledDeck() {
  return shuffle(buildDeck());
}

export function suitOf(id: SuitId) {
  return SUITS.find((suit) => suit.id === id) ?? SUITS[0];
}

export function ruleFor(rank: Rank): CardRule {
  return CARD_RULES.find((rule) => rule.rank === rank) ?? { rank, title: rank, rule: '' };
}

export function isFinalKing(card: PlayingCard, kingsBefore: number) {
  return card.rank === KING_RANK && kingsBefore + 1 === KING_LIMIT;
}
