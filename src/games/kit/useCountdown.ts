// Đếm ngược 3-2-1 dùng chung trước lúc cả bàn cùng hành động: phát tiếng tích mỗi nhịp, gọi onDone khi về 0, huỷ được giữa chừng và tự dọn hẹn giờ khi rời trang
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '@/features/settings';

interface CountdownOptions {
  from?: number;
  stepMs?: number;
  onDone: () => void;
}

export default function useCountdown({ from = 3, stepMs = 850, onDone }: CountdownOptions) {
  const { play } = useSound();
  const [count, setCount] = useState(from);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const cancel = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setRunning(false);
    setCount(from);
  }, [from]);

  useEffect(() => cancel, [cancel]);

  const start = useCallback(() => {
    cancel();
    setRunning(true);
    play('tick');
    for (let step = 1; step <= from; step++) {
      timers.current.push(
        window.setTimeout(() => {
          const value = from - step;
          setCount(value);
          if (value > 0) {
            play('tick');
            return;
          }
          setRunning(false);
          onDoneRef.current();
        }, step * stepMs),
      );
    }
  }, [cancel, play, from, stepMs]);

  return { count, running, start, cancel };
}
