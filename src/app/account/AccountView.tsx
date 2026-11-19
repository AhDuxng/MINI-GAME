// Trang tài khoản: thông tin người dùng, gói VIP, lịch sử đơn hàng và cài đặt âm thanh, giao diện
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowRightFromBracket, FaKey, FaMoon, FaSun, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { MembershipStatus, usePremium, toOrderView, type OrderRow, type OrderView, getPlan } from '@/features/billing';
import Badge from '@/shared/ui/Badge';
import Button, { buttonStyles } from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import { useSound, useTheme } from '@/features/settings';
import { displayName, useAuth } from '@/features/auth';
import { browserSupabase } from '@/shared/supabase/browser';
import { formatCurrency } from '@/shared/lib/utils';

function Settings() {
  const { soundEnabled, toggleSound } = useSound();
  const { theme, toggleTheme } = useTheme();
  return (
    <Panel title="Cài đặt" stop={5}>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="secondary" size="lg" onClick={toggleSound}>
          {soundEnabled ? <FaVolumeHigh className="h-4 w-4" /> : <FaVolumeXmark className="h-4 w-4" />}
          Âm thanh: {soundEnabled ? 'Bật' : 'Tắt'}
        </Button>
        <Button variant="secondary" size="lg" onClick={toggleTheme}>
          {theme === 'dark' ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
          Giao diện: {theme === 'dark' ? 'Tối' : 'Sáng'}
        </Button>
      </div>
    </Panel>
  );
}

function OrderHistory() {
  const [orders, setOrders] = useState<OrderView[] | null>(null);

  useEffect(() => {
    browserSupabase()
      ?.from('orders')
      .select('code, plan_id, amount, status, created_at, expires_at, paid_at')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setOrders(((data as OrderRow[] | null) ?? []).map(toOrderView)));
  }, []);

  return (
    <Panel title="Lịch sử đơn hàng" stop={2}>
      {orders === null && <p className="text-sm text-muted">Đang tải...</p>}
      {orders?.length === 0 && <p className="text-sm text-muted">Bạn chưa có đơn hàng nào.</p>}
      {orders && orders.length > 0 && (
        <ul className="divide-y divide-line">
          {orders.map((order) => (
            <li key={order.code} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-display text-base font-bold text-ink">{getPlan(order.planId).name}</p>
                <p className="text-xs text-muted">
                  {order.code} · {new Date(order.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-base font-bold text-ink">{formatCurrency(order.amount)}</span>
                {order.status === 'paid' ? <Badge tone="new">Đã thanh toán</Badge> : <Badge>Chưa thanh toán</Badge>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export default function AccountView() {
  const router = useRouter();
  const { enabled, user, ready, signOut } = useAuth();
  const { isVip } = usePremium();

  if (!enabled || (ready && !user)) {
    return (
      <div className="space-y-6">
        {enabled && (
          <div className="surface flex flex-col items-start gap-4 p-6">
            <p className="font-display text-2xl font-bold text-ink">Bạn chưa đăng nhập</p>
            <p className="text-muted">Đăng nhập để mua gói VIP và dùng gói trên mọi thiết bị. Các game miễn phí không cần tài khoản.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/login" className={buttonStyles({ size: 'lg' })}>
                Đăng nhập
              </Link>
              <Link href="/signup" className={buttonStyles({ size: 'lg', variant: 'secondary' })}>
                Tạo tài khoản
              </Link>
            </div>
          </div>
        )}
        <Settings />
      </div>
    );
  }

  if (!ready || !user) return <p className="text-muted">Đang tải tài khoản...</p>;

  const name = displayName(user);
  const passwordAccount = user.app_metadata.provider === 'email';

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <section className="surface flex items-center gap-4 p-5">
          <span className="fill-ramp flex h-16 w-16 flex-shrink-0 items-center justify-center font-display text-3xl font-extrabold uppercase rounded-xl">
            {name.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-2xl font-bold text-ink">{name}</p>
            <p className="truncate text-sm text-muted">{user.email}</p>
          </div>
        </section>
        <MembershipStatus />
        {!isVip && (
          <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-elevated p-5 rounded-xl">
            <p className="font-semibold text-ink">Tài khoản đang dùng bản miễn phí.</p>
            <Link href="/vip" className={buttonStyles()}>
              Nâng cấp VIP
            </Link>
          </div>
        )}
        <OrderHistory />
      </div>
      <aside className="space-y-6">
        <Settings />
        <Panel title="Bảo mật" stop={3}>
          <div className="space-y-2">
            {passwordAccount && (
              <Link href="/reset-password" className={buttonStyles({ variant: 'secondary', className: 'w-full' })}>
                <FaKey className="h-3.5 w-3.5" />
                Đổi mật khẩu
              </Link>
            )}
            <Button
              variant="danger"
              className="w-full"
              onClick={async () => {
                await signOut();
                router.replace('/');
                router.refresh();
              }}
            >
              <FaArrowRightFromBracket className="h-3.5 w-3.5" />
              Đăng xuất
            </Button>
          </div>
        </Panel>
      </aside>
    </div>
  );
}
