// Trạng thái ván nối từ dạng reducer thuần (nhận từ, loại người, bác bỏ từ vô nghĩa, tạm dừng); giá trị ngẫu nhiên truyền qua action để reducer luôn tất định
import type { WordMode } from './word-rules';

export type WordChainPhase = 'setup' | 'playing' | 'finished';
export type EliminationReason = 'timeout' | 'surrender' | 'veto';

export interface PlayedWord {
  word: string;
  player: string | null;
}

export interface Elimination {
  player: string;
  punishment: string;
  reason: EliminationReason;
}

export interface WordChainState {
  phase: WordChainPhase;
  mode: WordMode;
  turnSeconds: number;
  roster: string[];
  alive: number[];
  turn: number;
  turnId: number;
  prompt: string;
  words: PlayedWord[];
  paused: boolean;
  error: { message: string; id: number } | null;
  eliminations: Elimination[];
}

export type WordChainAction =
  | { type: 'start'; roster: string[]; mode: WordMode; prompt: string; turnSeconds: number }
  | { type: 'accept'; word: string }
  | { type: 'reject'; reason: string }
  | { type: 'eliminate'; reason: EliminationReason; punishment: string }
  | { type: 'veto'; punishment: string }
  | { type: 'togglePause' }
  | { type: 'exit' };

export const initialWordChainState: WordChainState = {
  phase: 'setup',
  mode: 'chain',
  turnSeconds: 15,
  roster: [],
  alive: [],
  turn: 0,
  turnId: 0,
  prompt: '',
  words: [],
  paused: false,
  error: null,
  eliminations: [],
};

export function wordChainReducer(state: WordChainState, action: WordChainAction): WordChainState {
  switch (action.type) {
    case 'start':
      return {
        ...initialWordChainState,
        phase: 'playing',
        mode: action.mode,
        turnSeconds: action.turnSeconds,
        roster: action.roster,
        alive: action.roster.map((_, index) => index),
        prompt: action.prompt,
        words: action.mode === 'chain' ? [{ word: action.prompt, player: null }] : [],
        turnId: state.turnId + 1,
      };

    case 'accept':
      return {
        ...state,
        words: [...state.words, { word: action.word, player: state.roster[state.alive[state.turn]] }],
        turn: (state.turn + 1) % state.alive.length,
        turnId: state.turnId + 1,
        error: null,
      };

    case 'reject':
      return { ...state, error: { message: action.reason, id: (state.error?.id ?? 0) + 1 } };

    case 'eliminate': {
      const elimination = {
        player: state.roster[state.alive[state.turn]],
        punishment: action.punishment,
        reason: action.reason,
      };
      const alive = state.alive.filter((_, index) => index !== state.turn);
      const eliminations = [...state.eliminations, elimination];

      if (alive.length <= 1) {
        return { ...state, alive, eliminations, phase: 'finished', paused: false, error: null };
      }
      return {
        ...state,
        alive,
        eliminations,
        turn: state.turn % alive.length,
        turnId: state.turnId + 1,
        paused: false,
        error: null,
      };
    }

    case 'veto': {
      const last = state.words[state.words.length - 1];
      if (state.phase !== 'playing' || !last || last.player === null) return state;
      const words = state.words.slice(0, -1);
      const author = state.roster.indexOf(last.player);
      if (!state.alive.includes(author)) return { ...state, words, turnId: state.turnId + 1, error: null };

      const holder = state.alive[state.turn];
      const alive = state.alive.filter((index) => index !== author);
      const eliminations = [...state.eliminations, { player: last.player, punishment: action.punishment, reason: 'veto' as const }];
      if (alive.length <= 1) {
        return { ...state, words, alive, eliminations, phase: 'finished', paused: false, error: null };
      }
      return {
        ...state,
        words,
        alive,
        eliminations,
        turn: Math.max(0, alive.indexOf(holder)),
        turnId: state.turnId + 1,
        paused: false,
        error: null,
      };
    }

    case 'togglePause':
      return { ...state, paused: !state.paused };

    case 'exit':
      return { ...initialWordChainState, turnId: state.turnId };
  }
}
