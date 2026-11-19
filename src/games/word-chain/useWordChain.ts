// Điều khiển ván nối từ: đồng hồ đếm ngược mỗi lượt, kiểm tra từ, loại người hết giờ, chịu thua hoặc bị cả bàn bác bỏ từ
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import { CHAIN_SEEDS, PUNISHMENTS, WORD_TOPICS } from '@/data';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { pickRandom } from '@/shared/lib/random';
import { initialWordChainState, wordChainReducer, type EliminationReason } from './word-chain-state';
import { validateWord, type WordMode } from './word-rules';

const TIMER_INTERVAL_MS = 100;
const WARNING_SECONDS = 3;

export const TURN_SECONDS_OPTIONS = [10, 15, 20, 30];

interface Settings {
  mode: WordMode;
  turnSeconds: number;
}

export default function useWordChain(players: string[]) {
  const { play } = useSound();
  const [settings, setSettings] = useLocalStorage<Settings>('word-chain:settings', { mode: 'chain', turnSeconds: 15 });
  const [state, dispatch] = useReducer(wordChainReducer, initialWordChainState);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const timeLeftRef = useRef(0);

  const currentWord = state.mode === 'chain' ? state.words[state.words.length - 1]?.word ?? null : null;
  const currentPlayer = state.phase === 'playing' ? state.roster[state.alive[state.turn]] : null;
  const winner = state.phase === 'finished' ? state.roster[state.alive[0]] : null;

  const start = useCallback(() => {
    if (players.length < 2) return;
    const prompt = settings.mode === 'chain' ? pickRandom(CHAIN_SEEDS) : pickRandom(WORD_TOPICS);
    dispatch({ type: 'start', roster: players, mode: settings.mode, turnSeconds: settings.turnSeconds, prompt });
    play('start');
  }, [players, settings, play]);

  const submit = useCallback(
    (input: string) => {
      const used = state.words.map((entry) => entry.word);
      const result = validateWord(input, state.mode, currentWord, used);
      if (!result.ok) {
        dispatch({ type: 'reject', reason: result.reason });
        return false;
      }
      dispatch({ type: 'accept', word: result.word });
      play('pop');
      return true;
    },
    [state.words, state.mode, currentWord, play],
  );

  const eliminate = useCallback(
    (reason: EliminationReason) => {
      play(state.alive.length <= 2 ? 'success' : 'fail');
      dispatch({ type: 'eliminate', reason, punishment: pickRandom(PUNISHMENTS) });
    },
    [state.alive.length, play],
  );

  const surrender = useCallback(() => eliminate('surrender'), [eliminate]);
  const veto = useCallback(() => {
    play(state.alive.length <= 2 ? 'success' : 'fail');
    dispatch({ type: 'veto', punishment: pickRandom(PUNISHMENTS) });
  }, [state.alive.length, play]);
  const togglePause = useCallback(() => dispatch({ type: 'togglePause' }), []);
  const exit = useCallback(() => dispatch({ type: 'exit' }), []);

  const eliminateRef = useRef(eliminate);
  useEffect(() => {
    eliminateRef.current = eliminate;
  }, [eliminate]);

  useEffect(() => {
    timeLeftRef.current = state.turnSeconds * 1000;
    setTimeLeftMs(timeLeftRef.current);
  }, [state.turnId, state.turnSeconds]);

  useEffect(() => {
    if (state.phase !== 'playing' || state.paused) return;

    const deadline = Date.now() + timeLeftRef.current;
    let lastSecond = Math.ceil(timeLeftRef.current / 1000);

    const timer = setInterval(() => {
      const remaining = Math.max(0, deadline - Date.now());
      const second = Math.ceil(remaining / 1000);
      timeLeftRef.current = remaining;
      setTimeLeftMs(remaining);

      if (second !== lastSecond && second > 0 && second <= WARNING_SECONDS) play('tick');
      lastSecond = second;

      if (remaining === 0) {
        clearInterval(timer);
        eliminateRef.current('timeout');
      }
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [state.phase, state.paused, state.turnId, play]);

  return {
    state,
    settings,
    setSettings,
    currentWord,
    currentPlayer,
    winner,
    timeLeftMs,
    start,
    submit,
    surrender,
    veto,
    togglePause,
    exit,
  };
}
