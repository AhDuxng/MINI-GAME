// Kiểm tra dữ liệu hành động gửi từ trình duyệt trước khi đưa vào engine: sai kiểu hoặc thiếu trường thì trả về null
import { normalizeSettings } from './setup';
import type { Action } from './types';

const text = (value: unknown) => (typeof value === 'string' ? value : null);
const optionalText = (value: unknown) => (value === null || value === undefined ? null : text(value));

export function parseAction(input: unknown): Action | null {
  if (!input || typeof input !== 'object') return null;
  const body = input as Record<string, unknown>;

  switch (body.type) {
    case 'join':
      return text(body.name) === null ? null : { type: 'join', name: body.name as string };
    case 'leave':
    case 'start':
    case 'skip':
    case 'restart':
      return { type: body.type };
    case 'kick':
      return text(body.playerId) === null ? null : { type: 'kick', playerId: body.playerId as string };
    case 'settings':
      return { type: 'settings', settings: normalizeSettings(body.settings) };
    case 'ready':
      return { type: 'ready', ready: body.ready !== false };
    case 'guard':
    case 'seer':
    case 'vote':
      return text(body.targetId) === null ? null : { type: body.type, targetId: body.targetId as string };
    case 'wolf-vote':
    case 'shoot':
      return typeof body.targetId === 'string' || body.targetId === null ? { type: body.type, targetId: optionalText(body.targetId) } : null;
    case 'witch':
      return typeof body.heal === 'boolean' ? { type: 'witch', heal: body.heal, poisonId: optionalText(body.poisonId) } : null;
    case 'chat':
      return text(body.text) === null ? null : { type: 'chat', text: body.text as string };
    default:
      return null;
  }
}
