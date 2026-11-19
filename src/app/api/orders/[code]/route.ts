// API xem trạng thái một đơn hàng của chính người dùng (phân quyền bằng RLS), giao diện thanh toán gọi định kỳ để biết khi nào tiền về
import { NextResponse } from 'next/server';
import { errorResponse } from '@/shared/lib/api-response';
import { toOrderView, type OrderRow } from '@/features/billing/server';
import { backendEnabled } from '@/shared/supabase/config';
import { serverSupabase } from '@/shared/supabase/server';

export async function GET(_request: Request, { params }: { params: { code: string } }) {
  if (!backendEnabled) return errorResponse(503, 'Máy chủ chưa được cấu hình.');

  const supabase = serverSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return errorResponse(401, 'Bạn cần đăng nhập.');

  const { data } = await supabase
    .from('orders')
    .select('code, plan_id, amount, status, created_at, expires_at, paid_at')
    .eq('code', params.code)
    .maybeSingle<OrderRow>();

  if (!data) return errorResponse(404, 'Không tìm thấy đơn hàng.');
  return NextResponse.json({ order: toOrderView(data) }, { headers: { 'Cache-Control': 'no-store' } });
}
