// Logic vòng quay: chọn ô thắng ngay khi bấm quay, tính góc dừng tương ứng và công bố khi animation kết thúc
import { useCallback, useRef, useState } from 'react';
import { useSound } from '@/features/settings';
import { PUNISHMENTS, WHEEL_THEMES } from '@/data';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { randomInt, shuffle } from '@/shared/lib/random';
import { rampFill } from '@/shared/lib/ramp';
import { targetRotation } from './wheel-geometry';

const DEFAULT_SEGMENTS = PUNISHMENTS.slice(0, 6);

interface Winner {
  index: number;
  label: string;
}

export default function useWheelGame() {
  const { play } = useSound();
  const [segments, setSegments] = useLocalStorage<string[]>('wheel:segments', DEFAULT_SEGMENTS);
  const [themeId, setThemeId] = useLocalStorage('wheel:theme', WHEEL_THEMES[0].id);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const pendingWinner = useRef<Winner | null>(null);

  const theme = WHEEL_THEMES.find((item) => item.id === themeId) ?? WHEEL_THEMES[0];
  const colors = theme.stops.map(rampFill);
  const canSpin = segments.length >= 2 && !isSpinning;

  const spin = useCallback(() => {
    if (!canSpin) return;
    const index = randomInt(segments.length);
    pendingWinner.current = { index, label: segments[index] };
    setResultOpen(false);
    setIsSpinning(true);
    setRotation((current) => targetRotation(current, index, segments.length));
    play('start');
  }, [canSpin, segments, play]);

  const finishSpin = useCallback(() => {
    setIsSpinning(false);
    setWinner(pendingWinner.current);
    setResultOpen(true);
    play('success');
  }, [play]);

  const closeResult = useCallback(() => setResultOpen(false), []);

  const removeWinner = useCallback(() => {
    if (!winner) return;
    setSegments((current) => current.filter((_, index) => index !== winner.index));
    setResultOpen(false);
  }, [winner, setSegments]);

  const shuffleSegments = useCallback(() => setSegments((current) => shuffle(current)), [setSegments]);

  return {
    segments,
    setSegments,
    shuffleSegments,
    theme,
    colors,
    setThemeId,
    rotation,
    isSpinning,
    canSpin,
    winner,
    resultOpen,
    spin,
    finishSpin,
    closeResult,
    removeWinner,
  };
}
