// Luồng mua gói VIP: vé 9k mua ngay bằng phiên khách không cần tài khoản (nếu project Supabase chưa bật khách ẩn danh thì chuyển sang yêu cầu đăng nhập), gói tháng và trọn đời cần đăng nhập và được trừ tiền vé vừa mua; tạo đơn trên máy chủ, hiển thị mã VietQR và nội dung chuyển khoản, tự kiểm tra đến khi SePay báo tiền về thì kích hoạt gói
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCircleCheck, FaCopy, FaCrown, FaSpinner } from 'react-icons/fa6';
import Button, { buttonStyles } from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import { useAuth, useAuthOptions } from '@/features/auth';
import { usePremium } from '../PremiumContext';
import { GAMES, gameHref } from '@/features/catalog';
import { createOrder, fetchOrder, simulatePayment } from '../payment-client';
import type { CreateOrderResponse } from '../payment-types';
import { checkoutHref, HERO_PLAN_ID, PLANS, getPlan, isPlanId, priceAfterCredit } from '../plans';
import { backendEnabled, paymentSimulationEnabled } from '@/shared/supabase/config';
import { safeInternalPath } from '@/shared/lib/safe-path';
import { cn, formatCurrency } from '@/shared/lib/utils';

const FAST_POLL_MS = 3000;
const SLOW_POLL_MS = 10000;
const FAST_POLL_FOR_MS = 2 * 60 * 1000;
const POLL_GRACE_MS = 15 * 60 * 1000;

type Step = 'select' | 'creating' | 'waiting' | 'paid';

function CopyRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-b-0">
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        <p className={cn('truncate font-display font-bold text-ink', emphasis ? 'text-2xl text-ramp-text-3' : 'text-lg')}>{value}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={copy} aria-label={`Chép ${label.toLowerCase()}`}>
        <FaCopy className="h-3.5 w-3.5" />
        {copied ? 'Đã chép' : 'Chép'}
      </Button>
    </div>
  );
}

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const left = Math.max(0, new Date(expiresAt).getTime() - now);
  if (left === 0) return <span>Mã đã quá hạn hiển thị; nếu bạn đã chuyển khoản, gói vẫn được kích hoạt khi tiền về.</span>;
  const minutes = Math.floor(left / 60000);
  const seconds = Math.floor((left % 60000) / 1000);
  return (
    <span>
      Mã còn hiệu lực {minutes}:{String(seconds).padStart(2, '0')}
    </span>
  );
}

export default function Checkout() {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get('plan');
  const backTo = safeInternalPath(params.get('from'), null, '/game/');
  const planId = isPlanId(requested) ? requested : HERO_PLAN_ID;
  const plan = getPlan(planId);
  const { user, sessionUser, ready, startGuest } = useAuth();
  const authOptions = useAuthOptions();
  const { membership, refreshMembership, upgradeCredit } = usePremium();
  const price = priceAfterCredit(plan, user ? upgradeCredit : 0);
  const guestAllowed = authOptions?.anonymous !== false || sessionUser !== null;
  const needsLogin = !user && (plan.needsAccount || !guestAllowed);
  const guestBuying = !user && !needsLogin;
  const [step, setStep] = useState<Step>('select');
  const [checkout, setCheckout] = useState<CreateOrderResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step !== 'waiting' || !checkout) return;
    const startedAt = Date.now();
    const stopAt = new Date(checkout.order.expiresAt).getTime() + POLL_GRACE_MS;
    let timer = 0;
    let active = true;
    const poll = async () => {
      if (document.visibilityState === 'visible') {
        const order = await fetchOrder(checkout.order.code).catch(() => null);
        if (!active) return;
        if (order?.status === 'paid') {
          await refreshMembership();
          setStep('paid');
          return;
        }
      }
      if (Date.now() > stopAt) return;
      timer = window.setTimeout(poll, Date.now() - startedAt < FAST_POLL_FOR_MS ? FAST_POLL_MS : SLOW_POLL_MS);
    };
    timer = window.setTimeout(poll, FAST_POLL_MS);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [step, checkout, refreshMembership]);

  const start = async () => {
    setStep('creating');
    setError('');
    try {
      if (guestBuying && !sessionUser && !(await startGuest())) throw new Error('Chưa mua nhanh được, hãy đăng nhập để tiếp tục.');
      setCheckout(await createOrder(planId));
      setStep('waiting');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Không tạo được đơn hàng.');
      setStep('select');
    }
  };

  const simulate = async () => {
    if (!checkout) return;
    await simulatePayment(checkout.order.code).catch((failure: Error) => setError(failure.message));
  };

  if (!backendEnabled) {
    return <p className="surface p-6 text-ink">Thanh toán chưa được cấu hình trên máy chủ. Xem hướng dẫn trong docs/payments.md.</p>;
  }

  if (!ready || (!user && !sessionUser && !plan.needsAccount && authOptions === null)) return <p className="text-muted">Đang kiểm tra tài khoản...</p>;

  if (needsLogin) {
    const next = encodeURIComponent(checkoutHref(planId, backTo));
    return (
      <div className="surface flex flex-col items-start gap-4 p-6">
        <p className="font-display text-2xl font-bold text-ink">Đăng nhập để mua {plan.name}</p>
        <p className="text-muted">
          {plan.needsAccount
            ? `${plan.name} dài hạn nên được gắn với tài khoản: dùng được trên mọi thiết bị và không mất khi đổi máy.${guestAllowed ? ' Chỉ cần chơi tối nay thì chọn Vé Đêm Tiệc, không cần tài khoản.' : ''}`
            : 'Vé sẽ gắn với tài khoản của bạn nên không mất khi đổi máy hay xoá dữ liệu trình duyệt. Tạo tài khoản chỉ mất vài giây.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href={`/login?next=${next}`} className={buttonStyles({ size: 'lg' })}>
            Đăng nhập
          </Link>
          <Link href={`/signup?next=${next}`} className={buttonStyles({ size: 'lg', variant: 'secondary' })}>
            Tạo tài khoản
          </Link>
          {guestAllowed && plan.needsAccount && (
            <Link href={checkoutHref(HERO_PLAN_ID, backTo)} className={buttonStyles({ size: 'lg', variant: 'ghost' })}>
              Mua Vé Đêm Tiệc không cần tài khoản
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (step === 'paid') {
    return (
      <div className="surface flex flex-col items-center gap-4 px-6 py-12 text-center">
        <FaCircleCheck className="h-14 w-14 text-ramp-text-8" />
        <p className="font-display text-3xl font-extrabold text-ink">Thanh toán thành công!</p>
        <p className="text-muted">
          {membership ? getPlan(membership.planId).name : plan.name} ·{' '}
          {membership?.expiresAt ? `dùng đến ${new Date(membership.expiresAt).toLocaleString('vi-VN')}` : 'không giới hạn thời gian'}
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {backTo && (
            <Link href={backTo} className={buttonStyles({ size: 'lg' })}>
              Quay lại chơi tiếp
            </Link>
          )}
          {GAMES.filter((game) => game.vip).slice(0, backTo ? 1 : 2).map((game) => (
            <Link key={game.slug} href={gameHref(game.slug)} className={buttonStyles({ size: 'lg', variant: backTo ? 'secondary' : 'primary' })}>
              Chơi {game.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {step !== 'waiting' && (
          <Panel title="1. Chọn gói" stop={1}>
            <div className="grid gap-2 sm:grid-cols-3">
              {PLANS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => router.replace(checkoutHref(item.id, backTo), { scroll: false })}
                  className={cn('border-2 p-3 text-left transition-colors rounded-xl', item.id === planId ? 'border-edge bg-elevated' : 'border-line hover:bg-elevated')}
                >
                  <span className="block font-display text-base font-bold text-ink">{item.name}</span>
                  <span className="block text-sm font-semibold text-muted">
                    {formatCurrency(priceAfterCredit(item, user ? upgradeCredit : 0))} / {item.period}
                  </span>
                  <span className="mt-1 block text-xs font-bold text-ramp-text-1">{item.badge}</span>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {step === 'waiting' && checkout && (
          <Panel title="2. Quét mã để chuyển khoản" stop={7}>
            <div className="grid items-start gap-6 sm:grid-cols-[240px_1fr]">
              <div className="space-y-2">
                <div className="border-2 border-edge bg-white p-2 rounded-xl">
                  <Image src={checkout.payment.qrUrl} alt="Mã VietQR thanh toán" width={480} height={480} unoptimized referrerPolicy="no-referrer" className="h-auto w-full" />
                </div>
                <p className="text-center text-xs text-muted">Mở app ngân hàng bất kỳ và quét mã</p>
              </div>
              <div>
                <CopyRow label="Số tiền" value={formatCurrency(checkout.payment.amount)} emphasis />
                <CopyRow label="Nội dung chuyển khoản" value={checkout.payment.transferNote} emphasis />
                <CopyRow label="Số tài khoản" value={checkout.payment.accountNumber} />
                <div className="border-b border-line py-2.5">
                  <p className="eyebrow">Ngân hàng · Chủ tài khoản</p>
                  <p className="font-display text-lg font-bold text-ink">
                    {checkout.payment.bank}
                    {checkout.payment.accountName && ` · ${checkout.payment.accountName}`}
                  </p>
                </div>
                <p className="mt-4 border-l-4 border-ramp-1 bg-elevated px-3 py-2 text-sm text-ink">
                  Giữ nguyên <strong>nội dung chuyển khoản</strong> để hệ thống tự nhận ra đơn của bạn.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm font-semibold text-muted">
              <span className="flex items-center gap-2 text-ink">
                <FaSpinner className="h-4 w-4 animate-spin" />
                Đang chờ tiền về...
              </span>
              <Countdown expiresAt={checkout.order.expiresAt} />
            </div>
            {paymentSimulationEnabled && (
              <Button variant="secondary" size="sm" className="mt-4" onClick={simulate}>
                Giả lập tiền về (chỉ khi phát triển)
              </Button>
            )}
          </Panel>
        )}

        {error && (
          <p role="alert" className="border border-ramp-3 bg-elevated p-4 text-sm font-semibold text-ramp-text-3 rounded-xl">
            {error}
          </p>
        )}
      </div>

      <aside className="surface h-fit p-5">
        <p className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <FaCrown className="h-4 w-4 text-ramp-text-1" /> Tóm tắt đơn
        </p>
        <div className="mt-4 flex justify-between border-b border-line pb-3 text-sm font-semibold">
          <span className="text-muted">{plan.name}</span>
          <span className="text-ink">{plan.period}</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <span className="text-sm font-semibold text-muted">Tổng cộng</span>
          <span className="font-display text-3xl font-extrabold text-ink">{formatCurrency(checkout?.payment.amount ?? price)}</span>
        </div>
        {price < plan.price && (
          <p className="mt-2 text-sm font-semibold text-ink">
            Đã trừ <strong>{formatCurrency(plan.price - price)}</strong> từ Vé Đêm Tiệc bạn mua gần đây.
          </p>
        )}
        {guestBuying && (
          <p className="mt-2 text-sm text-muted">Không cần tài khoản: vé gắn với trình duyệt trên máy này, đừng xoá dữ liệu trang trong 24 giờ tới.</p>
        )}
        {step === 'waiting' && checkout ? (
          <p className="mt-4 text-sm text-muted">
            Mã đơn <strong className="text-ink">{checkout.order.code}</strong>. Trang sẽ tự chuyển khi nhận được tiền, thường trong vài giây đến vài phút.
          </p>
        ) : (
          <Button size="lg" className="mt-5 w-full" onClick={start} disabled={step === 'creating'}>
            {step === 'creating' ? 'Đang tạo mã...' : 'Tạo mã thanh toán'}
          </Button>
        )}
        <p className="mt-4 text-xs text-muted">Thanh toán bằng chuyển khoản ngân hàng qua VietQR. Gói trả trước một lần, không tự động gia hạn.</p>
      </aside>
    </div>
  );
}
