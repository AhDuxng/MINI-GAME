// Tiện ích dùng chung cho form xác thực: lọc đường dẫn quay về an toàn và dựng link chuyển hướng sau xác thực
import { safeInternalPath } from '@/shared/lib/safe-path';

export function safeNext(value: string | null, fallback = '/account') {
  return safeInternalPath(value, fallback);
}

export function callbackUrl(next: string) {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

export const MIN_PASSWORD_LENGTH = 8;
