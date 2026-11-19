// Hàng "Chơi gần đây" và "Yêu thích" trên trang chủ, chỉ hiện khi người dùng đã có lịch sử trên máy này
'use client';

import SectionTitle from '@/shared/ui/SectionTitle';
import useGameLibrary from '../useGameLibrary';
import { GAMES, type GameSlug } from '../games';
import GameCard from './GameCard';

function Row({ title, stop, slugs }: { title: string; stop: number; slugs: GameSlug[] }) {
  const games = slugs.map((slug) => GAMES.find((game) => game.slug === slug)).filter((game) => game !== undefined);
  if (games.length === 0) return null;

  return (
    <div>
      <SectionTitle title={title} stop={stop} />
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-6">
        {games.map((game) => (
          <li key={game.slug} className="w-40 flex-shrink-0 snap-start [perspective:1000px] md:w-auto">
            <GameCard game={game} compact />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ContinuePlaying() {
  const { recent, favorites, ready } = useGameLibrary();
  if (!ready || (recent.length === 0 && favorites.length === 0)) return null;

  return (
    <section className="page space-y-8 pt-10">
      <Row title="Chơi gần đây" stop={7} slugs={recent} />
      <Row title="Yêu thích" stop={3} slugs={favorites} />
    </section>
  );
}
