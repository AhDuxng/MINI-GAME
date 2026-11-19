// Điểm truy cập duy nhất tới dữ liệu JSON tĩnh, gắn kiểu để các game không import file thô
import bombTopics from './bomb-topics.json';
import cardRules from './card-rules.json';
import dareCards from './dare.json';
import diceFaces from './dice-faces.json';
import dilemmas from './dilemmas.json';
import drawWords from './draw-words.json';
import duckNames from './duck-names.json';
import foreheadDecks from './forehead-decks.json';
import luckyMoney from './lucky-money.json';
import mostLikely from './most-likely.json';
import neverHaveI from './never-have-i.json';
import punishments from './punishments.json';
import spyWords from './spy-words.json';
import themes from './themes.json';
import truthCards from './truth.json';
import wordTopics from './word-topics.json';

export interface DiceFace {
  id: number;
  label: string;
  description: string;
  icon: string;
  ramp: number;
}

export type CardLevel = 1 | 2 | 3;
export const HOT_LEVEL: CardLevel = 3;
export const LEVEL_LABELS: Record<CardLevel, string> = { 1: 'Nhẹ nhàng', 2: 'Sôi động', 3: 'Cháy' };

export interface PromptCard {
  id: string;
  level: number;
  text: string;
}

export interface FunPrize {
  label: string;
  extraTurn?: boolean;
}

export interface WordPair {
  civilian: string;
  spy: string;
}

export interface CardRule {
  rank: string;
  title: string;
  rule: string;
}

export interface WordDeck {
  id: string;
  name: string;
  vip: boolean;
  words: string[];
}

export interface Dilemma {
  id: string;
  level: number;
  a: string;
  b: string;
}

export interface WheelTheme {
  id: string;
  name: string;
  stops: number[];
}

export const DICE_FACES: DiceFace[] = diceFaces;
export const TRUTH_CARDS: PromptCard[] = truthCards;
export const DARE_CARDS: PromptCard[] = dareCards;
export const NEVER_CARDS: PromptCard[] = neverHaveI;
export const PUNISHMENTS: string[] = punishments;
export const DUCK_NAMES: string[] = duckNames;
export const WHEEL_THEMES: WheelTheme[] = themes;
export const CHAIN_SEEDS: string[] = wordTopics.chainSeeds;
export const WORD_TOPICS: string[] = wordTopics.topics;
export const LUCKY_FUN_PRIZES: FunPrize[] = luckyMoney.funPrizes;
export const LUCKY_WISHES: string[] = luckyMoney.wishes;
export const SPY_WORD_PAIRS: WordPair[] = spyWords;
export const BOMB_TOPICS: string[] = bombTopics;
export const CARD_RULES: CardRule[] = cardRules;
export const MOST_LIKELY_CARDS: PromptCard[] = mostLikely;
export const FOREHEAD_DECKS: WordDeck[] = foreheadDecks;
export const DRAW_DECKS: WordDeck[] = drawWords;
export const DILEMMAS: Dilemma[] = dilemmas;
