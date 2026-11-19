// Nút đăng nhập bằng Google qua Supabase OAuth kèm vạch "hoặc" ngăn với form email; chỉ hiện khi project Supabase đã bật Google, quay về đúng trang trước đó sau khi xác thực
'use client';

import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa6';
import Button from '@/shared/ui/Button';
import { browserSupabase } from '@/shared/supabase/browser';
import { BACKEND_MISSING_MESSAGE, authErrorMessage } from '../auth-errors';
import { callbackUrl } from '../auth-helpers';
import useAuthOptions from '../useAuthOptions';
import OrDivider from './OrDivider';

export default function GoogleButton({ next }: { next: string }) {
  const options = useAuthOptions();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!options?.google) return null;

  const signIn = async () => {
    const supabase = browserSupabase();
    if (!supabase) {
      setError(BACKEND_MISSING_MESSAGE);
      return;
    }
    setBusy(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callbackUrl(next) } });
    if (oauthError) {
      setError(authErrorMessage(oauthError));
      setBusy(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Button variant="secondary" size="lg" className="w-full" onClick={signIn} disabled={busy}>
          <FaGoogle className="h-4 w-4" />
          {busy ? 'Đang chuyển tới Google...' : 'Tiếp tục với Google'}
        </Button>
        {error && <p className="text-sm font-semibold text-ramp-text-3">{error}</p>}
      </div>
      <OrDivider />
    </>
  );
}
