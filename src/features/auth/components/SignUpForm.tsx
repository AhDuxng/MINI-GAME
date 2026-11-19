// Form tạo tài khoản bằng tên hiển thị, email, mật khẩu (hoặc Google); nếu Supabase yêu cầu xác nhận email thì hướng dẫn kiểm tra hộp thư
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { FaEnvelopeCircleCheck } from 'react-icons/fa6';
import Button from '@/shared/ui/Button';
import { browserSupabase } from '@/shared/supabase/browser';
import { BACKEND_MISSING_MESSAGE, authErrorMessage } from '../auth-errors';
import { MIN_PASSWORD_LENGTH, callbackUrl, safeNext } from '../auth-helpers';
import FormField from './FormField';
import GoogleButton from './GoogleButton';

export default function SignUpForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');

  const update = (field: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.password.length < MIN_PASSWORD_LENGTH) return setError(`Mật khẩu cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`);
    if (form.password !== form.confirm) return setError('Hai mật khẩu chưa khớp.');
    const supabase = browserSupabase();
    if (!supabase) {
      setError(BACKEND_MISSING_MESSAGE);
      return;
    }

    setBusy(true);
    setError('');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { display_name: form.name.trim() }, emailRedirectTo: callbackUrl(next) },
    });
    setBusy(false);

    if (signUpError) return setError(authErrorMessage(signUpError));
    if (data.session) {
      router.replace(next);
      router.refresh();
      return;
    }
    setSentTo(form.email.trim());
  };

  if (sentTo) {
    return (
      <div className="space-y-3 text-center">
        <FaEnvelopeCircleCheck className="mx-auto h-12 w-12 text-ramp-text-8" />
        <p className="font-display text-xl font-bold text-ink">Kiểm tra hộp thư của bạn</p>
        <p className="text-sm text-muted">
          Chúng tôi đã gửi link xác nhận tới <strong className="text-ink">{sentTo}</strong>. Bấm vào link để kích hoạt tài khoản rồi quay lại mua gói.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleButton next={next} />
      <form onSubmit={submit} className="space-y-4">
        <FormField label="Tên hiển thị" autoComplete="nickname" required maxLength={40} value={form.name} onChange={update('name')} />
        <FormField label="Email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} />
        <FormField
          label={`Mật khẩu (ít nhất ${MIN_PASSWORD_LENGTH} ký tự)`}
          type="password"
          autoComplete="new-password"
          required
          value={form.password}
          onChange={update('password')}
        />
        <FormField label="Nhập lại mật khẩu" type="password" autoComplete="new-password" required value={form.confirm} onChange={update('confirm')} />
        {error && (
          <p role="alert" className="text-sm font-semibold text-ramp-text-3">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </Button>
      </form>
      <p className="text-center text-sm font-semibold text-muted">
        Đã có tài khoản?{' '}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="inline-flex min-h-10 items-center text-ramp-text-3 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
