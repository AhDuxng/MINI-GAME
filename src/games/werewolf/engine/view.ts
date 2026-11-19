// Bản nhìn riêng của từng người: chỉ lộ vai của chính mình, đồng bọn sói, người đã chết (nếu bật) và mọi thứ khi ván kết thúc; ban đêm chỉ người đang thức nhận thông tin và đồng hồ của bước đêm
import { chatChannelFor, findPlayer, isAwake } from './engine';
import type { RoleId } from './roles';
import { effectiveSetup, roleCounts } from './setup';
import type { ChatMessage, GameState, NightView, Phase, Player, PlayerView, RoomView } from './types';

function canSeeRole(state: GameState, viewer: Player | null, player: Player) {
  if (state.phase.kind === 'ended') return true;
  if (viewer?.id === player.id) return true;
  if (!player.alive && state.settings.revealRoleOnDeath) return true;
  return viewer?.role === 'wolf' && player.role === 'wolf';
}

function canSeeMessage(state: GameState, viewer: Player | null, message: ChatMessage) {
  if (message.channel === 'all' || state.phase.kind === 'ended') return true;
  if (!viewer) return false;
  if (message.channel === 'wolves') return viewer.role === 'wolf';
  return !viewer.alive;
}

function nightView(state: GameState, viewer: Player | null): NightView | null {
  const { phase, night } = state;
  if (phase.kind !== 'night' || !viewer || !isAwake(state, viewer)) return null;
  switch (phase.step) {
    case 'guard':
      return { step: 'guard', targetId: night.guardTarget, blockedId: state.lastGuarded };
    case 'wolves':
      return { step: 'wolves', votes: { ...night.wolfVotes } };
    case 'seer':
      return { step: 'seer', reading: night.seerTarget ? state.seerReadings[state.seerReadings.length - 1] ?? null : null };
    case 'witch':
      return {
        step: 'witch',
        victimId: night.victim,
        potions: { ...state.potions },
        done: night.witchDone,
        healed: night.witchHeal,
        poisonId: night.witchPoison,
      };
    default:
      return null;
  }
}

function phaseFor(state: GameState, viewer: Player | null): Phase {
  const { phase } = state;
  if (phase.kind !== 'night' || isAwake(state, viewer)) return phase;
  return { ...phase, endsAt: 0 };
}

export function viewFor(state: GameState, viewerId: string | null, version: number, now: number): RoomView {
  const viewer = findPlayer(state, viewerId);
  const counts: Record<RoleId, number> = roleCounts(effectiveSetup(state.settings, state.players.length), Math.max(state.players.length, 1));

  const players: PlayerView[] = state.players.map((player, seat) => ({
    id: player.id,
    name: player.name,
    seat,
    alive: player.alive,
    isHost: player.id === state.hostId,
    isMe: player.id === viewerId,
    role: canSeeRole(state, viewer, player) ? player.role : null,
    wolfMate: viewer?.role === 'wolf' && player.role === 'wolf' && player.id !== viewer.id,
  }));

  return {
    code: state.code,
    version,
    serverNow: now,
    phase: phaseFor(state, viewer),
    round: state.round,
    settings: state.settings,
    roleCounts: counts,
    players,
    me: viewer
      ? {
          id: viewer.id,
          name: viewer.name,
          role: viewer.role,
          alive: viewer.alive,
          isHost: viewer.id === state.hostId,
          awake: isAwake(state, viewer),
          chat: chatChannelFor(state, viewer),
        }
      : null,
    night: nightView(state, viewer),
    seerReadings: viewer?.role === 'seer' || state.phase.kind === 'ended' ? state.seerReadings : [],
    ready: state.ready,
    votes: state.phase.kind === 'vote' || state.phase.kind === 'verdict' ? state.votes : {},
    events: state.events,
    chat: state.chat.filter((message) => canSeeMessage(state, viewer, message)),
  };
}
