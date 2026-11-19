// Lưu phòng Ma Sói trong Supabase bằng quyền service role: đọc, tạo mới, ghi có kiểm tra phiên bản để hai yêu cầu cùng lúc không ghi chồng
import 'server-only';
import { randomInt } from 'node:crypto';
import { adminSupabase } from '@/shared/supabase/admin';
import type { GameState } from '../engine/types';

const TABLE = 'werewolf_rooms';
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_PATTERN = /^[A-HJKMNP-Z2-9]{5}$/;
const CODE_LENGTH = 5;
const UNIQUE_VIOLATION = '23505';

export interface StoredRoom {
  state: GameState;
  version: number;
}

export function generateRoomCode() {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');
}

export function normalizeRoomCode(raw: string) {
  const code = raw.trim().toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}

export async function loadRoom(code: string) {
  const { data, error } = await adminSupabase().from(TABLE).select('state, version').eq('code', code).maybeSingle<StoredRoom>();
  if (error) throw new Error(error.message);
  return data;
}

export async function insertRoom(state: GameState) {
  const { error } = await adminSupabase().from(TABLE).insert({ code: state.code, state, version: 1 });
  if (!error) return true;
  if (error.code === UNIQUE_VIOLATION) return false;
  throw new Error(error.message);
}

export async function saveRoom(state: GameState, version: number) {
  const { data, error } = await adminSupabase()
    .from(TABLE)
    .update({ state, version: version + 1, updated_at: new Date().toISOString() })
    .eq('code', state.code)
    .eq('version', version)
    .select('version');
  if (error) throw new Error(error.message);
  return (data ?? []).length === 1;
}
