// Điều khiển ván Gián Điệp: thiết lập lưu bền, chia vai ngẫu nhiên, đồng hồ thảo luận theo hạn chót và âm thanh từng bước
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { SPY_WORD_PAIRS } from '@/data';
import { useVipAccess } from '@/features/billing';
import { randomInt, shuffle } from '@/shared/lib/random';
import { initialSpyState, spyReducer } from './spy-state';

export const MIN_PLAYERS = 4;
export const TWO_SPIES_MIN_PLAYERS = 7;
export const DISCUSS_OPTIONS = [60, 90, 120];

export type SpyCountSetting = 'auto' | 1 | 2;

interface Settings {
  spyCount: SpyCountSetting;
  discussSeconds: number;
}

const TIMER_INTERVAL_MS = 200;
const WARNING_SECONDS = 5;

export function effectiveSpyCount(setting: SpyCountSetting, playerCount: number) {
  if (playerCount < TWO_SPIES_MIN_PLAYERS) return 1;
  return setting === 1 ? 1 : 2;
}

export default function useSpyWord(players: string[]) {
  const { play } = useSound();
  const { requestRound } = useVipAccess('spy-word');
  const [settings, setSettings] = useLocalStorage<Settings>('spy-word:settings', { spyCount: 'auto', discussSeconds: 90 });
  const [state, dispatch] = useReducer(spyReducer, initialSpyState);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const lastPairIndex = useRef(-1);

  const spyCount = effectiveSpyCount(settings.spyCount, players.length);
  const canStart = players.length >= MIN_PLAYERS;

  const start = useCallback(() => {
    if (players.length < MIN_PLAYERS || !requestRound()) return;
    let pairIndex = randomInt(SPY_WORD_PAIRS.length);
    if (pairIndex === lastPairIndex.current) pairIndex = (pairIndex + 1) % SPY_WORD_PAIRS.length;
    lastPairIndex.current = pairIndex;
    const indexes = players.map((_, index) => index);
    dispatch({
      type: 'start',
      names: players,
      spyIndexes: shuffle(indexes).slice(0, spyCount),
      pair: SPY_WORD_PAIRS[pairIndex],
      order: shuffle(indexes),
      discussSeconds: settings.discussSeconds,
    });
    play('start');
  }, [players, requestRound, spyCount, settings.discussSeconds, play]);

  const flip = useCallback(() => {
    dispatch({ type: 'flip' });
    play('pop');
  }, [play]);

  const hide = useCallback(() => dispatch({ type: 'hide' }), []);
  const startVote = useCallback(() => dispatch({ type: 'startVote' }), []);
  const backToDiscuss = useCallback(() => dispatch({ type: 'backToDiscuss' }), []);
  const exit = useCallback(() => dispatch({ type: 'exit' }), []);

  const eliminate = useCallback(
    (index: number) => {
      const target = state.players[index];
      if (!target) return;
      const remaining = state.players.map((_, position) => position).filter((position) => position !== index && state.players[position].alive);
      dispatch({ type: 'eliminate', index, nextOrder: shuffle(remaining) });
      play(target.spy ? 'success' : 'fail');
    },
    [state.players, play],
  );

  useEffect(() => {
    if (state.phase !== 'discuss') return;
    const deadline = Date.now() + state.discussSeconds * 1000;
    let lastSecond = state.discussSeconds;
    setTimeLeftMs(state.discussSeconds * 1000);

    const timer = setInterval(() => {
      const remaining = Math.max(0, deadline - Date.now());
      const second = Math.ceil(remaining / 1000);
      setTimeLeftMs(remaining);
      if (second !== lastSecond && second > 0 && second <= WARNING_SECONDS) play('tick');
      lastSecond = second;
      if (remaining === 0) {
        clearInterval(timer);
        play('start');
        dispatch({ type: 'startVote' });
      }
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [state.phase, state.roundId, state.discussSeconds, play]);

  return {
    state,
    settings,
    setSettings,
    spyCount,
    canStart,
    timeLeftMs,
    start,
    flip,
    hide,
    startVote,
    backToDiscuss,
    eliminate,
    exit,
  };
}
