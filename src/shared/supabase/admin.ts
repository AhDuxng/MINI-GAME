// Supabase client quyền quản trị (service role) chỉ dùng trong Route Handler: tạo đơn hàng, ghi nhận thanh toán, lưu phòng Ma Sói; tạo một lần cho mỗi tiến trình máy chủ, không bao giờ gửi xuống trình duyệt, và cho API biết đã có khoá quản trị chưa để báo "chưa cấu hình" thay vì lỗi 500
import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, backendEnabled } from './config';

let client: SupabaseClient | null = null;

export function adminEnabled() {
  return backendEnabled && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function adminSupabase() {
  if (client) return client;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !serviceKey) throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY');
  client = createClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
