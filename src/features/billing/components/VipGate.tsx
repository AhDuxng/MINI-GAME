// Cổng VIP của trang game: game miễn phí hiển thị thẳng; game VIP báo số lượt thử còn lại kèm giá chia đầu người, hết lượt thì thay bằng màn mời mua vé 9k cho cả bàn hoặc thử VIP 10 phút
'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { FaCrown, FaLock } from 'react-icons/fa6';
import { usePlayers } from '@/features/players';
import Button from '@/shared/ui/Button';
import { formatCurrency } from '@/shared/lib/utils';
import useVipAccess from '../useVipAccess';
import { usePremium } from '../PremiumContext';
import { getGame, type GameSlug } from '@/features/catalog';
import { FREE_LIMITS, HERO_PLAN_ID, getPlan, perPerson } from '../plans';
import HeroOffer from './HeroOffer';

const VipPerkList = dynamic(() => import('./VipPerkList'));

export default function VipGate({ slug, children }: { slug: GameSlug; children: ReactNode }) {
  const { locked, ready, trialsLeft } = useVipAccess(slug);
  const { openPaywall } = usePremium();
  const { players } = usePlayers();

  if (!locked || !ready || trialsLeft === null) return <>{children}</>;

  if (trialsLeft <= 0) {
    return (
      <div className="surface mx-auto flex max-w-lg flex-col items-center gap-5 px-5 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-ramp-1 text-[#12121a]">
          <FaLock className="h-6 w-6" />
        </span>
        <div>
          <p className="font-display text-2xl font-bold text-ink">Hết {FREE_LIMITS.trialRoundsPerDay} lượt chơi thử hôm nay</p>
          <p className="mt-1 text-muted">Cả bàn đang vui thì đừng dừng lại. Mở khoá tới giờ này ngày mai, ai trong nhóm cũng chơi được.</p>
        </div>
        <div className="w-full">
          <HeroOffer />
        </div>
        <VipPerkList />
      </div>
    );
  }

  const hero = getPlan(HERO_PLAN_ID);
  const people = players.length;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ramp-1 bg-[color-mix(in_srgb,var(--ramp-1)_14%,transparent)] px-4 py-3">
        <p className="text-sm font-semibold text-ink">
          <FaCrown className="mr-1.5 inline h-4 w-4 text-ramp-text-1" />
          Game VIP · còn <strong>{trialsLeft}</strong>/{FREE_LIMITS.trialRoundsPerDay} lượt thử hôm nay
          <span className="text-muted">
            {' '}
            · cả bàn chơi thả ga {formatCurrency(hero.price)}
            {people >= 2 && ` (≈ ${formatCurrency(perPerson(hero.price, people))}/người)`}
          </span>
        </p>
        <Button size="sm" onClick={() => openPaywall(`Chơi ${getGame(slug).title} không giới hạn lượt cho cả bàn.`)}>
          Mở khoá
        </Button>
      </div>
      {children}
    </>
  );
}
