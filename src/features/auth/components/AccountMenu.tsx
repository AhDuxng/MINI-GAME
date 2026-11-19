// Nút tài khoản trên header: nút "Đăng nhập" khi chưa có tài khoản (kể cả khi máy chủ chưa cấu hình, trang đăng nhập sẽ tự báo), hoặc avatar chữ cái đầu dẫn tới trang tài khoản; bản gọn chỉ còn biểu tượng cho điện thoại
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaRightToBracket } from 'react-icons/fa6';
import { displayName, useAuth } from '../AuthContext';
import { cn } from '@/shared/lib/utils';

const AUTH_PAGES = ['/login', '/signup', '/forgot-password', '/reset-password'];

export default function AccountMenu({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { enabled, user, ready } = useAuth();
  const pathname = usePathname();

  if (enabled && !ready) return <span className={cn('h-9 w-9 animate-pulse rounded-xl bg-elevated', className)} />;

  if (!user) {
    const next = pathname && !AUTH_PAGES.includes(pathname) && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : '';
    return (
      <Link
        href={`/login${next}`}
        aria-label="Đăng nhập"
        className={cn(
          'flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-line font-display text-sm font-bold text-ink transition-colors hover:bg-elevated',
          compact ? 'w-9' : 'px-3',
          className,
        )}
      >
        <FaRightToBracket className="h-3.5 w-3.5" />
        {!compact && 'Đăng nhập'}
      </Link>
    );
  }

  const name = displayName(user);
  return (
    <Link href="/account" title={name} className={cn('flex h-9 items-center gap-2 transition-opacity hover:opacity-80', className)}>
      <span className="fill-ramp flex h-9 w-9 items-center justify-center rounded-lg font-display text-base font-extrabold uppercase">{name.charAt(0)}</span>
      {!compact && <span className="hidden max-w-[120px] truncate text-sm font-bold text-ink xl:block">{name}</span>}
    </Link>
  );
}
