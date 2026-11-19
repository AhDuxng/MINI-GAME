// Form đặt mật khẩu mới cho tài khoản đang đăng nhập (sau khi bấm link trong email quên mật khẩu)
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Button, { buttonStyles } from '@/shared/ui/Button';
import { useAuth } from '../AuthContext';
import { browserSupabase } from '@/shared/supabase/browser';
import { BACKEND_MISSING_MESSAGE, authErrorMessage } from '../auth-errors';
import { MIN_PASSWORD_LENGTH } from '../auth-helpers';
import FormField from './FormField';

export default function ResetPasswordForm() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (ready && !user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">Link đặt lại mật khẩu đã hết hạn hoặc bạn chưa đăng nhập.</p>
        <Link href="/forgot-password" className={buttonStyles({ size: 'lg', className: 'w-full' })}>
          Gửi lại link
        </Link>
      </div>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) return setError(`Mật khẩu cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`);
    if (password !== confirm) return setError('Hai mật khẩu chưa khớp.');
    const supabase = browserSupabase();
    if (!supabase) {
      setError(BACKEND_MISSING_MESSAGE);
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) return setError(authErrorMessage(updateError));
    router.replace('/account');
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormField label="Mật khẩu mới" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      <FormField label="Nhập lại mật khẩu mới" type="password" autoComplete="new-password" required value={confirm} onChange={(event) => setConfirm(event.target.value)} />
      {error && <p className="text-sm font-semibold text-ramp-text-3">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={busy || !ready}>
        {busy ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
      </Button>
    </form>
  );
}
