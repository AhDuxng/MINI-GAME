// Đích chuyển hướng sau đăng nhập Google hoặc bấm link trong email: đổi mã xác thực lấy phiên rồi đưa người dùng về trang trước đó
import { NextResponse } from 'next/server';
import { safeInternalPath } from '@/shared/lib/safe-path';
import { serverSupabase } from '@/shared/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeInternalPath(url.searchParams.get('next'), '/account');

  if (code) {
    const { error } = await serverSupabase().auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL('/login?error=auth', url.origin));
}
