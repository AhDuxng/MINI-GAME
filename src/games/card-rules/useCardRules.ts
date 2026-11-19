// Điều khiển Luật Bài: rút lần lượt từ bộ 52 lá đã xáo, xoay vòng lượt người rút, đếm lá K để báo ai cạn ly chung và xào lại khi hết bài
import { useCallback, useState } from 'react';
import { useSound } from '@/features/settings';
import { DECK_SIZE, KING_RANK, isFinalKing, shuffledDeck, type PlayingCard } from './card-deck';

interface DrawnCard {
  card: PlayingCard;
  drawer: string | null;
  order: number;
}

export default function useCardRules(players: string[]) {
  const { play } = useSound();
  const [deck, setDeck] = useState<PlayingCard[] | null>(null);
  const [current, setCurrent] = useState<DrawnCard | null>(null);
  const [kings, setKings] = useState(0);
  const [turn, setTurn] = useState(0);
  const [cupOpen, setCupOpen] = useState(false);

  const nextPlayer = players.length > 0 ? players[turn % players.length] : null;
  const left = deck ? deck.length : DECK_SIZE;
  const drawnCount = DECK_SIZE - left;

  const draw = useCallback(() => {
    const pile = deck ?? shuffledDeck();
    if (pile.length === 0) return;
    const [card, ...rest] = pile;
    setDeck(rest);
    setCurrent({ card, drawer: nextPlayer, order: DECK_SIZE - rest.length });
    setTurn((value) => value + 1);

    if (card.rank !== KING_RANK) {
      play('pop');
      return;
    }
    if (isFinalKing(card, kings)) {
      setCupOpen(true);
      play('fail');
    } else {
      play('success');
    }
    setKings((value) => value + 1);
  }, [deck, nextPlayer, kings, play]);

  const reshuffle = useCallback(() => {
    setDeck(shuffledDeck());
    setCurrent(null);
    setKings(0);
    setCupOpen(false);
    play('start');
  }, [play]);

  const closeCup = useCallback(() => setCupOpen(false), []);

  return { current, kings, left, drawnCount, nextPlayer, cupOpen, draw, reshuffle, closeCup };
}
