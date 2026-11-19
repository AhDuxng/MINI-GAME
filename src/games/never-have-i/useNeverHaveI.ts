// Logic Tôi Chưa Từng: rút lá theo mức độ qua bộ bài dùng chung (mức Cháy chỉ cho VIP), đánh dấu ai đã từng rồi cộng dồn số ngụm của từng người
import { useCallback, useState } from 'react';
import { useSound } from '@/features/settings';
import { NEVER_CARDS, type PromptCard } from '@/data';
import { useLeveledDeck, useTally } from '@/games/kit';

const SOURCES = { never: NEVER_CARDS };
const hotText = (card: PromptCard) => card.text;

export default function useNeverHaveI() {
  const { play } = useSound();
  const deck = useLeveledDeck('never-have-i', SOURCES, hotText);
  const { ranking, bump, reset: resetTally } = useTally();
  const [card, setCard] = useState<PromptCard | null>(null);
  const [marked, setMarked] = useState<string[]>([]);

  const next = useCallback(() => {
    if (card) bump(marked);
    setCard(deck.draw('never'));
    setMarked([]);
    play('pop');
  }, [card, marked, bump, deck, play]);

  const toggleMark = useCallback(
    (player: string) => setMarked((current) => (current.includes(player) ? current.filter((name) => name !== player) : [...current, player])),
    [],
  );

  const reset = useCallback(() => {
    resetTally();
    setCard(null);
    setMarked([]);
  }, [resetTally]);

  return { card, marked, ranking, round: deck.draws, deck, next, toggleMark, reset };
}
