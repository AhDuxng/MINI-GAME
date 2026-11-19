// Phiên đăng nhập Supabase phía trình duyệt: thư viện Supabase chỉ được tải khi máy chủ đã cấu hình; đọc phiên từ bộ nhớ trình duyệt (không gọi mạng), tự cập nhật khi đăng nhập/đăng xuất; phiên khách ẩn danh (vào Ma Sói, mua vé 9k) không tính là đã đăng nhập nhưng vẫn giữ trong sessionUser
'use client';

import type { User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { backendEnabled } from '@/shared/supabase/config';

interface AuthContextValue {
  enabled: boolean;
  user: User | null;
  sessionUser: User | null;
  ready: boolean;
  startGuest: (displayName?: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadClient() {
  if (!backendEnabled) return null;
  const { browserSupabase } = await import('@/shared/supabase/browser');
  return browserSupabase();
}

function accountOf(user: User | null) {
  return user && !user.is_anonymous ? user : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!backendEnabled);
  const user = accountOf(sessionUser);

  useEffect(() => {
    if (!backendEnabled) return;
    let active = true;
    let unsubscribe: (() => void) | null = null;
    void loadClient().then((supabase) => {
      if (!supabase || !active) return;
      void supabase.auth.getSession().then(({ data }) => {
        if (!active) return;
        setSessionUser(data.session?.user ?? null);
        setReady(true);
      });
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setSessionUser(session?.user ?? null);
        setReady(true);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const startGuest = useCallback(async (displayName?: string) => {
    const supabase = await loadClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session.user;
    const { data: signed, error } = await supabase.auth.signInAnonymously(displayName ? { options: { data: { display_name: displayName } } } : undefined);
    if (error || !signed.user) return null;
    setSessionUser(signed.user);
    return signed.user;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = await loadClient();
    await supabase?.auth.signOut();
    setSessionUser(null);
  }, []);

  const value = useMemo(() => ({ enabled: backendEnabled, user, sessionUser, ready, startGuest, signOut }), [user, sessionUser, ready, startGuest, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return context;
}

export function displayName(user: User | null) {
  if (!user) return '';
  const metadata = user.user_metadata as { display_name?: string; full_name?: string; name?: string };
  return metadata.display_name ?? metadata.full_name ?? metadata.name ?? user.email?.split('@')[0] ?? 'Bạn';
}
