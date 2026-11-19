// Giả lập tiền về cho một đơn khi phát triển (chỉ bật bằng PAYMENT_DEV_SIMULATION=true và không chạy ở production), đi qua đúng hàm settle_payment như webhook thật
import { NextResponse } from 'next/server';
import { bodyErrorResponse, errorResponse } from '@/shared/lib/api-response';
import { readJsonBody } from '@/shared/lib/request-body';
import { adminEnabled, adminSupabase } from '@/shared/supabase/admin';
import { serverSupabase } from '@/shared/supabase/server';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' || process.env.PAYMENT_DEV_SIMULATION !== 'true' || !adminEnabled()) {
    return errorResponse(404, 'Không tìm thấy.');
  }

  const supabase = serverSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return errorResponse(401, 'Bạn cần đăng nhập.');

  const body = await readJsonBody(request, 1024);
  if (!body.ok) return bodyErrorResponse(body.status);
  const code = (body.value as { code?: unknown } | null)?.code;
  const { data: order } = await supabase.from('orders').select('code, amount').eq('code', typeof code === 'string' ? code : '').maybeSingle();
  if (!order) return errorResponse(404, 'Không tìm thấy đơn hàng.');

  const { data, error } = await adminSupabase().rpc('settle_payment', {
    p_transaction_id: -Date.now(),
    p_order_code: order.code,
    p_amount: order.amount,
    p_payload: { simulated: true },
  });
  if (error) return errorResponse(500, error.message);
  return NextResponse.json({ result: data });
}
