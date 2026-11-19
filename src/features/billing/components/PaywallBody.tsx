// Nội dung hộp thoại mời nâng cấp: nêu lý do, đặt vé 9k cho cả bàn lên đầu, cho thử VIP 10 phút, quyền lợi đếm thật, rồi mới tới gói tháng và trọn đời (có giá sau ưu đãi nếu vừa mua vé)
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCrown } from 'react-icons/fa6';
import { cn, formatCurrency } from '@/shared/lib/utils';
import { usePaywallReason, usePremium } from '../PremiumContext';
import { checkoutHref, HERO_PLAN_ID, PLANS, priceAfterCredit } from '../plans';
import HeroOffer from './HeroOffer';
import VipPerkList from './VipPerkList';

export default function PaywallBody() {
  const paywallReason = usePaywallReason();
  const { closePaywall, upgradeCredit } = usePremium();
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-3 text-left">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-ramp-1 text-[#12121a]">
          <FaCrown className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-xl font-bold leading-tight text-ink">Mở khoá cho cả bàn</p>
          <p className="text-sm text-muted">{paywallReason}</p>
        </div>
      </div>

      <div className="mt-4">
        <HeroOffer onNavigate={closePaywall} />
      </div>

      <div className="mt-4">
        <VipPerkList />
      </div>

      <div className="mt-4 grid gap-2">
        {PLANS.filter((plan) => plan.id !== HERO_PLAN_ID).map((plan) => {
          const price = priceAfterCredit(plan, upgradeCredit);
          const discounted = price < plan.price;
          return (
            <Link
              key={plan.id}
              href={checkoutHref(plan.id, pathname)}
              onClick={closePaywall}
              className={cn('flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors hover:bg-elevated', discounted ? 'border-edge' : 'border-line')}
            >
              <span className="min-w-0">
                <span className="block font-display font-bold text-ink">{plan.name}</span>
                <span className="block truncate text-xs font-semibold text-muted">{discounted ? `Trừ ${formatCurrency(plan.price - price)} vé đã mua` : plan.badge}</span>
              </span>
              <span className="text-right">
                {discounted && <span className="block text-xs font-semibold text-muted line-through">{formatCurrency(plan.price)}</span>}
                <span className="font-display font-extrabold text-ink">{formatCurrency(price)}</span>
                <span className="text-xs font-semibold text-muted"> / {plan.period}</span>
              </span>
            </Link>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs font-semibold text-muted">Trả một lần · không tự gia hạn · không quảng cáo</p>
    </>
  );
}
