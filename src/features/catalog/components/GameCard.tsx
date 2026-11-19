// Thẻ game kiểu cổng game: minh hoạ có nhãn MỚI/HOT/VIP, nút chơi hiện khi rê chuột, thông tin thể loại, số người, thời lượng
'use client';

import Link from 'next/link';
import { FaClock, FaPlay, FaUsers } from 'react-icons/fa6';
import GameBadges from './GameBadges';
import GameIllustration from '../illustrations/GameIllustration';
import useTilt from '@/shared/hooks/useTilt';
import { gameHref, getCategory, type GameInfo } from '../games';
import { rampFill, rampText } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';

export default function GameCard({ game, compact = false }: { game: GameInfo; compact?: boolean }) {
  const tiltRef = useTilt<HTMLAnchorElement>(5);
  const category = getCategory(game.category);

  return (
    <Link
      ref={tiltRef}
      href={gameHref(game.slug)}
      className="surface group flex h-full flex-col transition-[transform,box-shadow] duration-300 ease-out [transform-style:preserve-3d] hover:shadow-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[13px] border-b border-line">
        <GameIllustration slug={game.slug} className="h-full w-full transition-transform duration-700 ease-house group-hover:scale-105" />
        <GameBadges game={game} className="absolute left-2 top-2" />
        <span className="absolute inset-0 flex items-center justify-center bg-[#12121a]/0 transition-colors duration-300 group-hover:bg-[#12121a]/25">
          <span className="fill-ramp flex h-14 w-14 scale-75 items-center justify-center rounded-full opacity-0 transition-all duration-300 ease-house group-hover:scale-100 group-hover:opacity-100">
            <FaPlay className="ml-1 h-5 w-5" />
          </span>
        </span>
        <span className="absolute inset-x-0 bottom-0 h-1" style={{ background: rampFill(category.stop) }} />
      </div>
      <div className={cn('flex flex-1 flex-col gap-1.5 [transform:translateZ(20px)]', compact ? 'p-3' : 'p-4')}>
        <h3 className={cn('font-display font-bold leading-tight text-ink', compact ? 'text-base' : 'text-lg')}>{game.title}</h3>
        {!compact && <p className="line-clamp-2 text-sm text-muted">{game.description}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs font-bold text-muted">
          <span style={{ color: rampText(category.stop) }}>{category.label}</span>
          {!compact && (
            <>
              <span className="flex items-center gap-1">
                <FaUsers className="h-3 w-3" /> {game.players}
              </span>
              <span className="flex items-center gap-1">
                <FaClock className="h-3 w-3" /> {game.duration}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
