// Điều khiển Này Hay Kia: rút câu hai lựa chọn qua bộ bài theo mức độ dùng chung (mức Cháy chỉ cho VIP), đếm ngược 3 giây, ghi phe từng người đang có trong danh sách hoặc đếm tay, phe ít người hơn uống, hoà thì cả bàn uống, đồng lòng thì không ai phải uống
import { useCallback, useMemo, useState } from 'react';
import { useSound } from '@/features/settings';
import { DILEMMAS, type Dilemma } from '@/data';
import { useCountdown, useLeveledDeck, useTally } from '@/games/kit';

export type DilemmaPhase = 'idle' | 'reading' | 'countdown' | 'voting' | 'result';
export type Side = 'a' | 'b';

export interface Verdict {
  outcome: Side | 'tie' | 'unanimous';
  drinkers: string[];
  counts: Record<Side, number>;
}

const SOURCES = { dilemma: DILEMMAS };
const hotText = (card: Dilemma) => `${card.a} hay ${card.b}?`;
const NO_HANDS: Record<Side, number> = { a: 0, b: 0 };

export function judge(counts: Record<Side, number>): Verdict['outcome'] {
  if (counts.a === 0 || counts.b === 0) return 'unanimous';
  if (counts.a === counts.b) return 'tie';
  return counts.a < counts.b ? 'a' : 'b';
}

export default function useWouldYouRather(players: string[]) {
  const { play } = useSound();
  const deck = useLeveledDeck('would-you-rather', SOURCES, hotText);
  const { ranking, bump, reset: resetTally } = useTally();
  const [card, setCard] = useState<Dilemma | null>(null);
  const [phase, setPhase] = useState<DilemmaPhase>('idle');
  const [votes, setVotes] = useState<Record<string, Side>>({});
  const [handCounts, setHandCounts] = useState(NO_HANDS);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const countdown = useCountdown({
    onDone: () => {
      setPhase('voting');
      play('start');
    },
  });
  const byName = players.length > 0;

  const next = useCallback(() => {
    countdown.cancel();
    setCard(deck.draw('dilemma'));
    setVotes({});
    setHandCounts(NO_HANDS);
    setVerdict(null);
    setPhase('reading');
    play('pop');
  }, [countdown, deck, play]);

  const startCountdown = useCallback(() => {
    if (phase !== 'reading') return;
    setPhase('countdown');
    countdown.start();
  }, [phase, countdown]);

  const vote = useCallback((player: string, side: Side) => {
    setVotes((current) => {
      const updated = { ...current };
      if (updated[player] === side) delete updated[player];
      else updated[player] = side;
      return updated;
    });
  }, []);

  const adjustHand = useCallback((side: Side, delta: number) => {
    setHandCounts((current) => ({ ...current, [side]: Math.max(0, current[side] + delta) }));
  }, []);

  const voters = useMemo(() => players.filter((name) => votes[name]), [players, votes]);
  const counts = useMemo<Record<Side, number>>(
    () => (byName ? { a: voters.filter((name) => votes[name] === 'a').length, b: voters.filter((name) => votes[name] === 'b').length } : handCounts),
    [byName, voters, votes, handCounts],
  );

  const settle = useCallback(() => {
    if (phase !== 'voting' || counts.a + counts.b === 0) return;
    const outcome = judge(counts);
    const drinkers = outcome === 'unanimous' ? [] : outcome === 'tie' ? voters : voters.filter((name) => votes[name] === outcome);
    setVerdict({ outcome, drinkers, counts });
    bump(drinkers);
    setPhase('result');
    play(outcome === 'unanimous' ? 'success' : 'fail');
  }, [phase, counts, voters, votes, bump, play]);

  const reset = useCallback(() => {
    countdown.cancel();
    resetTally();
    setCard(null);
    setVotes({});
    setVerdict(null);
    setPhase('idle');
  }, [countdown, resetTally]);

  return { card, phase, count: countdown.count, votes, counts, byName, verdict, ranking, round: deck.draws, deck, next, startCountdown, vote, adjustHand, settle, reset };
}
