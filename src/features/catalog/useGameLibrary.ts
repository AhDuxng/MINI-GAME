// Thư viện cá nhân của người chơi: game yêu thích và game chơi gần đây, lưu trên máy
import { useCallback } from 'react';
import type { GameSlug } from './games';
import useLocalStorage from '@/shared/hooks/useLocalStorage';

const RECENT_LIMIT = 6;

export default function useGameLibrary() {
  const [favorites, setFavorites, favoritesReady] = useLocalStorage<GameSlug[]>('favorites', []);
  const [recent, setRecent, recentReady] = useLocalStorage<GameSlug[]>('recent', []);

  const toggleFavorite = useCallback(
    (slug: GameSlug) =>
      setFavorites((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current])),
    [setFavorites],
  );

  const markPlayed = useCallback(
    (slug: GameSlug) => setRecent((current) => [slug, ...current.filter((item) => item !== slug)].slice(0, RECENT_LIMIT)),
    [setRecent],
  );

  return { favorites, recent, ready: favoritesReady && recentReady, toggleFavorite, markPlayed };
}
