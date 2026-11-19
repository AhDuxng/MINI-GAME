// Trang đặt mật khẩu mới
import type { Metadata } from 'next';
import { AuthCard, ResetPasswordForm } from '@/features/auth';

export const metadata: Metadata = { title: 'Đặt mật khẩu mới' };

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Đặt mật khẩu mới" subtitle="Chọn mật khẩu mới cho tài khoản của bạn.">
      <ResetPasswordForm />
    </AuthCard>
  );
}
