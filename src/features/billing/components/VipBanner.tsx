// Dải quảng bá gói VIP trên trang chủ: giá vé tối nay cho cả bàn và nút thử VIP 10 phút; thành viên VIP thấy thời hạn gói đang dùng thay cho lời mời
'use client';

import Link from 'next/link';
import { FaCrown } from 'react-icons/fa6';
import { buttonStyles } from '@/shared/ui/Button';
import { usePremium } from '../PremiumContext';
import { PLANS, VIP_HIGHLIGHTS, VIP_TASTE_MINUTES, getPlan } from '../plans';
import { formatCurrency } from '@/shared/lib/utils';

export default function VipBanner() {
  const { isVip, membership, tasteAvailable, startTaste } = usePremium();
  const cheapest = Math.min(...PLANS.map((plan) => plan.price));

  return (
    <section className="page py-6">
      <div className="grid items-center gap-6 border-2 border-edge bg-[linear-gradient(115deg,var(--ramp-0),var(--ramp-1),var(--ramp-2))] p-6 text-[#12121a] md:grid-cols-[auto_1fr_auto] md:p-8 rounded-2xl">
        <span className="flex h-16 w-16 items-center justify-center bg-[#12121a] text-ramp-1 rounded-xl">
          <FaCrown className="h-8 w-8" />
        </span>
        {isVip && membership ? (
          <div>
            <p className="font-display text-2xl font-extrabold">Bạn đang là thành viên VIP</p>
            <p className="font-semibold">
              {getPlan(membership.planId).name}
              {membership.expiresAt ? ` · hết hạn ${new Date(membership.expiresAt).toLocaleString('vi-VN')}` : ' · không giới hạn thời gian'}
            </p>
          </div>
        ) : (
          <div>
            <p className="font-display text-2xl font-extrabold md:text-3xl">Cả bàn mở khoá tối nay chỉ {formatCurrency(cheapest)}</p>
            <p className="mt-1 font-semibold">{VIP_HIGHLIGHTS.join(' · ')} · không cần tài khoản</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Link href="/vip" className={buttonStyles({ size: 'lg', variant: 'secondary', className: 'border-2 border-[#12121a] bg-[#12121a] text-white hover:bg-[#12121a]/85 rounded-xl' })}>
            {isVip ? 'Quản lý gói' : 'Xem gói VIP'}
          </Link>
          {!isVip && tasteAvailable && (
            <button type="button" onClick={startTaste} className="rounded-xl border-2 border-[#12121a] px-4 py-2 font-display text-sm font-bold text-[#12121a] transition-colors hover:bg-[#12121a]/10">
              Thử miễn phí {VIP_TASTE_MINUTES} phút
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
