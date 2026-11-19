// Logic Bầu Cua: điểm ảo từng người, đặt/gỡ cược theo phỉnh, lắc bát có hiệu ứng rồi mở bát, tính điểm và lưu lịch sử
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePlayers } from '@/features/players';
import { useSound } from '@/features/settings';
import { useVipAccess } from '@/features/billing';
import { randomInt } from '@/shared/lib/random';
import { DICE_COUNT, rollDice, settleBets, totalStake, type Bets, type SymbolId } from './fish-prawn-crab-rules';

export const START_POINTS = 1000;
export const CHIPS = [10, 50, 100];
export const SHAKE_MS = 1400;
export const REVEAL_MS = 650;

const HISTORY_LIMIT = 10;
const FALLBACK_PLAYERS = ['Người chơi 1', 'Người chơi 2'];

export type FishPrawnCrabPhase = 'betting' | 'shaking' | 'revealing';

export interface SpinTurns {
  x: number;
  y: number;
  z: number;
}

export interface RollRecord {
  id: number;
  roll: SymbolId[];
}

const ZERO_TURNS: SpinTurns[] = Array.from({ length: DICE_COUNT }, () => ({ x: 0, y: 0, z: 0 }));

function addTurns(turns: SpinTurns) {
  return { x: turns.x + 2 + randomInt(3), y: turns.y + 2 + randomInt(3), z: turns.z + 1 + randomInt(2) };
}

export default function useFishPrawnCrab() {
  const { players: savedPlayers } = usePlayers();
  const { play } = useSound();
  const { requestRound } = useVipAccess('fish-prawn-crab');

  const roster = useMemo(() => (savedPlayers.length >= 2 ? savedPlayers : FALLBACK_PLAYERS), [savedPlayers]);
  const [points, setPoints] = useState<Record<string, number>>({});
  const [bets, setBets] = useState<Record<string, Bets>>({});
  const [active, setActive] = useState(roster[0]);
  const [chip, setChip] = useState(CHIPS[0]);
  const [roll, setRoll] = useState<SymbolId[] | null>(null);
  const [turns, setTurns] = useState<SpinTurns[]>(ZERO_TURNS);
  const [phase, setPhase] = useState<FishPrawnCrabPhase>('betting');
  const [history, setHistory] = useState<RollRecord[]>([]);
  const [changes, setChanges] = useState<Record<string, number> | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const betsRef = useRef(bets);

  useEffect(() => {
    betsRef.current = bets;
  }, [bets]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    setPoints((current) => Object.fromEntries(roster.map((name) => [name, current[name] ?? START_POINTS])));
    setBets({});
    setActive((current) => (roster.includes(current) ? current : roster[0]));
  }, [roster]);

  const pointsOf = useCallback((name: string) => points[name] ?? START_POINTS, [points]);
  const available = useCallback((name: string) => pointsOf(name) - totalStake(bets[name] ?? {}), [pointsOf, bets]);

  const placeBet = useCallback(
    (symbol: SymbolId) => {
      if (phase !== 'betting') return;
      const amount = Math.min(chip, available(active));
      if (amount <= 0) return;
      setBets((current) => {
        const mine = current[active] ?? {};
        return { ...current, [active]: { ...mine, [symbol]: (mine[symbol] ?? 0) + amount } };
      });
      play('pop');
    },
    [phase, chip, available, active, play],
  );

  const clearBet = useCallback(
    (symbol: SymbolId) => {
      if (phase !== 'betting') return;
      setBets((current) => {
        const mine = { ...(current[active] ?? {}) };
        delete mine[symbol];
        return { ...current, [active]: mine };
      });
    },
    [phase, active],
  );

  const clearAllBets = useCallback(() => {
    if (phase === 'betting') setBets({});
  }, [phase]);

  const hasBets = roster.some((name) => totalStake(bets[name] ?? {}) > 0);

  const shake = useCallback(() => {
    if (phase !== 'betting' || !hasBets || !requestRound()) return;

    const result = rollDice();
    setRoll(result);
    setTurns((current) => current.map(addTurns));
    setResultOpen(false);
    setPhase('shaking');
    play('roll');

    timers.current.push(
      setTimeout(() => setPhase('revealing'), SHAKE_MS),
      setTimeout(() => {
        const settled = Object.fromEntries(roster.map((name) => [name, settleBets(betsRef.current[name] ?? {}, result)]));
        const betting = roster.filter((name) => totalStake(betsRef.current[name] ?? {}) > 0);
        setPoints((current) => Object.fromEntries(roster.map((name) => [name, (current[name] ?? START_POINTS) + settled[name]])));
        setChanges(Object.fromEntries(betting.map((name) => [name, settled[name]])));
        setHistory((current) => [{ id: Date.now(), roll: result }, ...current].slice(0, HISTORY_LIMIT));
        setBets({});
        setPhase('betting');
        setResultOpen(true);
        play(betting.some((name) => settled[name] > 0) ? 'success' : 'fail');
      }, SHAKE_MS + REVEAL_MS),
    );
  }, [phase, hasBets, requestRound, roster, play]);

  const newGame = useCallback(() => {
    if (phase !== 'betting') return;
    setPoints(Object.fromEntries(roster.map((name) => [name, START_POINTS])));
    setBets({});
    setRoll(null);
    setHistory([]);
    setChanges(null);
    setResultOpen(false);
  }, [phase, roster]);

  const closeResult = useCallback(() => setResultOpen(false), []);

  const tileTotals = useMemo(() => {
    const totals: Partial<Record<SymbolId, number>> = {};
    roster.forEach((name) => {
      Object.entries(bets[name] ?? {}).forEach(([symbol, stake]) => {
        const id = symbol as SymbolId;
        totals[id] = (totals[id] ?? 0) + (stake ?? 0);
      });
    });
    return totals;
  }, [roster, bets]);

  const scoreboard = useMemo(
    () => roster.map((name) => ({ name, points: pointsOf(name), change: changes?.[name] ?? null })).sort((a, b) => b.points - a.points),
    [roster, pointsOf, changes],
  );

  return {
    roster,
    usingFallback: savedPlayers.length < 2,
    active,
    setActive,
    chip,
    setChip,
    bets,
    tileTotals,
    pointsOf,
    available,
    placeBet,
    clearBet,
    clearAllBets,
    hasBets,
    roll,
    turns,
    phase,
    lidClosed: phase === 'shaking' || roll === null,
    shake,
    newGame,
    history,
    changes,
    scoreboard,
    resultOpen,
    closeResult,
  };
}
