// Khung chung của mọi trang game: đường dẫn, ảnh thu nhỏ, nhãn, thông tin nhanh, yêu thích, cách chơi và cổng VIP; trên điện thoại phần đầu thu gọn và mục cách chơi chuyển xuống dưới để bàn chơi hiện ngay trong màn hình đầu
import Link from 'next/link';
import type { ReactNode } from 'react';
import { FaChevronRight, FaClock, FaUsers } from 'react-icons/fa6';
import { GameIllustration, getCategory, getGame, type GameSlug, GameActions, GameBadges } from '@/features/catalog';
import { VipGate } from '@/features/billing';
import { rampFill } from '@/shared/lib/ramp';
import GameErrorBoundary from './GameErrorBoundary';

export default function GameShell({ slug, children }: { slug: GameSlug; children: ReactNode }) {
  const game = getGame(slug);
  const category = getCategory(game.category);

  return (
    <div className="page flex flex-col pb-28 pt-3 md:block md:py-8">
      <nav aria-label="Đường dẫn" className="mb-4 hidden items-center gap-1.5 text-sm font-semibold text-muted md:flex">
        <Link href="/" className="inline-flex min-h-10 items-center transition-colors hover:text-ink [@media(pointer:fine)]:min-h-0">
          Trang chủ
        </Link>
        <FaChevronRight className="h-2.5 w-2.5" />
        <Link href={`/?category=${category.slug}#games`} className="inline-flex min-h-10 items-center transition-colors hover:text-ink [@media(pointer:fine)]:min-h-0">
          {category.label}
        </Link>
        <FaChevronRight className="h-2.5 w-2.5" />
        <span className="text-ink">{game.title}</span>
      </nav>

      <header className="mb-4 flex gap-4 border-b border-line pb-4 md:mb-8 md:pb-6">
        <div className="relative hidden aspect-[16/10] w-40 flex-shrink-0 overflow-hidden border border-line sm:block rounded-xl">
          <GameIllustration slug={slug} className="h-full w-full" />
          <span className="absolute inset-x-0 bottom-0 h-1" style={{ background: rampFill(category.stop) }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <GameBadges game={game} />
            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: `var(--ramp-text-${category.stop})` }}>
              {category.label}
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl md:text-4xl">{game.title}</h1>
          <p className="mt-1 hidden text-muted sm:block">{game.tagline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted sm:mt-3 sm:text-sm">
            <span className="flex items-center gap-1.5">
              <FaUsers className="h-3.5 w-3.5" /> {game.players}
            </span>
            <span className="flex items-center gap-1.5">
              <FaClock className="h-3.5 w-3.5" /> {game.duration}
            </span>
            <a href="#how-to" className="inline-flex min-h-9 items-center gap-1 rounded-lg px-1 font-bold text-ink underline decoration-dotted underline-offset-4 md:hidden">
              Cách chơi
            </a>
            <GameActions slug={slug} />
          </div>
        </div>
      </header>

      <details id="how-to" className="group order-last mt-6 scroll-mt-20 rounded-xl border border-line bg-elevated md:order-none md:mb-6 md:mt-0">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-display text-lg font-bold text-ink">
          Cách chơi
          <FaChevronRight className="h-3 w-3 transition-transform group-open:rotate-90" />
        </summary>
        <ol className="space-y-2 px-4 pb-4">
          {game.howTo.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-ink">
              <span
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center font-display text-sm font-bold text-[#12121a] rounded-md"
                style={{ background: rampFill(category.stop) }}
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </details>

      <GameErrorBoundary>
        <VipGate slug={slug}>{children}</VipGate>
      </GameErrorBoundary>
    </div>
  );
}
