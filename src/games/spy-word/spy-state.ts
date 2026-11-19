// Trạng thái ván Gián Điệp dạng reducer thuần: chia vai, lần lượt xem từ, thảo luận, bỏ phiếu loại và xác định phe thắng; mọi giá trị ngẫu nhiên được truyền qua action
import type { WordPair } from '@/data';

export type SpyPhase = 'setup' | 'reveal' | 'discuss' | 'vote' | 'finished';
export type SpyWinner = 'civilians' | 'spies';

export interface SpyPlayer {
  name: string;
  spy: boolean;
  alive: boolean;
}

export interface SpyState {
  phase: SpyPhase;
  players: SpyPlayer[];
  pair: WordPair | null;
  revealIndex: number;
  revealed: boolean;
  order: number[];
  round: number;
  discussSeconds: number;
  roundId: number;
  lastEliminated: number | null;
  winner: SpyWinner | null;
}

export type SpyAction =
  | { type: 'start'; names: string[]; spyIndexes: number[]; pair: WordPair; order: number[]; discussSeconds: number }
  | { type: 'flip' }
  | { type: 'hide' }
  | { type: 'startVote' }
  | { type: 'backToDiscuss' }
  | { type: 'eliminate'; index: number; nextOrder: number[] }
  | { type: 'exit' };

export const initialSpyState: SpyState = {
  phase: 'setup',
  players: [],
  pair: null,
  revealIndex: 0,
  revealed: false,
  order: [],
  round: 0,
  discussSeconds: 90,
  roundId: 0,
  lastEliminated: null,
  winner: null,
};

export function wordFor(player: SpyPlayer, pair: WordPair) {
  return player.spy ? pair.spy : pair.civilian;
}

export function aliveCounts(players: SpyPlayer[]) {
  const alive = players.filter((player) => player.alive);
  const spies = alive.filter((player) => player.spy).length;
  return { spies, civilians: alive.length - spies };
}

export function decideWinner(players: SpyPlayer[]): SpyWinner | null {
  const { spies, civilians } = aliveCounts(players);
  if (spies === 0) return 'civilians';
  if (spies >= civilians) return 'spies';
  return null;
}

export function spyReducer(state: SpyState, action: SpyAction): SpyState {
  switch (action.type) {
    case 'start':
      return {
        ...initialSpyState,
        phase: 'reveal',
        players: action.names.map((name, index) => ({ name, spy: action.spyIndexes.includes(index), alive: true })),
        pair: action.pair,
        order: action.order,
        round: 1,
        discussSeconds: action.discussSeconds,
        roundId: state.roundId + 1,
      };

    case 'flip':
      return state.phase === 'reveal' ? { ...state, revealed: true } : state;

    case 'hide': {
      if (state.phase !== 'reveal' || !state.revealed) return state;
      const next = state.revealIndex + 1;
      if (next >= state.players.length) return { ...state, revealed: false, phase: 'discuss', roundId: state.roundId + 1 };
      return { ...state, revealed: false, revealIndex: next };
    }

    case 'startVote':
      return state.phase === 'discuss' ? { ...state, phase: 'vote' } : state;

    case 'backToDiscuss':
      return state.phase === 'vote' ? { ...state, phase: 'discuss', roundId: state.roundId + 1 } : state;

    case 'eliminate': {
      const target = state.players[action.index];
      if (state.phase !== 'vote' || !target?.alive) return state;
      const players = state.players.map((player, index) => (index === action.index ? { ...player, alive: false } : player));
      const winner = decideWinner(players);
      if (winner) return { ...state, players, winner, phase: 'finished', lastEliminated: action.index };
      return {
        ...state,
        players,
        phase: 'discuss',
        order: action.nextOrder.filter((index) => players[index].alive),
        round: state.round + 1,
        roundId: state.roundId + 1,
        lastEliminated: action.index,
      };
    }

    case 'exit':
      return { ...initialSpyState, roundId: state.roundId + 1 };
  }
}
