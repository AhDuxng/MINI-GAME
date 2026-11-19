// Điều khiển Chỉ Mặt Đặt Tên: rút câu "Ai dễ... nhất?" qua bộ bài theo mức độ dùng chung (mức Cháy chỉ cho VIP), đếm ngược 3 giây rồi ghi tên người bị chỉ nhiều nhất
import { useCallback, useState } from 'react';
import { useSound } from '@/features/settings';
import { MOST_LIKELY_CARDS, type PromptCard } from '@/data';
import { useCountdown, useLeveledDeck, useTally } from '@/games/kit';

export type MostLikelyPhase = 'idle' | 'reading' | 'countdown' | 'pointing';

const SOURCES = { question: MOST_LIKELY_CARDS };
const hotText = (card: PromptCard) => card.text;

export default function useMostLikely() {
  const { play } = useSound();
  const deck = useLeveledDeck('most-likely', SOURCES, hotText);
  const { ranking, bump, reset: resetTally } = useTally();
  const [card, setCard] = useState<PromptCard | null>(null);
  const [phase, setPhase] = useState<MostLikelyPhase>('idle');
  const [marked, setMarked] = useState<string[]>([]);
  const countdown = useCountdown({
    onDone: () => {
      setPhase('pointing');
      play('start');
    },
  });

  const next = useCallback(() => {
    countdown.cancel();
    bump(marked);
    setCard(deck.draw('question'));
    setMarked([]);
    setPhase('reading');
    play('pop');
  }, [countdown, bump, marked, deck, play]);

  const startCountdown = useCallback(() => {
    if (phase !== 'reading') return;
    setPhase('countdown');
    countdown.start();
  }, [phase, countdown]);

  const toggleMark = useCallback(
    (player: string) => setMarked((current) => (current.includes(player) ? current.filter((name) => name !== player) : [...current, player])),
    [],
  );

  const reset = useCallback(() => {
    countdown.cancel();
    resetTally();
    setCard(null);
    setMarked([]);
    setPhase('idle');
  }, [countdown, resetTally]);

  return { card, phase, count: countdown.count, marked, ranking, round: deck.draws, deck, next, startCountdown, toggleMark, reset };
}
