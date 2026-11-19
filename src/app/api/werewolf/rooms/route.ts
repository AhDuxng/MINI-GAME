// API tạo phòng Ma Sói: cần có phiên (tài khoản hoặc khách ẩn danh), đọc thân có giới hạn, chặn tạo phòng hàng loạt theo người dùng và IP; người tạo trở thành chủ phòng và nhận mã phòng
import { NextResponse } from 'next/server';
import { cleanName, createRoom } from '@/games/werewolf/server';
import { bodyErrorResponse, errorResponse, tooManyRequests } from '@/shared/lib/api-response';
import { allowRequest, clientIp } from '@/shared/lib/rate-limit';
import { readJsonBody } from '@/shared/lib/request-body';
import { adminEnabled } from '@/shared/supabase/admin';
import { serverSupabase } from '@/shared/supabase/server';

const TEN_MINUTES_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  if (!adminEnabled()) return errorResponse(503, 'Ma Sói online chưa được bật trên máy chủ.');
  if (!allowRequest(`rooms:create:ip:${clientIp(request)}`, 20, TEN_MINUTES_MS)) return tooManyRequests();

  const { data } = await serverSupabase().auth.getUser();
  if (!data.user) return errorResponse(401, 'Hãy nhập tên để vào chơi.');
  if (!allowRequest(`rooms:create:user:${data.user.id}`, 5, TEN_MINUTES_MS)) return tooManyRequests();

  const body = await readJsonBody(request, 1024);
  if (!body.ok) return bodyErrorResponse(body.status);
  const rawName = (body.value as { name?: unknown } | null)?.name;
  const name = cleanName(typeof rawName === 'string' ? rawName : '');
  if (!name) return errorResponse(400, 'Hãy nhập tên của bạn.');

  try {
    const code = await createRoom({ id: data.user.id, name });
    return NextResponse.json({ code }, { status: 201 });
  } catch {
    return errorResponse(500, 'Không tạo được phòng, vui lòng thử lại.');
  }
}
