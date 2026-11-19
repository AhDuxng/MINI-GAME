// API một phòng Ma Sói: GET trả bản nhìn riêng của người hỏi (người chưa vào phòng vẫn xem được sảnh để tham gia qua link mời, tự chuyển pha khi hết giờ), POST nhận hành động của người chơi; cả hai đều chặn gọi quá dày và dò mã phòng
import { NextResponse } from 'next/server';
import { normalizeRoomCode, parseAction, performAction, readRoomView } from '@/games/werewolf/server';
import { bodyErrorResponse, errorResponse, tooManyRequests } from '@/shared/lib/api-response';
import { allowRequest, clientIp } from '@/shared/lib/rate-limit';
import { readJsonBody } from '@/shared/lib/request-body';
import { adminEnabled } from '@/shared/supabase/admin';
import { serverSupabase } from '@/shared/supabase/server';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };
const MINUTE_MS = 60 * 1000;
const ACTION_WINDOW_MS = 10 * 1000;

interface RouteContext {
  params: { code: string };
}

export async function GET(request: Request, { params }: RouteContext) {
  if (!adminEnabled()) return errorResponse(503, 'Ma Sói online chưa được bật trên máy chủ.');
  const ip = clientIp(request);
  if (!allowRequest(`rooms:read:ip:${ip}`, 600, MINUTE_MS)) return tooManyRequests();
  const code = normalizeRoomCode(params.code);
  if (!code) return errorResponse(404, 'Mã phòng không hợp lệ.');

  const { data } = await serverSupabase().auth.getUser();
  try {
    const result = await readRoomView(code, data.user?.id ?? null);
    if (!result) {
      if (!allowRequest(`rooms:missing:ip:${ip}`, 30, MINUTE_MS)) return tooManyRequests();
      return errorResponse(404, 'Không tìm thấy phòng, có thể phòng đã hết hạn.');
    }
    return NextResponse.json(result, { headers: NO_STORE });
  } catch {
    return errorResponse(500, 'Không tải được phòng, vui lòng thử lại.');
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  if (!adminEnabled()) return errorResponse(503, 'Ma Sói online chưa được bật trên máy chủ.');
  const code = normalizeRoomCode(params.code);
  if (!code) return errorResponse(404, 'Mã phòng không hợp lệ.');

  const { data } = await serverSupabase().auth.getUser();
  if (!data.user) return errorResponse(401, 'Hãy nhập tên để vào chơi.');
  if (!allowRequest(`rooms:act:user:${data.user.id}`, 20, ACTION_WINDOW_MS)) return tooManyRequests();

  const body = await readJsonBody(request, 4 * 1024);
  if (!body.ok) return bodyErrorResponse(body.status);
  const action = parseAction(body.value);
  if (!action) return errorResponse(400, 'Hành động không hợp lệ.');

  try {
    const outcome = await performAction(code, data.user.id, action);
    if (!outcome.ok) return errorResponse(outcome.status, outcome.message);
    return NextResponse.json({ view: outcome.view, advanced: true }, { headers: NO_STORE });
  } catch {
    return errorResponse(500, 'Máy chủ đang bận, vui lòng thử lại.');
  }
}
