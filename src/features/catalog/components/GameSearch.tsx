// Ô tìm game trên header, không phân biệt dấu tiếng Việt; Enter để mở kết quả đầu tiên
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { BiSearch } from 'react-icons/bi';
import { gameHref, searchGames } from '../games';
import { cn } from '@/shared/lib/utils';

export default function GameSearch({ className }: { className?: string }) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const results = searchGames(query);
  const showResults = focused && query.trim().length > 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!results[0]) return;
    router.push(gameHref(results[0].slug));
    setQuery('');
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn('relative', className)}>
      <BiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Tìm game..."
        aria-label="Tìm game"
        aria-controls={listId}
        className="field h-9 py-0 pl-9 text-sm"
      />
      {showResults && (
        <ul id={listId} className="surface absolute inset-x-0 top-full z-50 mt-2 overflow-hidden py-1">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">Không tìm thấy game phù hợp.</li>
          ) : (
            results.map((game) => (
              <li key={game.slug}>
                <Link
                  href={gameHref(game.slug)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setQuery('')}
                  className="block px-4 py-2.5 transition-colors hover:bg-elevated"
                >
                  <span className="block font-display text-base font-bold text-ink">{game.title}</span>
                  <span className="block text-xs text-muted">{game.description}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </form>
  );
}
