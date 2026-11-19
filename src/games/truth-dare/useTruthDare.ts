// Logic Thật hay Thách: hai chồng bài Thật và Thách rút qua bộ bài theo mức độ dùng chung (mức Cháy chỉ cho VIP, không lặp lá vừa rút), thống kê lượt chơi và chuyển lượt lần lượt hoặc ngẫu nhiên
import { useCallback, useState } from 'react';
import { useSound } from '@/features/settings';
import { DARE_CARDS, TRUTH_CARDS, type PromptCard } from '@/data';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { useLeveledDeck } from '@/games/kit';
import { randomInt } from '@/shared/lib/random';

export type PromptKind = 'truth' | 'dare';
export type TurnOrder = 'sequential' | 'random';

const SOURCES: Record<PromptKind, PromptCard[]> = { truth: TRUTH_CARDS, dare: DARE_CARDS };
const hotText = (card: PromptCard) => card.text;

interface CurrentPrompt {
  kind: PromptKind;
  card: PromptCard;
}

function nextTurn(current: number, playerCount: number, order: TurnOrder) {
  if (playerCount < 2) return 0;
  if (order === 'sequential') return (current + 1) % playerCount;
  return (current + 1 + randomInt(playerCount - 1)) % playerCount;
}

export default function useTruthDare(players: string[]) {
  const { play } = useSound();
  const deck = useLeveledDeck('truth-dare', SOURCES, hotText);
  const [order, setOrder] = useLocalStorage<TurnOrder>('truth-dare:order', 'sequential');
  const [prompt, setPrompt] = useState<CurrentPrompt | null>(null);
  const [turn, setTurn] = useState(0);
  const [stats, setStats] = useState({ truth: 0, dare: 0, skipped: 0 });

  const currentPlayer = players.length > 0 ? players[turn % players.length] : null;

  const draw = useCallback(
    (kind: PromptKind) => {
      setPrompt({ kind, card: deck.draw(kind) });
      play('pop');
    },
    [deck, play],
  );

  const drawRandom = useCallback(() => draw(Math.random() < 0.5 ? 'truth' : 'dare'), [draw]);

  const skip = useCallback(() => {
    if (!prompt) return;
    setStats((current) => ({ ...current, skipped: current.skipped + 1 }));
    draw(prompt.kind);
  }, [prompt, draw]);

  const complete = useCallback(() => {
    if (!prompt) return;
    setStats((current) => ({ ...current, [prompt.kind]: current[prompt.kind] + 1 }));
    setPrompt(null);
    setTurn((current) => nextTurn(current, players.length, order));
  }, [prompt, players.length, order]);

  return { prompt, currentPlayer, stats, deck, order, setOrder, draw, drawRandom, skip, complete };
}
