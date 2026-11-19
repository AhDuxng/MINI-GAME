// Cấu hình Supabase lấy từ biến môi trường; khi chưa cấu hình, app vẫn chạy các game miễn phí và tắt phần tài khoản, thanh toán
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const backendEnabled = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
export const paymentSimulationEnabled = process.env.NEXT_PUBLIC_PAYMENT_DEV_SIMULATION === 'true';
