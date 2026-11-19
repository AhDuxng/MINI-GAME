// Điều khiển Vẽ Nhanh Đoán Lẹ: chọn bộ từ (Thành ngữ chỉ cho VIP) và thời gian, người vẽ xem lén từ khoá, đồng hồ đếm ngược khi vẽ, ai đoán đúng thì người vẽ và người đoán cùng được điểm, hết giờ thì lộ đáp án
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import { useVipAccess } from '@/features/billing';
import { DRAW_DECKS, type WordDeck } from '@/data';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { shuffle } from '@/shared/lib/random';

export type DrawPhase = 'idle' | 'ready' | 'drawing' | 'reveal';

const CLOCK_MS = 250;

export default function useDrawGuess(players: string[]) {
  const { play } = useSound();
  const { isVip, requireVip } = useVipAccess('draw-guess');
  const [deckId, setDeckId] = useLocalStorage('draw-guess:deck', DRAW_DECKS[0].id);
  const [duration, setDuration] = useLocalStorage('draw-guess:duration', 60);
  const [phase, setPhase] = useState<DrawPhase>('idle');
  const [word, setWord] = useState('');
  const [remaining, setRemaining] = useState(duration);
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(0);
  const [guessedBy, setGuessedBy] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});

  const queue = useRef<Record<string, string[]>>({});
  const clock = useRef<number>();
  const deadline = useRef(0);
  const timeUpRef = useRef<() => void>(() => undefined);

  const deck: WordDeck = DRAW_DECKS.find((item) => item.id === deckId) ?? DRAW_DECKS[0];
  const drawer = players.length > 0 ? players[turn % players.length] : null;

  const stopClock = useCallback(() => window.clearInterval(clock.current), []);

  useEffect(() => stopClock, [stopClock]);

  const chooseDeck = useCallback(
    (id: string) => {
      const target = DRAW_DECKS.find((item) => item.id === id);
      if (!target || (target.vip && !requireVip(`Bộ từ "${target.name}"`))) return;
      setDeckId(id);
    },
    [requireVip, setDeckId],
  );

  const newTurn = useCallback(() => {
    if (deck.vip && !requireVip(`Bộ từ "${deck.name}"`)) return;
    stopClock();
    let pile = queue.current[deck.id] ?? [];
    if (pile.length === 0) pile = shuffle(deck.words);
    const [next, ...rest] = pile;
    queue.current[deck.id] = rest;
    setWord(next);
    setGuessedBy(null);
    setSolved(false);
    setRemaining(duration);
    setRound((value) => value + 1);
    setPhase('ready');
    play('pop');
  }, [deck, requireVip, stopClock, duration, play]);

  const startDrawing = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('drawing');
    play('start');
    deadline.current = Date.now() + duration * 1000;
    clock.current = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) timeUpRef.current();
    }, CLOCK_MS);
  }, [phase, duration, play]);

  const timeUp = useCallback(() => {
    stopClock();
    setPhase('reveal');
    setSolved(false);
    play('fail');
  }, [stopClock, play]);

  useEffect(() => {
    timeUpRef.current = timeUp;
  }, [timeUp]);

  const markGuessed = useCallback(
    (guesser: string | null) => {
      if (phase !== 'drawing') return;
      stopClock();
      setPhase('reveal');
      setSolved(true);
      setGuessedBy(guesser);
      setScores((table) => {
        const next = { ...table };
        if (drawer) next[drawer] = (next[drawer] ?? 0) + 1;
        if (guesser && guesser !== drawer) next[guesser] = (next[guesser] ?? 0) + 1;
        return next;
      });
      play('success');
    },
    [phase, stopClock, drawer, play],
  );

  const nextDrawer = useCallback(() => {
    setTurn((value) => value + 1);
    setPhase('idle');
  }, []);

  const resetScores = useCallback(() => setScores({}), []);

  return {
    deck,
    deckId,
    chooseDeck,
    duration,
    setDuration,
    isVip,
    phase,
    word,
    remaining,
    round,
    drawer,
    nextDrawerName: players.length > 0 ? players[(turn + 1) % players.length] : null,
    guessedBy,
    solved,
    scores,
    newTurn,
    startDrawing,
    markGuessed,
    giveUp: timeUp,
    nextDrawer,
    resetScores,
  };
}
