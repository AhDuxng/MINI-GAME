// Nghiệp vụ phòng Ma Sói phía máy chủ: tạo phòng, đọc bản nhìn của từng người (tự chuyển pha khi hết giờ) và áp hành động với cơ chế thử lại có giới hạn khi xung đột phiên bản; phòng cũ do pg_cron dọn
import { applyAction, createGame, tick } from '../engine/engine';
import type { Action } from '../engine/types';
import { viewFor } from '../engine/view';
import { generateRoomCode, insertRoom, loadRoom, saveRoom } from './room-store';

const MAX_ATTEMPTS = 5;
const MAX_CODE_ATTEMPTS = 6;

function backoff(attempt: number) {
  return new Promise((resolve) => setTimeout(resolve, 10 + Math.random() * 30 * (attempt + 1)));
}

export type ActionOutcome =
  | { ok: true; view: ReturnType<typeof viewFor> }
  | { ok: false; status: 400 | 404 | 409; message: string };

export async function createRoom(host: { id: string; name: string }) {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const state = createGame(generateRoomCode(), host, Date.now());
    if (await insertRoom(state)) return state.code;
  }
  throw new Error('Không tìm được mã phòng trống');
}

export async function readRoomView(code: string, viewerId: string | null) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const room = await loadRoom(code);
    if (!room) return null;
    const now = Date.now();
    const { state, changed } = tick(room.state, now);
    if (!changed) return { view: viewFor(state, viewerId, room.version, now), advanced: false };
    if (await saveRoom(state, room.version)) return { view: viewFor(state, viewerId, room.version + 1, now), advanced: true };
    await backoff(attempt);
  }
  const room = await loadRoom(code);
  return room ? { view: viewFor(room.state, viewerId, room.version, Date.now()), advanced: false } : null;
}

export async function performAction(code: string, actorId: string, action: Action): Promise<ActionOutcome> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const room = await loadRoom(code);
    if (!room) return { ok: false, status: 404, message: 'Không tìm thấy phòng, có thể phòng đã hết hạn.' };
    const now = Date.now();
    const result = applyAction(tick(room.state, now).state, actorId, action, now);
    if (!result.ok) return { ok: false, status: 400, message: result.error };
    if (await saveRoom(result.state, room.version)) return { ok: true, view: viewFor(result.state, actorId, room.version + 1, now) };
    await backoff(attempt);
  }
  return { ok: false, status: 409, message: 'Phòng đang đông người thao tác, bạn thử lại nhé.' };
}
