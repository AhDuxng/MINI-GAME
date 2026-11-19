// API tạo đơn mua gói VIP: đọc thân yêu cầu có giới hạn, chặn gọi quá dày theo người dùng và IP, xác định phiên (khách chỉ được mua vé 9k) rồi giao cho nghiệp vụ tạo đơn ở billing/server
import { NextResponse } from 'next/server';
import { bodyErrorResponse, errorResponse, tooManyRequests } from '@/shared/lib/api-response';
import { allowRequest, clientIp } from '@/shared/lib/rate-limit';
import { readJsonBody } from '@/shared/lib/request-body';
import { createOrderFor, getPlan, isPlanId, paymentConfigured } from '@/features/billing/server';
import { adminEnabled } from '@/shared/supabase/admin';
import { serverSupabase } from '@/shared/supabase/server';

const HOUR_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  if (!adminEnabled() || !paymentConfigured()) return errorResponse(503, 'Thanh toán chưa được cấu hình.');
  if (!allowRequest(`orders:ip:${clientIp(request)}`, 30, HOUR_MS)) return tooManyRequests();

  const body = await readJsonBody(request, 1024);
  if (!body.ok) return bodyErrorResponse(body.status);
  const planId = (body.value as { planId?: unknown } | null)?.planId;
  if (typeof planId !== 'string' || !isPlanId(planId)) return errorResponse(400, 'Gói không hợp lệ.');

  const { data: auth } = await serverSupabase().auth.getUser();
  if (!auth.user) return errorResponse(401, getPlan(planId).needsAccount ? 'Bạn cần đăng nhập để mua gói này.' : 'Phiên mua hàng đã hết, hãy tải lại trang.');
  if (!allowRequest(`orders:user:${auth.user.id}`, 10, HOUR_MS)) return tooManyRequests();

  const result = await createOrderFor({ id: auth.user.id, isAnonymous: auth.user.is_anonymous === true }, planId);
  if (!result.ok) return errorResponse(result.status, result.message);
  return NextResponse.json(result.response, { status: 201 });
}
