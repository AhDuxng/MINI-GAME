// Trang quên mật khẩu
import type { Metadata } from 'next';
import { AuthCard, ForgotPasswordForm } from '@/features/auth';

export const metadata: Metadata = { title: 'Quên mật khẩu' };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Quên mật khẩu" subtitle="Nhập email để nhận link đặt lại mật khẩu.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
