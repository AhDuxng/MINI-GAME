// Trạng thái gói VIP của tài khoản đang đăng nhập: tên gói và thời hạn, lấy từ máy chủ
'use client';

import { FaCrown } from 'react-icons/fa6';
import { usePremium } from '../PremiumContext';
import { getPlan } from '../plans';

export default function MembershipStatus() {
  const { isVip, membership, ready } = usePremium();
  if (!ready || !isVip || !membership) return null;

  return (
    <div className="flex items-center gap-3 border-2 border-ramp-8 bg-[color-mix(in_srgb,var(--ramp-8)_14%,transparent)] p-5 rounded-xl">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-ramp-8 text-[#12121a] rounded-lg">
        <FaCrown className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-lg font-bold text-ink">Bạn đang dùng {getPlan(membership.planId).name}</p>
        <p className="text-sm text-muted">
          {membership.expiresAt ? `Hết hạn ${new Date(membership.expiresAt).toLocaleString('vi-VN')}` : 'Không giới hạn thời gian'}
        </p>
      </div>
    </div>
  );
}
