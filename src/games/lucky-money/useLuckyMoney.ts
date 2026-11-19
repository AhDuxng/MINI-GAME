// Logic rút lì xì: xếp bàn theo ngân sách chủ xị nhập, xoay vòng lượt rút, chờ hiệu ứng mở bao xong mới công bố và cộng dồn lộc từng người
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { buildEnvelopes, minBudget, type BoardSettings, type Envelope } from './lucky-rules';

export const BOARD_SIZES = [6, 9, 12, 16, 20];
export const BUDGET_PRESETS = [100000, 200000, 500000, 1000000];
const REVEAL_DELAY_MS = 1100;
const DEFAULT_SETTINGS: BoardSettings = { size: 12, budget: 200000, withFun: true };

export interface LuckyTally {
  player: string;
  total: number;
  gifts: string[];
}

export default function useLuckyMoney(players: string[]) {
  const { play } = useSound();
  const [settings, setSettings, settingsReady] = useLocalStorage<BoardSettings>('lucky-money:board', DEFAULT_SETTINGS);
  const [board, setBoard] = useState<Envelope[]>(() => buildEnvelopes(DEFAULT_SETTINGS));
  const [turn, setTurn] = useState(0);
  const [revealedId, setRevealedId] = useState<number | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout>>();
  const hydrated = useRef(false);

  useEffect(() => () => clearTimeout(revealTimer.current), []);

  const rebuild = useCallback((next: BoardSettings) => {
    clearTimeout(revealTimer.current);
    setBoard(buildEnvelopes(next));
    setTurn(0);
    setRevealOpen(false);
  }, []);

  useEffect(() => {
    if (!settingsReady || hydrated.current) return;
    hydrated.current = true;
    rebuild(settings);
  }, [settingsReady, settings, rebuild]);

  const updateSettings = useCallback(
    (patch: Partial<BoardSettings>) => {
      const merged = { ...settings, ...patch };
      const next = { ...merged, budget: Math.max(merged.budget, minBudget(merged)) };
      setSettings(next);
      rebuild(next);
    },
    [settings, setSettings, rebuild],
  );

  const currentPlayer = players.length > 0 ? players[turn % players.length] : null;
  const revealed = revealedId === null ? null : board[revealedId];
  const openedCount = board.filter((envelope) => envelope.opened).length;
  const allOpened = openedCount === board.length;

  const open = useCallback(
    (id: number) => {
      const envelope = board[id];
      if (!envelope || envelope.opened) return;

      setBoard((current) => current.map((item) => (item.id === id ? { ...item, opened: true, openedBy: currentPlayer } : item)));
      setRevealedId(id);
      clearTimeout(revealTimer.current);
      revealTimer.current = setTimeout(() => setRevealOpen(true), REVEAL_DELAY_MS);
      if (!envelope.prize.extraTurn) setTurn((current) => current + 1);
      play(envelope.prize.amount > 0 ? 'success' : 'pop');
    },
    [board, currentPlayer, play],
  );

  const closeReveal = useCallback(() => setRevealOpen(false), []);
  const reshuffle = useCallback(() => rebuild(settings), [rebuild, settings]);

  const tally = useMemo<LuckyTally[]>(() => {
    const byPlayer = new Map<string, LuckyTally>();
    board.forEach(({ opened, openedBy, prize }) => {
      if (!opened || !openedBy) return;
      const entry = byPlayer.get(openedBy) ?? { player: openedBy, total: 0, gifts: [] };
      entry.total += prize.amount;
      if (prize.label) entry.gifts.push(prize.label);
      byPlayer.set(openedBy, entry);
    });
    return [...byPlayer.values()].sort((a, b) => b.total - a.total);
  }, [board]);

  const handedOut = board.reduce((sum, envelope) => sum + (envelope.opened ? envelope.prize.amount : 0), 0);
  const budget = board.reduce((sum, envelope) => sum + envelope.prize.amount, 0);

  return {
    settings,
    board,
    currentPlayer,
    revealed,
    revealOpen,
    openedCount,
    allOpened,
    tally,
    handedOut,
    budget,
    open,
    closeReveal,
    reshuffle,
    updateSettings,
  };
}
