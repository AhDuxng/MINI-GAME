// Điều khiển Đoán Trên Trán: chọn chủ đề (Gen Z, Bàn nhậu chỉ cho VIP) và thời gian, đếm ngược rồi lần lượt hiện từ chưa dùng, ghi đúng hoặc bỏ qua kèm chớp màu, hết giờ thì cộng điểm cho người đoán và chuyền lượt
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import { useVipAccess } from '@/features/billing';
import { FOREHEAD_DECKS, type WordDeck } from '@/data';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { shuffle } from '@/shared/lib/random';
import { requestTiltPermission } from './useTiltGesture';

export type ForeheadPhase = 'setup' | 'countdown' | 'playing' | 'summary';
export type Flash = 'correct' | 'pass' | null;

export interface GuessResult {
  word: string;
  correct: boolean;
}

const COUNT_FROM = 3;
const FLASH_MS = 650;
const CLOCK_MS = 200;

export default function useForehead(players: string[]) {
  const { play } = useSound();
  const { isVip, requireVip } = useVipAccess('forehead');
  const [deckId, setDeckId] = useLocalStorage('forehead:deck', FOREHEAD_DECKS[0].id);
  const [duration, setDuration] = useLocalStorage('forehead:duration', 60);
  const [tiltWanted, setTiltWanted] = useLocalStorage('forehead:tilt', true);
  const [phase, setPhase] = useState<ForeheadPhase>('setup');
  const [count, setCount] = useState(COUNT_FROM);
  const [word, setWord] = useState('');
  const [results, setResults] = useState<GuessResult[]>([]);
  const [remaining, setRemaining] = useState(duration);
  const [flash, setFlash] = useState<Flash>(null);
  const [turn, setTurn] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [tiltReady, setTiltReady] = useState(false);

  const queue = useRef<Record<string, string[]>>({});
  const timers = useRef<number[]>([]);
  const clock = useRef<number>();
  const deadline = useRef(0);
  const busy = useRef(false);
  const starting = useRef(false);
  const resultsRef = useRef<GuessResult[]>([]);

  const deck: WordDeck = FOREHEAD_DECKS.find((item) => item.id === deckId) ?? FOREHEAD_DECKS[0];
  const guesser = players.length > 0 ? players[turn % players.length] : null;

  const clearAll = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    window.clearInterval(clock.current);
    starting.current = false;
  }, []);

  useEffect(() => clearAll, [clearAll]);

  const drawWord = useCallback((source: WordDeck) => {
    let pile = queue.current[source.id] ?? [];
    if (pile.length === 0) pile = shuffle(source.words);
    const [next, ...rest] = pile;
    queue.current[source.id] = rest;
    return next;
  }, []);

  const finish = useCallback(() => {
    clearAll();
    busy.current = false;
    setFlash(null);
    setPhase('summary');
    const points = resultsRef.current.filter((result) => result.correct).length;
    if (guesser) setScores((table) => ({ ...table, [guesser]: (table[guesser] ?? 0) + points }));
    play('success');
  }, [clearAll, guesser, play]);

  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  const chooseDeck = useCallback(
    (id: string) => {
      const target = FOREHEAD_DECKS.find((item) => item.id === id);
      if (!target || (target.vip && !requireVip(`Chủ đề "${target.name}"`))) return;
      setDeckId(id);
    },
    [requireVip, setDeckId],
  );

  const start = useCallback(async () => {
    if (starting.current || (deck.vip && !requireVip(`Chủ đề "${deck.name}"`))) return;
    starting.current = true;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    window.clearInterval(clock.current);
    setTiltReady(tiltWanted ? await requestTiltPermission() : false);
    resultsRef.current = [];
    setResults([]);
    setFlash(null);
    setRemaining(duration);
    setPhase('countdown');
    setCount(COUNT_FROM);
    play('tick');
    for (let step = 1; step <= COUNT_FROM; step++) {
      timers.current.push(
        window.setTimeout(() => {
          const value = COUNT_FROM - step;
          if (value > 0) {
            setCount(value);
            play('tick');
            return;
          }
          starting.current = false;
          setWord(drawWord(deck));
          setPhase('playing');
          play('start');
          deadline.current = Date.now() + duration * 1000;
          clock.current = window.setInterval(() => {
            const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
            setRemaining(left);
            if (left <= 0) finishRef.current();
          }, CLOCK_MS);
        }, step * 850),
      );
    }
  }, [deck, requireVip, tiltWanted, duration, play, drawWord]);

  const mark = useCallback(
    (correct: boolean) => {
      if (phase !== 'playing' || busy.current) return;
      busy.current = true;
      resultsRef.current = [...resultsRef.current, { word, correct }];
      setResults(resultsRef.current);
      setFlash(correct ? 'correct' : 'pass');
      play(correct ? 'pop' : 'tick');
      timers.current.push(
        window.setTimeout(() => {
          busy.current = false;
          setFlash(null);
          setWord(drawWord(deck));
        }, FLASH_MS),
      );
    },
    [phase, word, play, drawWord, deck],
  );

  const stop = useCallback(() => {
    if (phase === 'playing') finish();
    else {
      clearAll();
      setPhase('setup');
    }
  }, [phase, finish, clearAll]);

  const nextTurn = useCallback(() => {
    setTurn((value) => value + 1);
    setPhase('setup');
  }, []);

  const close = useCallback(() => setPhase('setup'), []);
  const resetScores = useCallback(() => setScores({}), []);

  return {
    deck,
    deckId,
    chooseDeck,
    duration,
    setDuration,
    tiltWanted,
    setTiltWanted,
    tiltReady,
    isVip,
    phase,
    count,
    word,
    results,
    remaining,
    flash,
    guesser,
    nextGuesser: players.length > 0 ? players[(turn + 1) % players.length] : null,
    scores,
    start,
    mark,
    stop,
    nextTurn,
    close,
    resetScores,
  };
}
