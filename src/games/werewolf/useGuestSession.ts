// Phiên chơi Ma Sói dựa trên phiên đăng nhập dùng chung: dùng tài khoản nếu đã đăng nhập, nếu chưa thì vào nhanh với tư cách khách ẩn danh chỉ bằng một cái tên
'use client';

import { useCallback } from 'react';
import { displayName, useAuth } from '@/features/auth';

export type SessionResult = { ok: true; userId: string } | { ok: false; error: string; needLogin: boolean };

export default function useGuestSession() {
  const { enabled, ready, user, sessionUser, startGuest } = useAuth();

  const ensureSession = useCallback(
    async (name: string): Promise<SessionResult> => {
      if (!enabled) return { ok: false, error: 'Ma Sói online chưa được bật trên máy chủ.', needLogin: false };
      const signed = await startGuest(name).catch(() => null);
      if (!signed) return { ok: false, error: 'Chưa vào nhanh được với tư cách khách, bạn hãy đăng nhập để chơi.', needLogin: true };
      return { ok: true, userId: signed.id };
    },
    [enabled, startGuest],
  );

  return { enabled, ready, userId: sessionUser?.id ?? null, accountName: user ? displayName(user) : '', ensureSession };
}
