// Form quên mật khẩu: gửi link đặt lại mật khẩu về email, link mở trang đổi mật khẩu sau khi xác thực
'use client';

import { useState, type FormEvent } from 'react';
import Button from '@/shared/ui/Button';
import { browserSupabase } from '@/shared/supabase/browser';
import { BACKEND_MISSING_MESSAGE, authErrorMessage } from '../auth-errors';
import { callbackUrl } from '../auth-helpers';
import FormField from './FormField';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase) {
      setError(BACKEND_MISSING_MESSAGE);
      return;
    }
    setBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: callbackUrl('/reset-password') });
    setBusy(false);
    if (resetError) return setError(authErrorMessage(resetError));
    setSent(true);
  };

  if (sent) {
    return <p className="border border-line bg-elevated p-4 text-sm text-ink rounded-xl">Nếu email này có tài khoản, link đặt lại mật khẩu đã được gửi tới hộp thư của bạn.</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormField label="Email đã đăng ký" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      {error && <p className="text-sm font-semibold text-ramp-text-3">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
      </Button>
    </form>
  );
}
