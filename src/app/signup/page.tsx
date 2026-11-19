// Trang tạo tài khoản
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthCard, SignUpForm } from '@/features/auth';

export const metadata: Metadata = { title: 'Tạo tài khoản' };

export default function SignUpPage() {
  return (
    <AuthCard title="Tạo tài khoản" subtitle="Miễn phí, chỉ cần khi bạn muốn mua gói VIP.">
      <Suspense>
        <SignUpForm />
      </Suspense>
    </AuthCard>
  );
}
