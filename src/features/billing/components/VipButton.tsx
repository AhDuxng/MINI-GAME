// Nút VIP trên thanh điều hướng: mời nâng cấp, hoặc báo đang là thành viên VIP
'use client';

import Link from 'next/link';
import { FaCrown } from 'react-icons/fa6';
import { usePremium } from '../PremiumContext';
import { cn } from '@/shared/lib/utils';

export default function VipButton({ className }: { className?: string }) {
  const { isVip } = usePremium();
  return (
    <Link
      href="/vip"
      className={cn(
        'flex h-9 items-center gap-1.5 whitespace-nowrap px-3 font-display text-sm font-bold text-[#12121a] transition-transform active:scale-95',
        isVip ? 'bg-ramp-8' : 'bg-ramp-1',
        className,
      )}
    >
      <FaCrown className="h-3.5 w-3.5" />
      {isVip ? (
        'VIP'
      ) : (
        <span>
          <span className="md:hidden xl:inline">Nâng cấp </span>VIP
        </span>
      )}
    </Link>
  );
}
