// Luật dựng ván Ma Sói: giới hạn số người, thời gian từng pha, bộ vai gợi ý theo số người, kiểm tra bộ vai hợp lệ và chuẩn hoá cài đặt phòng
import { SPECIAL_ROLES, type NightStep, type RoleId } from './roles';
import type { RoleSetup, RoomSettings } from './types';

export const MIN_PLAYERS = 5;
export const MAX_PLAYERS = 16;
export const MAX_WOLVES = 4;
export const NAME_MAX = 20;
export const CHAT_MAX = 200;
export const CHAT_KEEP = 150;
export const CHAT_COOLDOWN_MS = 700;
export const DISCUSSION_OPTIONS = [60, 120, 180, 300];

export const REVEAL_SECONDS = 20;
export const VOTE_SECONDS = 60;
export const VERDICT_SECONDS = 7;
export const HUNTER_SECONDS = 30;
export const STEP_SECONDS: Record<NightStep, number> = { guard: 25, wolves: 45, seer: 25, witch: 30 };
export const STEP_LINGER_SECONDS: Record<NightStep, number> = { guard: 1.5, wolves: 3, seer: 4, witch: 1.5 };
export const IDLE_STEP_SECONDS: [number, number] = [5, 9];

export function recommendedSetup(players: number): RoleSetup {
  const wolves = players <= 6 ? 1 : players <= 10 ? 2 : players <= 14 ? 3 : 4;
  return { wolves, seer: true, guard: players >= 6, witch: players >= 7, hunter: players >= 8 };
}

export function effectiveSetup(settings: RoomSettings, players: number) {
  return settings.autoRoles ? recommendedSetup(Math.max(players, MIN_PLAYERS)) : settings.roles;
}

export function specialCount(setup: RoleSetup) {
  return SPECIAL_ROLES.filter((role) => setup[role]).length;
}

export function roleCounts(setup: RoleSetup, players: number): Record<RoleId, number> {
  const specials = specialCount(setup);
  return {
    wolf: setup.wolves,
    seer: Number(setup.seer),
    guard: Number(setup.guard),
    witch: Number(setup.witch),
    hunter: Number(setup.hunter),
    villager: Math.max(0, players - setup.wolves - specials),
  };
}

export function setupProblem(setup: RoleSetup, players: number): string | null {
  if (players < MIN_PLAYERS) return `Cần ít nhất ${MIN_PLAYERS} người để bắt đầu.`;
  if (players > MAX_PLAYERS) return `Tối đa ${MAX_PLAYERS} người một phòng.`;
  if (setup.wolves < 1) return 'Cần ít nhất một Ma Sói.';
  if (setup.wolves * 2 >= players) return 'Số sói phải ít hơn một nửa số người chơi.';
  if (setup.wolves + specialCount(setup) > players) return 'Số vai nhiều hơn số người chơi.';
  return null;
}

export function buildDeck(setup: RoleSetup, players: number): RoleId[] {
  const counts = roleCounts(setup, players);
  return (Object.keys(counts) as RoleId[]).flatMap((role) => Array.from({ length: counts[role] }, () => role));
}

export function defaultSettings(): RoomSettings {
  return { autoRoles: true, roles: recommendedSetup(MIN_PLAYERS), discussionSeconds: 120, revealRoleOnDeath: true };
}

export function normalizeSettings(input: unknown): RoomSettings {
  const fallback = defaultSettings();
  if (!input || typeof input !== 'object') return fallback;
  const raw = input as Partial<Record<keyof RoomSettings, unknown>>;
  const roles = (raw.roles && typeof raw.roles === 'object' ? raw.roles : {}) as Partial<Record<keyof RoleSetup, unknown>>;
  const wolves = typeof roles.wolves === 'number' && Number.isFinite(roles.wolves) ? Math.round(roles.wolves) : fallback.roles.wolves;
  return {
    autoRoles: raw.autoRoles !== false,
    roles: {
      wolves: Math.min(MAX_WOLVES, Math.max(1, wolves)),
      seer: roles.seer === true,
      guard: roles.guard === true,
      witch: roles.witch === true,
      hunter: roles.hunter === true,
    },
    discussionSeconds: DISCUSSION_OPTIONS.includes(raw.discussionSeconds as number) ? (raw.discussionSeconds as number) : fallback.discussionSeconds,
    revealRoleOnDeath: raw.revealRoleOnDeath !== false,
  };
}

export function cleanName(raw: string) {
  return raw.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX);
}

export function sameName(a: string, b: string) {
  return a.localeCompare(b, 'vi', { sensitivity: 'base' }) === 0;
}
