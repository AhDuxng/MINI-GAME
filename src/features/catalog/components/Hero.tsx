// Banner đầu trang chủ: trình chiếu các game nổi bật, tự chuyển sau vài giây và dừng khi người dùng rê chuột hoặc giảm chuyển động
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa6';
import GameBadges from './GameBadges';
import GameIllustration from '../illustrations/GameIllustration';
import { buttonStyles } from '@/shared/ui/Button';
import { FEATURED_GAMES, gameHref, getCategory, getGame } from '../games';
import { rampFill, rampWash } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';

const SLIDE_MS = 6000;
const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const game = getGame(FEATURED_GAMES[index]);
  const category = getCategory(game.category);
  const count = FEATURED_GAMES.length;
  const go = (step: number) => setIndex((current) => (current + step + count) % count);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % count), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, paused, count]);

  return (
    <section
      className="border-b border-line"
      style={{ background: rampWash(category.stop, 14) }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="page relative grid items-center gap-6 py-8 md:grid-cols-[1fr_1.1fr] md:gap-10 md:py-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={game.slug}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="order-2 space-y-4 md:order-1"
          >
            <div className="flex flex-wrap items-center gap-2">
              <GameBadges game={game} />
              <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: `var(--ramp-text-${category.stop})` }}>
                {category.label}
              </span>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-6xl">{game.title}</h1>
            <p className="max-w-md text-base text-muted md:text-lg">{game.description}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href={gameHref(game.slug)} className={buttonStyles({ size: 'lg' })}>
                <FaPlay className="h-4 w-4" />
                Chơi ngay
              </Link>
              <Link href="/#games" className={buttonStyles({ size: 'lg', variant: 'secondary' })}>
                Tất cả trò chơi
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={game.slug}
            initial={{ opacity: 0, rotateY: -12, scale: 0.96 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: 12, scale: 0.96 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="order-1 [perspective:1200px] md:order-2"
          >
            <Link href={gameHref(game.slug)} className="relative block aspect-[16/10] overflow-hidden rounded-2xl border-2 border-edge bg-canvas shadow-lift">
              <GameIllustration slug={game.slug} className="h-full w-full" />
              <span className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: rampFill(category.stop) }} />
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="order-3 flex items-center gap-3 md:col-span-2">
          <button type="button" onClick={() => go(-1)} aria-label="Game trước" className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'w-10 px-0' })}>
            <FaChevronLeft className="h-3 w-3" />
          </button>
          <div className="flex gap-1.5">
            {FEATURED_GAMES.map((slug, dot) => (
              <button
                key={slug}
                type="button"
                onClick={() => setIndex(dot)}
                aria-label={`Xem ${getGame(slug).title}`}
                aria-current={dot === index}
                className="group flex h-10 min-w-9 items-center justify-center px-1"
              >
                <span className={cn('block h-2 rounded-full transition-all duration-300 ease-house', dot === index ? 'w-10 bg-ink' : 'w-4 bg-ink/25 group-hover:bg-ink/40')} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Game tiếp theo" className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'w-10 px-0' })}>
            <FaChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </section>
  );
}
