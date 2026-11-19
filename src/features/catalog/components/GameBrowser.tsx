// Danh sách game theo thể loại: tab lọc đồng bộ với tham số ?category trên URL để menu và đường dẫn có thể trỏ thẳng vào thể loại
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import SectionTitle from '@/shared/ui/SectionTitle';
import { CATEGORIES, GAMES, type CategorySlug } from '../games';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';
import GameCard from './GameCard';

type Filter = 'all' | CategorySlug;

const TABS: { value: Filter; label: string; stop: number }[] = [
  { value: 'all', label: 'Tất cả', stop: 0 },
  ...CATEGORIES.map((category) => ({ value: category.slug, label: category.label, stop: category.stop })),
];

function readFilter(value: string | null): Filter {
  return CATEGORIES.some((category) => category.slug === value) ? (value as CategorySlug) : 'all';
}

export default function GameBrowser() {
  const router = useRouter();
  const filter = readFilter(useSearchParams().get('category'));
  const games = filter === 'all' ? GAMES : GAMES.filter((game) => game.category === filter);

  const select = (value: Filter) => {
    router.replace(value === 'all' ? '/#games' : `/?category=${value}#games`, { scroll: false });
  };

  return (
    <section id="games" className="page scroll-mt-24 py-10 md:py-14">
      <SectionTitle title="Kho trò chơi" stop={2} action={<span className="text-sm font-bold text-muted">{games.length} trò</span>} />
      <div role="tablist" aria-label="Thể loại" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {TABS.map((tab) => {
          const active = tab.value === filter;
          const count = tab.value === 'all' ? GAMES.length : GAMES.filter((game) => game.category === tab.value).length;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => select(tab.value)}
              className={cn(
                'flex h-10 flex-shrink-0 items-center gap-2 rounded-full border px-4 font-display text-sm font-bold transition-colors',
                active ? 'border-transparent text-[#12121a]' : 'border-line bg-canvas text-muted hover:bg-elevated hover:text-ink',
              )}
              style={active ? { background: rampFill(tab.stop) } : undefined}
            >
              {tab.label}
              <span className={cn('text-xs', active ? 'text-[#12121a]/70' : 'text-muted')}>{count}</span>
            </button>
          );
        })}
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game, index) => (
          <li key={game.slug} className="animate-rise [perspective:1000px]" style={{ animationDelay: `${index * 50}ms` }}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </section>
  );
}
