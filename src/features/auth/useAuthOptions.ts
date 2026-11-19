// Đọc cấu hình đăng nhập công khai của Supabase (đã bật Google, khách ẩn danh chưa) một lần cho mỗi lần tải trang, để giao diện chỉ hiện những cách đăng nhập thật sự dùng được; đọc lỗi thì ẩn Google nhưng vẫn cho thử vào với tư cách khách vì luồng khách tự báo lỗi khi bị từ chối
'use client';

import { useEffect, useState } from 'react';
import { SUPABASE_ANON_KEY, SUPABASE_URL, backendEnabled } from '@/shared/supabase/config';

export interface AuthOptions {
  google: boolean;
  anonymous: boolean;
}

interface PublicAuthSettings {
  external?: Record<string, boolean>;
}

const NO_OPTIONS: AuthOptions = { google: false, anonymous: false };
const UNKNOWN_OPTIONS: AuthOptions = { google: false, anonymous: true };

let request: Promise<AuthOptions> | null = null;

async function loadAuthOptions(): Promise<AuthOptions> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_ANON_KEY } });
  if (!response.ok) throw new Error(`auth settings ${response.status}`);
  const { external = {} } = (await response.json()) as PublicAuthSettings;
  return { google: external.google === true, anonymous: external.anonymous_users === true };
}

function fetchAuthOptions() {
  if (!backendEnabled) return Promise.resolve(NO_OPTIONS);
  request ??= loadAuthOptions().catch(() => {
    request = null;
    return UNKNOWN_OPTIONS;
  });
  return request;
}

export default function useAuthOptions() {
  const [options, setOptions] = useState<AuthOptions | null>(null);

  useEffect(() => {
    let active = true;
    void fetchAuthOptions().then((value) => {
      if (active) setOptions(value);
    });
    return () => {
      active = false;
    };
  }, []);

  return options;
}
