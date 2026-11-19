// Điều khiển Bom Số: nhập số bằng bàn phím số, kiểm tra khoảng an toàn, xoay vòng lượt đoán, chốt người dính bom và đếm số lần nổ của từng người
import { useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { applyGuess, checkGuess, createRound, safeMax, safeMin, type BombRound, type RangeMax } from './number-bomb-rules';

const SHAKE = { x: [0, -16, 14, -11, 8, -5, 2, 0], rotate: [0, -1.5, 1.2, -0.8, 0.5, 0, 0, 0] };
const FALLBACK_LOSER = 'Người cầm máy';

const REVEAL_DELAY_MS = 650;

export default function useNumberBomb(players: string[]) {
  const { play } = useSound();
  const shake = useAnimationControls();
  const [max, setMax] = useLocalStorage<RangeMax>('number-bomb:max', 100);
  const [round, setRound] = useState<BombRound>(() => createRound(max));
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [turn, setTurn] = useState(0);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [resultOpen, setResultOpen] = useState(false);
  const [loser, setLoser] = useState<string | null>(null);

  const revealTimer = useRef<number>();
  const currentPlayer = players.length > 0 ? players[turn % players.length] : null;

  useEffect(() => () => window.clearTimeout(revealTimer.current), []);
  const digits = String(round.max).length;

  useEffect(() => {
    setRound((current) => (current.max === max || current.guesses.length > 0 ? current : createRound(max)));
  }, [max]);

  const pressDigit = useCallback(
    (digit: number) => {
      if (round.exploded) return;
      setError(null);
      setInput((current) => (current.length >= digits ? current : current === '0' ? String(digit) : current + digit));
      play('tick');
    },
    [round.exploded, digits, play],
  );

  const backspace = useCallback(() => {
    setError(null);
    setInput((current) => current.slice(0, -1));
  }, []);

  const clear = useCallback(() => {
    setError(null);
    setInput('');
  }, []);

  const submit = useCallback(() => {
    const value = input === '' ? null : Number(input);
    const check = checkGuess(round, value);
    if (check === 'finished') return;
    if (check !== 'ok' || value === null) {
      setError(check === 'empty' ? 'Nhập một con số trước đã.' : `Chỉ được đoán từ ${safeMin(round)} đến ${safeMax(round)}.`);
      shake.start({ x: [0, -8, 8, -4, 0], transition: { duration: 0.3 } });
      return;
    }

    const next = applyGuess(round, value, currentPlayer);
    setRound(next);
    setInput('');
    setError(null);

    if (next.exploded) {
      const name = currentPlayer ?? FALLBACK_LOSER;
      setLoser(name);
      setTally((current) => ({ ...current, [name]: (current[name] ?? 0) + 1 }));
      play('fail');
      shake.start({ ...SHAKE, transition: { duration: 0.7 } });
      window.clearTimeout(revealTimer.current);
      revealTimer.current = window.setTimeout(() => setResultOpen(true), REVEAL_DELAY_MS);
      return;
    }

    play('pop');
    setTurn((current) => current + 1);
  }, [input, round, currentPlayer, play, shake]);

  const newRound = useCallback(() => {
    window.clearTimeout(revealTimer.current);
    setRound(createRound(max));
    setInput('');
    setError(null);
    setResultOpen(false);
    setLoser(null);
    play('start');
  }, [max, play]);

  const changeMax = useCallback(
    (value: RangeMax) => {
      setMax(value);
      setRound(createRound(value));
      setInput('');
      setError(null);
    },
    [setMax],
  );

  const resetTally = useCallback(() => setTally({}), []);
  const closeResult = useCallback(() => setResultOpen(false), []);

  return {
    max,
    round,
    input,
    error,
    currentPlayer,
    tally,
    loser,
    resultOpen,
    shake,
    pressDigit,
    backspace,
    clear,
    submit,
    newRound,
    changeMax,
    resetTally,
    closeResult,
  };
}
