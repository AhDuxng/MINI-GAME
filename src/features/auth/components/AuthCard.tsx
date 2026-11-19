// Khung chung của các trang đăng nhập, đăng ký, quên và đổi mật khẩu; máy chủ tài khoản chưa cấu hình thì vẫn hiện form kèm lời báo
import type { ReactNode } from 'react';
import { backendEnabled } from '@/shared/supabase/config';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="page flex justify-center pb-28 pt-8 md:py-14">
      <section className="w-full max-w-md border border-line bg-canvas rounded-2xl">
        <div className="rule-ramp h-1" />
        <div className="space-y-6 p-6 sm:p-8">
          <header>
            <h1 className="font-display text-3xl font-extrabold text-ink">{title}</h1>
            {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
          </header>
          {!backendEnabled && (
            <p className="rounded-xl border border-line bg-elevated p-4 text-sm text-ink">
              Máy chủ tài khoản chưa được cấu hình nên tạm thời chưa đăng nhập được. Các game miễn phí vẫn chơi bình thường; hướng dẫn cài đặt ở docs/payments.md.
            </p>
          )}
          {children}
          {footer && <div className="border-t border-line pt-5 text-sm text-muted">{footer}</div>}
        </div>
      </section>
    </div>
  );
}
