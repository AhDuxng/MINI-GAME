// Kiểu dữ liệu của một phòng Ma Sói: trạng thái đầy đủ chỉ máy chủ giữ, các hành động người chơi gửi lên và bản nhìn riêng của từng người
import type { NightStep, RoleId, Team } from './roles';

export interface RoleSetup {
  wolves: number;
  seer: boolean;
  guard: boolean;
  witch: boolean;
  hunter: boolean;
}

export interface RoomSettings {
  autoRoles: boolean;
  roles: RoleSetup;
  discussionSeconds: number;
  revealRoleOnDeath: boolean;
}

export interface Player {
  id: string;
  name: string;
  alive: boolean;
  role: RoleId | null;
}

export type Phase =
  | { kind: 'lobby' }
  | { kind: 'reveal'; endsAt: number }
  | { kind: 'night'; step: NightStep; endsAt: number }
  | { kind: 'hunter'; hunterId: string; next: 'day' | 'night'; endsAt: number }
  | { kind: 'day'; endsAt: number }
  | { kind: 'vote'; endsAt: number }
  | { kind: 'verdict'; lynchedId: string | null; endsAt: number }
  | { kind: 'ended'; winner: Team };

export type PhaseKind = Phase['kind'];

export interface NightState {
  guardTarget: string | null;
  wolfVotes: Record<string, string>;
  victim: string | null;
  seerTarget: string | null;
  witchDone: boolean;
  witchHeal: boolean;
  witchPoison: string | null;
}

export interface SeerReading {
  round: number;
  targetId: string;
  isWolf: boolean;
}

export type GameEvent =
  | { kind: 'night'; round: number; deaths: string[] }
  | { kind: 'lynch'; round: number; targetId: string | null; tally: Record<string, number> }
  | { kind: 'shot'; round: number; hunterId: string; targetId: string | null };

export type ChatChannel = 'all' | 'wolves' | 'dead';

export interface ChatMessage {
  id: number;
  at: number;
  from: string;
  channel: ChatChannel;
  text: string;
}

export interface GameState {
  code: string;
  hostId: string;
  createdAt: number;
  settings: RoomSettings;
  players: Player[];
  phase: Phase;
  round: number;
  night: NightState;
  lastGuarded: string | null;
  potions: { heal: boolean; poison: boolean };
  seerReadings: SeerReading[];
  ready: string[];
  votes: Record<string, string>;
  events: GameEvent[];
  chat: ChatMessage[];
  chatSeq: number;
  kicked?: string[];
}

export const SKIP_VOTE = 'skip';

export type Action =
  | { type: 'join'; name: string }
  | { type: 'leave' }
  | { type: 'kick'; playerId: string }
  | { type: 'settings'; settings: RoomSettings }
  | { type: 'start' }
  | { type: 'ready'; ready: boolean }
  | { type: 'skip' }
  | { type: 'guard'; targetId: string }
  | { type: 'wolf-vote'; targetId: string | null }
  | { type: 'seer'; targetId: string }
  | { type: 'witch'; heal: boolean; poisonId: string | null }
  | { type: 'vote'; targetId: string }
  | { type: 'shoot'; targetId: string | null }
  | { type: 'chat'; text: string }
  | { type: 'restart' };

export interface PlayerView {
  id: string;
  name: string;
  seat: number;
  alive: boolean;
  isHost: boolean;
  isMe: boolean;
  role: RoleId | null;
  wolfMate: boolean;
}

export type NightView =
  | { step: 'guard'; targetId: string | null; blockedId: string | null }
  | { step: 'wolves'; votes: Record<string, string> }
  | { step: 'seer'; reading: SeerReading | null }
  | { step: 'witch'; victimId: string | null; potions: { heal: boolean; poison: boolean }; done: boolean; healed: boolean; poisonId: string | null };

export interface MeView {
  id: string;
  name: string;
  role: RoleId | null;
  alive: boolean;
  isHost: boolean;
  awake: boolean;
  chat: ChatChannel | null;
}

export interface RoomView {
  code: string;
  version: number;
  serverNow: number;
  phase: Phase;
  round: number;
  settings: RoomSettings;
  roleCounts: Record<RoleId, number>;
  players: PlayerView[];
  me: MeView | null;
  night: NightView | null;
  seerReadings: SeerReading[];
  ready: string[];
  votes: Record<string, string>;
  events: GameEvent[];
  chat: ChatMessage[];
}
