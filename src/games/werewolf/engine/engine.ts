// Engine Ma Sói chạy ở máy chủ: tạo phòng, nhận hành động của từng người, tự chuyển pha theo đồng hồ và xử lý đêm, ngày, bỏ phiếu, thợ săn, thắng thua
import { NIGHT_ORDER, STEP_ROLE, type NightStep, type RoleId, type Team } from './roles';
import {
  CHAT_COOLDOWN_MS,
  CHAT_KEEP,
  CHAT_MAX,
  HUNTER_SECONDS,
  IDLE_STEP_SECONDS,
  MAX_PLAYERS,
  REVEAL_SECONDS,
  STEP_LINGER_SECONDS,
  STEP_SECONDS,
  VERDICT_SECONDS,
  VOTE_SECONDS,
  buildDeck,
  cleanName,
  defaultSettings,
  effectiveSetup,
  normalizeSettings,
  sameName,
  setupProblem,
} from './setup';
import { SKIP_VOTE, type Action, type ChatChannel, type GameState, type NightState, type Player } from './types';

export type Rng = () => number;
export type ActionResult = { ok: true; state: GameState } | { ok: false; error: string };

const seconds = (value: number) => Math.round(value * 1000);
const ok = (state: GameState): ActionResult => ({ ok: true, state });
const fail = (error: string): ActionResult => ({ ok: false, error });

function emptyNight(): NightState {
  return { guardTarget: null, wolfVotes: {}, victim: null, seerTarget: null, witchDone: false, witchHeal: false, witchPoison: null };
}

export function createGame(code: string, host: { id: string; name: string }, now: number): GameState {
  return {
    code,
    hostId: host.id,
    createdAt: now,
    settings: defaultSettings(),
    players: [{ id: host.id, name: cleanName(host.name) || 'Chủ phòng', alive: true, role: null }],
    phase: { kind: 'lobby' },
    round: 0,
    night: emptyNight(),
    lastGuarded: null,
    potions: { heal: true, poison: true },
    seerReadings: [],
    ready: [],
    votes: {},
    events: [],
    chat: [],
    chatSeq: 0,
    kicked: [],
  };
}

export function findPlayer(state: GameState, id: string | null) {
  return id ? state.players.find((player) => player.id === id) ?? null : null;
}

export function alivePlayers(state: GameState) {
  return state.players.filter((player) => player.alive);
}

function isAlive(state: GameState, id: string) {
  return findPlayer(state, id)?.alive === true;
}

function aliveWithRole(state: GameState, role: RoleId) {
  return state.players.filter((player) => player.alive && player.role === role);
}

export function winnerOf(state: GameState): Team | null {
  const alive = alivePlayers(state);
  const wolves = alive.filter((player) => player.role === 'wolf').length;
  if (wolves === 0) return 'village';
  if (wolves >= alive.length - wolves) return 'wolves';
  return null;
}

export function isAwake(state: GameState, player: Player | null) {
  if (!player?.alive || state.phase.kind !== 'night') return false;
  return player.role === STEP_ROLE[state.phase.step];
}

export function chatChannelFor(state: GameState, player: Player): ChatChannel | null {
  const { phase } = state;
  if (phase.kind === 'lobby' || phase.kind === 'ended') return 'all';
  if (!player.alive) return 'dead';
  if (phase.kind === 'night') return player.role === 'wolf' && phase.step === 'wolves' ? 'wolves' : null;
  return 'all';
}

function kill(state: GameState, id: string) {
  const player = findPlayer(state, id);
  if (player) player.alive = false;
}

function settle(state: GameState, now: number) {
  const { phase } = state;
  if (phase.kind === 'night') phase.endsAt = Math.min(phase.endsAt, now + seconds(STEP_LINGER_SECONDS[phase.step]));
}

function stepInGame(state: GameState, step: NightStep) {
  return step === 'wolves' || state.settings.roles[step];
}

function stepHasWork(state: GameState, step: NightStep) {
  if (aliveWithRole(state, STEP_ROLE[step]).length === 0) return false;
  return step !== 'witch' || state.potions.heal || state.potions.poison;
}

function idleDelay(rng: Rng) {
  const [min, max] = IDLE_STEP_SECONDS;
  return seconds(min + rng() * (max - min));
}

function enterStep(state: GameState, from: number, now: number, rng: Rng) {
  for (let index = from; index < NIGHT_ORDER.length; index++) {
    const step = NIGHT_ORDER[index];
    if (!stepInGame(state, step)) continue;
    const duration = stepHasWork(state, step) ? seconds(STEP_SECONDS[step]) : idleDelay(rng);
    state.phase = { kind: 'night', step, endsAt: now + duration };
    return;
  }
  dawn(state, now, rng);
}

function startNight(state: GameState, now: number, rng: Rng) {
  state.round += 1;
  state.night = emptyNight();
  state.ready = [];
  state.votes = {};
  enterStep(state, 0, now, rng);
}

function startDay(state: GameState, now: number) {
  state.ready = [];
  state.phase = { kind: 'day', endsAt: now + seconds(state.settings.discussionSeconds) };
}

function startVote(state: GameState, now: number) {
  state.ready = [];
  state.votes = {};
  state.phase = { kind: 'vote', endsAt: now + seconds(VOTE_SECONDS) };
}

function pickVictim(state: GameState, rng: Rng) {
  const tally = new Map<string, number>();
  aliveWithRole(state, 'wolf').forEach((wolf) => {
    const target = state.night.wolfVotes[wolf.id];
    if (target && isAlive(state, target)) tally.set(target, (tally.get(target) ?? 0) + 1);
  });
  if (tally.size === 0) return null;
  const top = Math.max(...Array.from(tally.values()));
  const leaders = Array.from(tally.entries())
    .filter(([, count]) => count === top)
    .map(([id]) => id);
  return leaders[Math.min(leaders.length - 1, Math.floor(rng() * leaders.length))];
}

function finishStep(state: GameState, now: number, rng: Rng) {
  if (state.phase.kind !== 'night') return;
  const { step } = state.phase;
  if (step === 'wolves') state.night.victim = pickVictim(state, rng);
  enterStep(state, NIGHT_ORDER.indexOf(step) + 1, now, rng);
}

function continueAfterDeaths(state: GameState, next: 'day' | 'night', now: number, rng: Rng) {
  const winner = winnerOf(state);
  if (winner) state.phase = { kind: 'ended', winner };
  else if (next === 'day') startDay(state, now);
  else startNight(state, now, rng);
}

function startHunter(state: GameState, hunterId: string, next: 'day' | 'night', now: number) {
  state.phase = { kind: 'hunter', hunterId, next, endsAt: now + seconds(HUNTER_SECONDS) };
}

function dawn(state: GameState, now: number, rng: Rng) {
  const { night } = state;
  const deaths: { id: string; byWolves: boolean }[] = [];
  if (night.victim && night.victim !== night.guardTarget && !night.witchHeal) deaths.push({ id: night.victim, byWolves: true });
  if (night.witchPoison && !deaths.some((death) => death.id === night.witchPoison)) deaths.push({ id: night.witchPoison, byWolves: false });

  state.lastGuarded = night.guardTarget;
  deaths.forEach((death) => kill(state, death.id));
  state.events.push({ kind: 'night', round: state.round, deaths: deaths.map((death) => death.id) });

  const hunter = deaths.find((death) => death.byWolves && findPlayer(state, death.id)?.role === 'hunter');
  if (hunter) startHunter(state, hunter.id, 'day', now);
  else continueAfterDeaths(state, 'day', now, rng);
}

function resolveVote(state: GameState, now: number) {
  const tally: Record<string, number> = {};
  alivePlayers(state).forEach((voter) => {
    const target = state.votes[voter.id];
    if (target) tally[target] = (tally[target] ?? 0) + 1;
  });
  const skips = tally[SKIP_VOTE] ?? 0;
  const candidates = Object.entries(tally).filter(([id]) => id !== SKIP_VOTE && isAlive(state, id));
  const top = candidates.reduce((max, [, count]) => Math.max(max, count), 0);
  const leaders = candidates.filter(([, count]) => count === top);
  const lynchedId = top > 0 && leaders.length === 1 && top > skips ? leaders[0][0] : null;

  if (lynchedId) kill(state, lynchedId);
  state.events.push({ kind: 'lynch', round: state.round, targetId: lynchedId, tally });
  state.phase = { kind: 'verdict', lynchedId, endsAt: now + seconds(VERDICT_SECONDS) };
}

function afterVerdict(state: GameState, now: number, rng: Rng) {
  if (state.phase.kind !== 'verdict') return;
  const lynched = findPlayer(state, state.phase.lynchedId);
  if (lynched?.role === 'hunter') startHunter(state, lynched.id, 'night', now);
  else continueAfterDeaths(state, 'night', now, rng);
}

function resolveHunter(state: GameState, targetId: string | null, now: number, rng: Rng) {
  if (state.phase.kind !== 'hunter') return;
  const { hunterId, next } = state.phase;
  if (targetId) kill(state, targetId);
  state.events.push({ kind: 'shot', round: state.round, hunterId, targetId });
  continueAfterDeaths(state, next, now, rng);
}

function advance(state: GameState, now: number, rng: Rng) {
  switch (state.phase.kind) {
    case 'reveal':
      startNight(state, now, rng);
      break;
    case 'night':
      finishStep(state, now, rng);
      break;
    case 'day':
      startVote(state, now);
      break;
    case 'vote':
      resolveVote(state, now);
      break;
    case 'verdict':
      afterVerdict(state, now, rng);
      break;
    case 'hunter':
      resolveHunter(state, null, now, rng);
      break;
    default:
      break;
  }
}

export function tick(current: GameState, now: number, rng: Rng = Math.random) {
  let state = current;
  let changed = false;
  for (let step = 0; step < 16; step++) {
    const { phase } = state;
    if (!('endsAt' in phase) || phase.endsAt > now) break;
    if (!changed) state = structuredClone(current);
    changed = true;
    advance(state, now, rng);
  }
  return { state, changed };
}

function resetForLobby(state: GameState) {
  state.players.forEach((player) => {
    player.alive = true;
    player.role = null;
  });
  state.phase = { kind: 'lobby' };
  state.round = 0;
  state.night = emptyNight();
  state.lastGuarded = null;
  state.potions = { heal: true, poison: true };
  state.seerReadings = [];
  state.ready = [];
  state.votes = {};
  state.events = [];
  state.chat = [];
}

function startGame(state: GameState, now: number, rng: Rng): ActionResult {
  const count = state.players.length;
  const setup = effectiveSetup(state.settings, count);
  const problem = setupProblem(setup, count);
  if (problem) return fail(problem);

  const deck = buildDeck(setup, count);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  resetForLobby(state);
  state.settings = { ...state.settings, roles: setup };
  state.players.forEach((player, index) => (player.role = deck[index]));
  state.phase = { kind: 'reveal', endsAt: now + seconds(REVEAL_SECONDS) };
  return ok(state);
}

function addChat(state: GameState, actor: Player, text: string, now: number): ActionResult {
  const channel = chatChannelFor(state, actor);
  if (!channel) return fail('Ban đêm cả làng phải ngủ, chưa thể nói chuyện.');
  const message = text.replace(/\s+/g, ' ').trim().slice(0, CHAT_MAX);
  if (!message) return fail('Tin nhắn đang trống.');
  const last = [...state.chat].reverse().find((item) => item.from === actor.id);
  if (last && now - last.at < CHAT_COOLDOWN_MS) return fail('Gõ chậm lại một chút nhé.');
  state.chatSeq += 1;
  state.chat.push({ id: state.chatSeq, at: now, from: actor.id, channel, text: message });
  if (state.chat.length > CHAT_KEEP) state.chat = state.chat.slice(-CHAT_KEEP);
  return ok(state);
}

function validTarget(state: GameState, actor: Player, targetId: string | null) {
  return targetId !== null && targetId !== actor.id && isAlive(state, targetId);
}

function nightAction(state: GameState, actor: Player, action: Action, now: number): ActionResult {
  const { phase, night } = state;
  if (phase.kind !== 'night' || !isAwake(state, actor)) return fail('Chưa tới lượt bạn thức dậy.');

  switch (action.type) {
    case 'guard': {
      if (phase.step !== 'guard') return fail('Chưa tới lượt Bảo Vệ.');
      if (!isAlive(state, action.targetId)) return fail('Người này không còn sống.');
      if (action.targetId === state.lastGuarded) return fail('Không được bảo vệ cùng một người hai đêm liền.');
      night.guardTarget = action.targetId;
      settle(state, now);
      return ok(state);
    }
    case 'wolf-vote': {
      if (phase.step !== 'wolves') return fail('Chưa tới lượt bầy sói.');
      if (action.targetId === null) {
        delete night.wolfVotes[actor.id];
        return ok(state);
      }
      const target = findPlayer(state, action.targetId);
      if (!target?.alive || target.role === 'wolf') return fail('Hãy chọn một người không phải sói và còn sống.');
      night.wolfVotes[actor.id] = target.id;
      const pack = aliveWithRole(state, 'wolf');
      if (pack.every((wolf) => night.wolfVotes[wolf.id] === target.id)) settle(state, now);
      return ok(state);
    }
    case 'seer': {
      if (phase.step !== 'seer') return fail('Chưa tới lượt Tiên Tri.');
      if (night.seerTarget) return fail('Mỗi đêm chỉ được soi một người.');
      if (!validTarget(state, actor, action.targetId)) return fail('Hãy chọn một người khác còn sống.');
      night.seerTarget = action.targetId;
      state.seerReadings.push({ round: state.round, targetId: action.targetId, isWolf: findPlayer(state, action.targetId)?.role === 'wolf' });
      settle(state, now);
      return ok(state);
    }
    case 'witch': {
      if (phase.step !== 'witch') return fail('Chưa tới lượt Phù Thủy.');
      if (night.witchDone) return fail('Bạn đã quyết định cho đêm nay.');
      if (action.heal && (!state.potions.heal || !night.victim)) return fail('Không thể dùng bình cứu lúc này.');
      if (action.poisonId && (!state.potions.poison || !validTarget(state, actor, action.poisonId))) return fail('Không thể dùng bình độc lên người này.');
      night.witchDone = true;
      night.witchHeal = action.heal;
      night.witchPoison = action.poisonId;
      if (action.heal) state.potions.heal = false;
      if (action.poisonId) state.potions.poison = false;
      settle(state, now);
      return ok(state);
    }
    default:
      return fail('Hành động không hợp lệ.');
  }
}

export function applyAction(current: GameState, actorId: string, action: Action, now: number, rng: Rng = Math.random): ActionResult {
  const state = structuredClone(current);
  const actor = findPlayer(state, actorId);
  const { phase } = state;
  const isHost = state.hostId === actorId;

  if (action.type === 'join') {
    if (phase.kind !== 'lobby') return actor ? ok(state) : fail('Ván đang diễn ra, hãy chờ ván sau.');
    if (!actor && state.kicked?.includes(actorId)) return fail('Chủ phòng đã mời bạn ra khỏi phòng này.');
    const name = cleanName(action.name);
    if (!name) return fail('Hãy nhập tên của bạn.');
    if (state.players.some((player) => player.id !== actorId && sameName(player.name, name))) return fail('Tên này đã có người dùng trong phòng.');
    if (actor) actor.name = name;
    else if (state.players.length >= MAX_PLAYERS) return fail(`Phòng đã đủ ${MAX_PLAYERS} người.`);
    else state.players.push({ id: actorId, name, alive: true, role: null });
    return ok(state);
  }

  if (!actor) return fail('Bạn chưa ở trong phòng này.');

  switch (action.type) {
    case 'leave': {
      if (phase.kind !== 'lobby') return fail('Không thể rời phòng khi ván đang diễn ra.');
      state.players = state.players.filter((player) => player.id !== actorId);
      if (isHost && state.players.length > 0) state.hostId = state.players[0].id;
      return ok(state);
    }
    case 'kick': {
      if (!isHost || phase.kind !== 'lobby') return fail('Chỉ chủ phòng mới mời người khác ra khi chưa bắt đầu.');
      if (action.playerId === actorId) return fail('Bạn không thể tự mời mình ra.');
      state.players = state.players.filter((player) => player.id !== action.playerId);
      state.kicked = Array.from(new Set([...(state.kicked ?? []), action.playerId]));
      return ok(state);
    }
    case 'settings': {
      if (!isHost || phase.kind !== 'lobby') return fail('Chỉ chủ phòng mới đổi được cài đặt trước khi bắt đầu.');
      state.settings = normalizeSettings(action.settings);
      return ok(state);
    }
    case 'start': {
      if (!isHost || phase.kind !== 'lobby') return fail('Chỉ chủ phòng mới bắt đầu được ván.');
      return startGame(state, now, rng);
    }
    case 'ready': {
      if (phase.kind === 'reveal') {
        state.ready = action.ready ? Array.from(new Set([...state.ready, actorId])) : state.ready.filter((id) => id !== actorId);
        if (state.players.every((player) => state.ready.includes(player.id))) startNight(state, now, rng);
        return ok(state);
      }
      if (phase.kind === 'day') {
        if (!actor.alive) return fail('Người đã chết không thể bỏ phiếu.');
        state.ready = action.ready ? Array.from(new Set([...state.ready, actorId])) : state.ready.filter((id) => id !== actorId);
        if (state.ready.length * 2 > alivePlayers(state).length) startVote(state, now);
        return ok(state);
      }
      return fail('Chưa tới lúc này.');
    }
    case 'skip': {
      if (!isHost) return fail('Chỉ chủ phòng mới bỏ qua được.');
      if (phase.kind === 'reveal') startNight(state, now, rng);
      else if (phase.kind === 'day') startVote(state, now);
      else return fail('Không có gì để bỏ qua lúc này.');
      return ok(state);
    }
    case 'guard':
    case 'wolf-vote':
    case 'seer':
    case 'witch':
      return nightAction(state, actor, action, now);
    case 'vote': {
      if (phase.kind !== 'vote') return fail('Chưa tới lúc bỏ phiếu.');
      if (!actor.alive) return fail('Người đã chết không thể bỏ phiếu.');
      if (action.targetId !== SKIP_VOTE && !validTarget(state, actor, action.targetId)) return fail('Hãy chọn một người khác còn sống.');
      state.votes[actorId] = action.targetId;
      if (alivePlayers(state).every((player) => state.votes[player.id])) resolveVote(state, now);
      return ok(state);
    }
    case 'shoot': {
      if (phase.kind !== 'hunter' || phase.hunterId !== actorId) return fail('Chỉ Thợ Săn vừa chết mới được bắn.');
      if (action.targetId !== null && !validTarget(state, actor, action.targetId)) return fail('Hãy chọn một người còn sống.');
      resolveHunter(state, action.targetId, now, rng);
      return ok(state);
    }
    case 'chat':
      return addChat(state, actor, action.text, now);
    case 'restart': {
      if (!isHost || phase.kind !== 'ended') return fail('Chỉ chủ phòng mới mở được ván mới sau khi kết thúc.');
      resetForLobby(state);
      return ok(state);
    }
    default:
      return fail('Hành động không hợp lệ.');
  }
}
