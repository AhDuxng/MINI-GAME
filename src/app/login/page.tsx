// Trang đăng nhập
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthCard, LoginForm } from '@/features/auth';

export const metadata: Metadata = { title: 'Đăng nhập' };

export default function LoginPage() {
  return (
    <AuthCard title="Đăng nhập" subtitle="Đăng nhập để mua và dùng gói VIP trên mọi thiết bị.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
