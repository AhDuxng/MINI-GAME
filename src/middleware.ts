// Middleware làm mới phiên đăng nhập Supabase trên trang tài khoản và luồng xác thực; API không đi qua đây vì mỗi Route Handler tự đọc và làm mới phiên, tránh gọi máy chủ xác thực hai lần cho mỗi yêu cầu
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_ANON_KEY, SUPABASE_URL, backendEnabled } from '@/shared/supabase/config';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!backendEnabled) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ['/auth/:path*', '/account/:path*'],
};
