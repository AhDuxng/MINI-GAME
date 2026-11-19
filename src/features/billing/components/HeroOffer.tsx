// Khối mời mua chính ở mọi điểm chạm: vé 9k cho cả bàn kèm giá chia theo số người đang chơi, giờ hết hạn cụ thể, nút mua ngay không cần tài khoản và nút thử VIP miễn phí 10 phút nếu máy chưa thử
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCrown, FaHourglassHalf, FaUserGroup } from 'react-icons/fa6';
import { usePlayers } from '@/features/players';
import Button, { buttonStyles } from '@/shared/ui/Button';
import { formatCurrency } from '@/shared/lib/utils';
import { usePremium } from '../PremiumContext';
import { checkoutHref, HERO_PLAN_ID, VIP_TASTE_MINUTES, getPlan, perPerson } from '../plans';

const DAY_MS = 24 * 60 * 60 * 1000;

function validUntil() {
  const end = new Date(Date.now() + DAY_MS);
  return `${end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ngày mai`;
}

export default function HeroOffer({ onNavigate }: { onNavigate?: () => void }) {
  const { players } = usePlayers();
  const { tasteAvailable, startTaste } = usePremium();
  const plan = getPlan(HERO_PLAN_ID);
  const pathname = usePathname();
  const people = players.length;
  const share = perPerson(plan.price, people);

  return (
    <div className="space-y-2.5">
      <div className="rounded-2xl border-2 border-edge bg-[linear-gradient(120deg,var(--ramp-0),var(--ramp-1))] p-4 text-left text-[#12121a]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-extrabold leading-tight">{plan.name}</p>
            <p className="text-xs font-bold opacity-75">{plan.tagline}</p>
          </div>
          <span className="rounded-full bg-[#12121a] px-2.5 py-0.5 text-[11px] font-extrabold text-[#fbc175]">{plan.badge}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="font-display text-4xl font-extrabold leading-none">{formatCurrency(plan.price)}</span>
          {people >= 2 && (
            <span className="inline-flex items-center gap-1.5 pb-1 text-sm font-extrabold">
              <FaUserGroup className="h-3.5 w-3.5" />
              chia {people} người ≈ {formatCurrency(share)}/người
            </span>
          )}
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold opacity-80">
          <FaHourglassHalf className="h-3 w-3" />
          Dùng tới {validUntil()} · {plan.pitch}
        </p>
        <Link
          href={checkoutHref(plan.id, pathname)}
          onClick={onNavigate}
          className={buttonStyles({ size: 'lg', variant: 'secondary', className: 'mt-3 w-full border-2 border-[#12121a] bg-[#12121a] text-white hover:bg-[#12121a]/85' })}
        >
          <FaCrown className="h-4 w-4 text-[#fbc175]" />
          Mở khoá cả bàn tối nay
        </Link>
      </div>
      {tasteAvailable && (
        <Button variant="secondary" size="lg" className="w-full" onClick={startTaste}>
          Chơi thử VIP miễn phí {VIP_TASTE_MINUTES} phút
        </Button>
      )}
    </div>
  );
}
