// Bảng đếm theo người chơi dùng chung (ngụm phải uống, số lần bị chỉ, điểm đoán đúng): cộng cho nhiều người một lúc, xếp hạng giảm dần và làm lại từ đầu
import { useCallback, useMemo, useState } from 'react';

export type Ranking = [name: string, count: number][];

export default function useTally() {
  const [tally, setTally] = useState<Record<string, number>>({});

  const bump = useCallback((names: string[], amount = 1) => {
    if (names.length === 0) return;
    setTally((current) => {
      const updated = { ...current };
      names.forEach((name) => (updated[name] = (updated[name] ?? 0) + amount));
      return updated;
    });
  }, []);

  const reset = useCallback(() => setTally({}), []);
  const ranking = useMemo<Ranking>(() => Object.entries(tally).sort((a, b) => b[1] - a[1]), [tally]);

  return { tally, ranking, bump, reset };
}
