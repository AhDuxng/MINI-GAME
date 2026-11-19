// Trang chủ cổng game: banner nổi bật, chơi gần đây, kho trò chơi theo thể loại, quảng bá VIP và hướng dẫn nhanh
import { Suspense } from 'react';
import { ContinuePlaying, GameBrowser, Hero, HowItWorks } from '@/features/catalog';
import { VipBanner } from '@/features/billing';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ContinuePlaying />
      <Suspense>
        <GameBrowser />
      </Suspense>
      <VipBanner />
      <HowItWorks />
    </>
  );
}
