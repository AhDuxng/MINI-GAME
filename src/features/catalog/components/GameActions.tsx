// Nút trên đầu trang game: lưu vào yêu thích và ghi nhận game vừa chơi để hiện ở trang chủ
'use client';

import { useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import Button from '@/shared/ui/Button';
import useGameLibrary from '../useGameLibrary';
import type { GameSlug } from '../games';

export default function GameActions({ slug }: { slug: GameSlug }) {
  const { favorites, ready, toggleFavorite, markPlayed } = useGameLibrary();
  const favorite = favorites.includes(slug);

  useEffect(() => {
    if (ready) markPlayed(slug);
  }, [ready, slug, markPlayed]);

  return (
    <Button variant="secondary" size="sm" onClick={() => toggleFavorite(slug)} aria-pressed={favorite}>
      {favorite ? <FaHeart className="h-3.5 w-3.5 text-ramp-text-3" /> : <FaRegHeart className="h-3.5 w-3.5" />}
      {favorite ? 'Đã thích' : 'Yêu thích'}
    </Button>
  );
}
