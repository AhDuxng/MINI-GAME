// Form đăng nhập bằng email + mật khẩu hoặc Google, quay lại trang yêu cầu đăng nhập (ví dụ trang thanh toán) khi thành công
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Button from '@/shared/ui/Button';
import { browserSupabase } from '@/shared/supabase/browser';
import { BACKEND_MISSING_MESSAGE, authErrorMessage } from '../auth-errors';
import { safeNext } from '../auth-helpers';
import FormField from './FormField';
import GoogleButton from './GoogleButton';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get('next'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(searchParams.get('error') ? 'Phiên xác thực đã hết hạn, vui lòng đăng nhập lại.' : '');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase) {
      setError(BACKEND_MISSING_MESSAGE);
      return;
    }
    setBusy(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setError(authErrorMessage(signInError));
      setBusy(false);
      return;
    }
    router.replace(next);
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <GoogleButton next={next} />
      <form onSubmit={submit} className="space-y-4">
        <FormField label="Email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <FormField
          label="Mật khẩu"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && (
          <p role="alert" className="text-sm font-semibold text-ramp-text-3">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
      <div className="flex justify-between text-sm font-semibold">
        <Link href="/forgot-password" className="inline-flex min-h-10 items-center text-muted hover:text-ink">
          Quên mật khẩu?
        </Link>
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="inline-flex min-h-10 items-center text-ramp-text-3 hover:underline">
          Tạo tài khoản mới
        </Link>
      </div>
    </div>
  );
}
