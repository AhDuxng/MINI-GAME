// Bộ bài theo mức độ cho các game bài có mức "Cháy" chỉ dành cho VIP: nhớ mức đã chọn, tự hạ mức khi hết quyền VIP, mỗi chồng bài gắn đúng loại, mức và quyền hiện tại nên lá Cháy không lọt ra sau khi vé hay lượt thử hết hạn; kèm danh sách lựa chọn mức và lá Cháy lấp ló cho người chưa VIP
import { useCallback, useMemo, useRef, useState } from 'react';
import { HOT_LEVEL, LEVEL_LABELS } from '@/data';
import { useVipAccess } from '@/features/billing';
import type { GameSlug } from '@/features/catalog';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { ALL_LEVELS, cardsForLevel, drawCard, type LeveledCard } from './deck';
import { shouldTease, teaserText } from './LockedTeaser';

export interface LevelOption {
  value: number;
  label: string;
}

export default function useLeveledDeck<K extends string, T extends LeveledCard>(slug: GameSlug, sources: Record<K, T[]>, hotText: (card: T) => string) {
  const { isVip, requireVip } = useVipAccess(slug);
  const [savedLevel, setSavedLevel] = useLocalStorage(`${slug}:level`, 1);
  const [draws, setDraws] = useState(0);
  const piles = useRef<Record<string, T[]>>({});
  const lastIds = useRef<Partial<Record<K, string>>>({});

  const maxLevel = isVip ? HOT_LEVEL : HOT_LEVEL - 1;
  const level = savedLevel > maxLevel ? maxLevel : savedLevel;

  const draw = useCallback(
    (kind: K) => {
      const key = `${kind}|${level}|${maxLevel}`;
      const { card, rest } = drawCard(piles.current[key] ?? [], cardsForLevel(sources[kind], level, maxLevel), lastIds.current[kind] ?? null);
      piles.current[key] = rest;
      lastIds.current[kind] = card.id;
      setDraws((value) => value + 1);
      return card;
    },
    [sources, level, maxLevel],
  );

  const setLevel = useCallback(
    (value: number) => {
      if (value === HOT_LEVEL && !requireVip(`Mức độ "${LEVEL_LABELS[HOT_LEVEL]}"`)) return;
      setSavedLevel(value);
    },
    [requireVip, setSavedLevel],
  );

  const options = useMemo<LevelOption[]>(
    () => [
      { value: 1, label: LEVEL_LABELS[1] },
      { value: 2, label: LEVEL_LABELS[2] },
      { value: HOT_LEVEL, label: isVip ? LEVEL_LABELS[HOT_LEVEL] : `${LEVEL_LABELS[HOT_LEVEL]} 👑` },
      { value: ALL_LEVELS, label: 'Tất cả' },
    ],
    [isVip],
  );

  const hotTexts = useMemo(() => (Object.values(sources) as T[][]).flat().filter((card) => card.level === HOT_LEVEL).map(hotText), [sources, hotText]);
  const teaser = shouldTease(isVip, level, draws) ? teaserText(hotTexts, draws) : null;

  return { level, setLevel, options, isVip, draw, draws, teaser };
}

export function levelLabel(level: number) {
  return LEVEL_LABELS[level as keyof typeof LEVEL_LABELS] ?? 'Tất cả mức độ';
}
