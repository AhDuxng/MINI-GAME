// Dải trạng thái VIP nổi dưới thanh điều hướng: đếm ngược khi đang thử VIP miễn phí kèm nút giữ VIP cả tối, và nhắc khi vé 24 giờ còn dưới 2 tiếng kèm giá lên gói tháng sau ưu đãi; chỉ chạy đồng hồ mỗi giây khi dải đang hiện, còn lại chỉ hẹn giờ tới lúc cần hiện
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCrown } from 'react-icons/fa6';
import { formatCurrency } from '@/shared/lib/utils';
import { usePremium } from '../PremiumContext';
import { checkoutHref, HERO_PLAN_ID, getPlan, priceAfterCredit } from '../plans';

const REMIND_BEFORE_MS = 2 * 60 * 60 * 1000;

function clock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export default function VipStatusBar() {
  const { vipSource, tasteEndsAt, membership, upgradeCredit } = usePremium();
  const [now, setNow] = useState(() => Date.now());
  const ticketEnds = vipSource === 'membership' && membership?.planId === HERO_PLAN_ID ? membership.expiresAt : null;
  const deadline = vipSource === 'taste' ? tasteEndsAt : ticketEnds;
  const showFrom = vipSource === 'taste' || deadline === null ? 0 : deadline - REMIND_BEFORE_MS;
  const showing = deadline !== null && now >= showFrom;
  const endsAt = showing ? deadline : null;

  useEffect(() => {
    if (deadline === null) return;
    const wait = showFrom - Date.now();
    if (wait > 0) {
      const timer = window.setTimeout(() => setNow(Date.now()), wait + 50);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [deadline, showFrom, showing]);

  if (endsAt === null || endsAt <= now) return null;

  const tasting = vipSource === 'taste';
  const hero = getPlan(HERO_PLAN_ID);
  const monthly = getPlan('monthly');
  const target = tasting ? hero : monthly;
  const price = tasting ? hero.price : priceAfterCredit(monthly, upgradeCredit);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-height)+8px)] z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full border-2 border-edge bg-canvas py-1 pl-3 pr-1 shadow-lift">
        <FaCrown className="h-3.5 w-3.5 flex-shrink-0 text-ramp-text-1" />
        <span className="truncate text-xs font-bold text-ink sm:text-sm">
          {tasting ? 'Đang thử VIP' : 'Vé VIP còn'} <span className="font-display tabular-nums">{clock(endsAt - now)}</span>
        </span>
        <Link href={checkoutHref(target.id)} className="fill-ramp flex-shrink-0 rounded-full px-3 py-1.5 font-display text-xs font-extrabold">
          {tasting ? `Giữ cả tối · ${formatCurrency(price)}` : `Lên Gói Tháng · ${formatCurrency(price)}`}
        </Link>
      </div>
    </div>
  );
}
