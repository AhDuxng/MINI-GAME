// Hộp thoại mời nâng cấp VIP dùng chung, mở ra đúng lúc người chơi chạm vào thứ bị khoá; phần nội dung chỉ được tải khi hộp thoại mở lần đầu
'use client';

import dynamic from 'next/dynamic';
import Modal from '@/shared/ui/Modal';
import { usePaywallReason, usePremium } from '../PremiumContext';

const PaywallBody = dynamic(() => import('./PaywallBody'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-xl bg-elevated" />,
});

export default function PaywallModal() {
  const paywallReason = usePaywallReason();
  const { closePaywall } = usePremium();

  return (
    <Modal open={paywallReason !== null} onClose={closePaywall} label="Nâng cấp VIP">
      <PaywallBody />
    </Modal>
  );
}
