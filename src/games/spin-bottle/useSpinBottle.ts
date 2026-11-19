// Điều khiển Xoay Chai: xếp người quanh bàn (bàn trên 10 người là quyền VIP), xoay chai tới người được chọn ngẫu nhiên, cho người đó chọn Thật, Thách hoặc uống và đếm số lần bị chỉ
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import { DARE_CARDS, HOT_LEVEL, TRUTH_CARDS, type PromptCard } from '@/data';
import { ALL_LEVELS, cardsForLevel, drawCard } from '@/games/kit';
import { FREE_LIMITS, VIP_LIMITS, useVipAccess } from '@/features/billing';
import { randomInt } from '@/shared/lib/random';
import { DEFAULT_SEATS, MIN_TURNS, pickTarget, spinTarget } from './spin-rules';

export type ChoiceKind = 'truth' | 'dare' | 'drink';
export type Choice = { kind: 'truth' | 'dare'; card: PromptCard } | { kind: 'drink' };

export interface SeatStat {
  picked: number;
  drinks: number;
}

export interface SpinTurn {
  id: number;
  name: string;
  kind: ChoiceKind | null;
}

const FREE_MAX_LEVEL = HOT_LEVEL - 1;
const REST_ANGLE = 40;
const HISTORY_SIZE = 8;
const SOURCES = { truth: TRUTH_CARDS, dare: DARE_CARDS };

export default function useSpinBottle(players: string[]) {
  const { play } = useSound();
  const { isVip, requireVip } = useVipAccess('spin-bottle');
  const maxSeats = isVip ? VIP_LIMITS.bottleSeats : FREE_LIMITS.bottleSeats;
  const usingDefaults = players.length < 2;
  const seats = useMemo(() => (usingDefaults ? DEFAULT_SEATS : players.slice(0, maxSeats)), [usingDefaults, players, maxSeats]);
  const overflow = usingDefaults ? 0 : Math.max(0, Math.min(players.length, VIP_LIMITS.bottleSeats) - maxSeats);
  const seatsKey = seats.join('\n');

  const [rotation, setRotation] = useState(REST_ANGLE);
  const [spinning, setSpinning] = useState(false);
  const [target, setTarget] = useState<number | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [stats, setStats] = useState<Record<string, SeatStat>>({});
  const [history, setHistory] = useState<SpinTurn[]>([]);
  const decks = useRef<Record<'truth' | 'dare', PromptCard[]>>({ truth: [], dare: [] });
  const lastCard = useRef<string | null>(null);
  const spinningRef = useRef(false);
  const turnId = useRef(0);

  useEffect(() => {
    setTarget(null);
    setChoice(null);
    setResultOpen(false);
  }, [seatsKey]);

  const bump = useCallback((name: string, field: keyof SeatStat) => {
    setStats((current) => {
      const stat = current[name] ?? { picked: 0, drinks: 0 };
      return { ...current, [name]: { ...stat, [field]: stat[field] + 1 } };
    });
  }, []);

  const spin = useCallback(() => {
    if (spinningRef.current || seats.length < 2) return;
    const next = pickTarget(seats.length, target);
    spinningRef.current = true;
    setTarget(next);
    setChoice(null);
    setResultOpen(false);
    setRotation((current) => spinTarget(current, next, seats.length, MIN_TURNS + randomInt(3), Math.random() * 2 - 1));
    setSpinning(true);
    play('start');
  }, [seats.length, target, play]);

  const finishSpin = useCallback(() => {
    if (!spinningRef.current) return;
    spinningRef.current = false;
    setSpinning(false);
    if (target === null) return;
    bump(seats[target], 'picked');
    setResultOpen(true);
    play('success');
  }, [target, seats, bump, play]);

  const choose = useCallback(
    (kind: ChoiceKind) => {
      if (target === null) return;
      play('pop');
      if (kind === 'drink') {
        bump(seats[target], 'drinks');
        setChoice({ kind: 'drink' });
        return;
      }
      const { card, rest } = drawCard(decks.current[kind], cardsForLevel(SOURCES[kind], ALL_LEVELS, FREE_MAX_LEVEL), lastCard.current);
      decks.current[kind] = rest;
      lastCard.current = card.id;
      setChoice({ kind, card });
    },
    [target, seats, bump, play],
  );

  const chicken = useCallback(() => {
    if (target === null) return;
    bump(seats[target], 'drinks');
    setChoice({ kind: 'drink' });
    play('fail');
  }, [target, seats, bump, play]);

  const close = useCallback(() => {
    setResultOpen(false);
    if (target === null) return;
    turnId.current += 1;
    const turn: SpinTurn = { id: turnId.current, name: seats[target], kind: choice?.kind ?? null };
    setHistory((current) => [turn, ...current].slice(0, HISTORY_SIZE));
    setChoice(null);
  }, [target, seats, choice]);

  const spinAgain = useCallback(() => {
    close();
    spin();
  }, [close, spin]);

  const reset = useCallback(() => {
    setStats({});
    setHistory([]);
  }, []);

  return {
    requireVip,
    overflow,
    maxSeats,
    seats,
    usingDefaults,
    rotation,
    spinning,
    winner: target !== null && !spinning ? target : null,
    pickedName: target !== null ? seats[target] : null,
    resultOpen,
    choice,
    stats,
    history,
    spin,
    finishSpin,
    choose,
    chicken,
    close,
    spinAgain,
    reset,
  };
}
