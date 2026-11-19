// Trang thanh toán gói VIP
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Checkout } from '@/features/billing';

export const metadata: Metadata = { title: 'Thanh toán gói VIP' };

export default function CheckoutPage() {
  return (
    <div className="page pb-28 pt-8 md:py-12">
      <h1 className="mb-6 font-display text-3xl font-extrabold text-ink md:text-4xl">Thanh toán gói VIP</h1>
      <Suspense>
        <Checkout />
      </Suspense>
    </div>
  );
}
