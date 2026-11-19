// Supabase client phía trình duyệt, dùng chung một instance để phiên đăng nhập đồng bộ giữa các component
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, backendEnabled } from './config';

let client: SupabaseClient | null = null;

export function browserSupabase() {
  if (!backendEnabled) return null;
  client ??= createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}
