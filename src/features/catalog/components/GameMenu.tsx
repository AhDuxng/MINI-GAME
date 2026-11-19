// Danh sách game có ô lọc không phân biệt dấu, dùng trong bảng chọn game trên điện thoại
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import GameBadges from './GameBadges';
import GameIllustration from '../illustrations/GameIllustration';
import { GAMES, gameHref, getCategory, searchGames } from '../games';
import { rampText } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';

export default function GameMenu({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const visible = query.trim() ? searchGames(query) : GAMES;

  return (
    <div className="space-y-4">
      <label className="relative block">
        <BiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm game..."
          aria-label="Tìm game"
          className="field pl-9"
        />
      </label>
      <ul className="divide-y divide-line">
        {visible.length === 0 && <li className="py-4 text-sm text-muted">Không tìm thấy game phù hợp.</li>}
        {visible.map((game) => {
          const category = getCategory(game.category);
          return (
            <li key={game.slug}>
              <Link
                href={gameHref(game.slug)}
                onClick={onNavigate}
                className={cn('flex items-center gap-3 py-2.5', pathname === gameHref(game.slug) && 'bg-elevated')}
              >
                <span className="aspect-[16/10] w-20 flex-shrink-0 overflow-hidden border border-line rounded-xl">
                  <GameIllustration slug={game.slug} className="h-full w-full" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-display text-base font-bold text-ink">{game.title}</span>
                    <GameBadges game={game} />
                  </span>
                  <span className="block text-xs font-bold" style={{ color: rampText(category.stop) }}>
                    {category.label} · {game.players}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
