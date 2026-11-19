// Thẻ một gói VIP: nhãn mời chào, giá (giá sau ưu đãi nếu vừa mua vé), cách quy đổi dễ hiểu theo đầu người hoặc theo ngày, ghi chú có cần tài khoản không và nút chọn; vé 9k được làm nổi nhất
'use client';

import Link from 'next/link';
import { FaUserGroup } from 'react-icons/fa6';
import { usePlayers } from '@/features/players';
import { buttonStyles } from '@/shared/ui/Button';
import { cn, formatCurrency } from '@/shared/lib/utils';
import { usePremium } from '../PremiumContext';
import { checkoutHref, perPerson, priceAfterCredit, type Plan } from '../plans';

export default function PlanCard({ plan }: { plan: Plan }) {
  const { players } = usePlayers();
  const { upgradeCredit } = usePremium();
  const price = priceAfterCredit(plan, upgradeCredit);
  const people = Math.max(players.length, 4);
  const perDay = plan.durationDays && plan.durationDays > 1 ? Math.round(price / plan.durationDays) : null;

  return (
    <article className={cn('relative flex flex-col rounded-2xl border-2 bg-canvas p-6', plan.hero ? 'border-edge shadow-lift md:-translate-y-2' : 'border-line')}>
      <span className={cn('absolute -top-3 left-6 rounded-md px-2.5 py-0.5 font-display text-xs font-bold text-[#12121a]', plan.hero ? 'bg-ramp-1' : 'bg-elevated ring-1 ring-line')}>{plan.badge}</span>
      <h3 className="font-display text-2xl font-bold text-ink">{plan.name}</h3>
      <p className="text-sm text-muted">{plan.tagline}</p>
      <div className="mt-5 flex items-end gap-2">
        <p className="font-display text-4xl font-extrabold text-ink">{formatCurrency(price)}</p>
        {price < plan.price && <p className="pb-1.5 text-sm font-semibold text-muted line-through">{formatCurrency(plan.price)}</p>}
      </div>
      <p className="text-sm font-semibold text-muted">
        / {plan.period}
        {perDay !== null && ` · chỉ ~${formatCurrency(perDay)}/ngày`}
      </p>
      {plan.hero && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-ink">
          <FaUserGroup className="h-3.5 w-3.5 text-ramp-text-1" />
          Chia {people} người ≈ {formatCurrency(perPerson(price, people))}/người
        </p>
      )}
      <p className="mt-2 text-sm text-muted">{price < plan.price ? `Đã trừ ${formatCurrency(plan.price - price)} từ vé bạn mua gần đây` : plan.pitch}</p>
      <div className="flex-1" />
      <Link href={checkoutHref(plan.id)} className={buttonStyles({ variant: plan.hero ? 'primary' : 'secondary', size: 'lg', className: 'mt-6 w-full' })}>
        {plan.hero ? 'Mua vé cho tối nay' : 'Chọn gói này'}
      </Link>
      <p className="mt-2 text-center text-xs font-semibold text-muted">{plan.needsAccount ? 'Cần tài khoản, dùng trên mọi máy' : 'Không cần tài khoản'}</p>
    </article>
  );
}
