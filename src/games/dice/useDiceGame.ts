// Logic xí ngầu: xoay lượt theo danh sách người chơi, chốt mặt ngẫu nhiên ngay khi lắc và cộng dồn số vòng để animation luôn dừng đúng mặt
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import { DICE_FACES } from '@/data';
import { pickRandom, randomInt } from '@/shared/lib/random';

export const ROLL_DURATION_MS = 1600;
const MAX_HISTORY = 50;

export interface DiceRoll {
  id: number;
  faceId: number;
  player: string | null;
  rolledAt: Date;
}

export interface SpinTurns {
  x: number;
  y: number;
  z: number;
}

export default function useDiceGame(players: string[]) {
  const { play } = useSound();
  const [faceId, setFaceId] = useState(DICE_FACES[0].id);
  const [turns, setTurns] = useState<SpinTurns>({ x: 0, y: 0, z: 0 });
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<DiceRoll[]>([]);
  const [turn, setTurn] = useState(0);
  const rollingRef = useRef(false);
  const rollCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const currentPlayer = players.length > 0 ? players[turn % players.length] : null;

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const roll = useCallback(() => {
    if (rollingRef.current) return;
    rollingRef.current = true;

    const nextFaceId = pickRandom(DICE_FACES).id;
    const roller = currentPlayer;
    setFaceId(nextFaceId);
    setTurns((current) => ({
      x: current.x + 2 + randomInt(3),
      y: current.y + 2 + randomInt(3),
      z: current.z + 1 + randomInt(2),
    }));
    setIsRolling(true);
    play('roll');

    timerRef.current = setTimeout(() => {
      rollingRef.current = false;
      rollCountRef.current += 1;
      const entry = { id: rollCountRef.current, faceId: nextFaceId, player: roller, rolledAt: new Date() };
      setIsRolling(false);
      setHistory((current) => [entry, ...current].slice(0, MAX_HISTORY));
      setTurn((current) => current + 1);
      play('success');
    }, ROLL_DURATION_MS);
  }, [currentPlayer, play]);

  const clearHistory = useCallback(() => {
    rollCountRef.current = 0;
    setHistory([]);
    setTurn(0);
  }, []);

  return { faceId, turns, isRolling, history, currentPlayer, roll, clearHistory };
}
