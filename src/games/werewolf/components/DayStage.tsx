// Vùng chơi ban ngày: nhận vai đầu ván, thông báo buổi sáng, thảo luận và sẵn sàng, bỏ phiếu treo cổ có đếm phiếu trực tiếp, phán quyết và phát súng của Thợ Săn
'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FaCheck, FaForwardStep } from 'react-icons/fa6';
import { GiCrossbow, GiDeathSkull, GiSunrise } from 'react-icons/gi';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import { ActionBar, GameStage } from '@/games/kit';
import { cn } from '@/shared/lib/utils';
import { ROLES } from '../engine/roles';
import { SKIP_VOTE, type Action, type PlayerView, type RoomView } from '../engine/types';
import { nameWithRole } from './EventLog';
import PlayerGrid from './PlayerGrid';
import RoleCard from './RoleCard';
import { Avatar } from './role-art';

interface DayStageProps {
  view: RoomView;
  busy: boolean;
  online: string[];
  send: (action: Action) => Promise<boolean>;
}

function Spotlight({ tone, children }: { tone: number; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, rotateX: -12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative overflow-hidden border-2 border-edge p-5 text-[#12121a] sm:p-7 rounded-xl"
      style={{ background: `linear-gradient(135deg, var(--ramp-${tone}), color-mix(in srgb, var(--ramp-${tone}) 50%, #ffffff))` }}
    >
      <span className="dot-screen absolute inset-0 opacity-40" />
      <div className="relative">{children}</div>
    </motion.section>
  );
}

function DeathList({ ids, view }: { ids: string[]; view: RoomView }) {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {ids.map((id) => {
        const player = view.players.find((item) => item.id === id);
        if (!player) return null;
        return (
          <span key={id} className="flex items-center gap-2 bg-[#12121a]/10 py-1 pl-1 pr-3">
            <Avatar name={player.name} seat={player.seat} alive={false} size="sm" />
            <span className="font-display font-bold">{player.name}</span>
            {player.role && <span className="text-sm font-semibold opacity-80">{ROLES[player.role].name}</span>}
          </span>
        );
      })}
    </div>
  );
}

function MorningNews({ view }: { view: RoomView }) {
  const night = [...view.events].reverse().find((event) => event.kind === 'night' && event.round === view.round);
  const shot = [...view.events].reverse().find((event) => event.kind === 'shot' && event.round === view.round);
  if (!night || night.kind !== 'night') return null;
  return (
    <Spotlight tone={night.deaths.length > 0 ? 2 : 0}>
      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider opacity-75">
        <GiSunrise className="h-4 w-4" /> Trời sáng
      </p>
      <p className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
        {night.deaths.length === 0 ? 'Đêm qua làng yên bình, không ai chết.' : `Đêm qua làng mất ${night.deaths.length} người.`}
      </p>
      {night.deaths.length > 0 && <DeathList ids={night.deaths} view={view} />}
      {shot && shot.kind === 'shot' && (
        <p className="mt-3 flex items-center gap-2 font-semibold">
          <GiCrossbow className="h-5 w-5" />
          {shot.targetId ? `Thợ Săn đã bắn chết ${nameWithRole(view.players, shot.targetId)}.` : 'Thợ Săn không bắn ai.'}
        </p>
      )}
    </Spotlight>
  );
}

function voteMarkers(view: RoomView) {
  const markers: Record<string, PlayerView[]> = {};
  Object.entries(view.votes).forEach(([voterId, targetId]) => {
    const voter = view.players.find((player) => player.id === voterId);
    if (voter) markers[targetId] = [...(markers[targetId] ?? []), voter];
  });
  return markers;
}

export default function DayStage({ view, busy, online, send }: DayStageProps) {
  const { phase, me } = view;
  const alive = view.players.filter((player) => player.alive);
  const mates = view.players.filter((player) => player.wolfMate);
  const iAmReady = me ? view.ready.includes(me.id) : false;
  const onlineIds = online.length > 0 ? online : undefined;

  if (phase.kind === 'reveal') {
    return (
      <>
        <GameStage theme="night" className="px-4 pb-6 pt-8 sm:px-10">
          {me?.role ? <RoleCard role={me.role} mates={mates} /> : <p className="py-16 text-center text-muted">Ván đang chia vai, bạn đang xem với tư cách khán giả.</p>}
          <p className="mt-2 text-center text-sm font-semibold text-muted">
            {view.ready.length}/{view.players.length} người đã xem vai
          </p>
        </GameStage>
        {me && (
          <ActionBar>
            <Button size="lg" variant={iAmReady ? 'secondary' : 'primary'} disabled={busy} onClick={() => void send({ type: 'ready', ready: !iAmReady })}>
              <FaCheck className="h-4 w-4" />
              {iAmReady ? 'Đã sẵn sàng' : 'Đã xem vai'}
            </Button>
            {me.isHost && (
              <Button size="lg" variant="secondary" disabled={busy} onClick={() => void send({ type: 'skip' })}>
                <FaForwardStep className="h-4 w-4" /> Cho đêm xuống
              </Button>
            )}
          </ActionBar>
        )}
      </>
    );
  }

  if (phase.kind === 'verdict') {
    const lynched = view.players.find((player) => player.id === phase.lynchedId) ?? null;
    return (
      <>
        <Spotlight tone={lynched ? 3 : 7}>
          {lynched ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <Avatar name={lynched.name} seat={lynched.seat} alive={false} size="lg" />
              <p className="font-display text-3xl font-extrabold leading-tight">Làng đã treo cổ {lynched.name}</p>
              {lynched.role && <p className="text-lg font-bold">{lynched.name} là {ROLES[lynched.role].name}</p>}
            </div>
          ) : (
            <p className="text-center font-display text-3xl font-extrabold leading-tight">Không ai bị treo cổ hôm nay</p>
          )}
        </Spotlight>
        <PlayerGrid players={view.players} online={onlineIds} markers={voteMarkers(view)} />
      </>
    );
  }

  if (phase.kind === 'hunter') {
    const hunter = view.players.find((player) => player.id === phase.hunterId);
    const isHunter = me?.id === phase.hunterId;
    return (
      <>
        <Spotlight tone={1}>
          <p className="flex items-center gap-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
            <GiCrossbow className="h-8 w-8 flex-shrink-0" />
            {isHunter ? 'Bạn là Thợ Săn! Hãy kéo theo một người' : `${hunter?.name ?? 'Thợ Săn'} là Thợ Săn và đang ngắm bắn...`}
          </p>
        </Spotlight>
        {isHunter ? (
          <>
            <PlayerGrid single players={alive.filter((player) => !player.isMe)} canPick={() => !busy} onPick={(player) => void send({ type: 'shoot', targetId: player.id })} />
            <ActionBar>
              <Button size="lg" variant="secondary" disabled={busy} onClick={() => void send({ type: 'shoot', targetId: null })}>
                Không bắn ai
              </Button>
            </ActionBar>
          </>
        ) : (
          <PlayerGrid players={view.players} online={onlineIds} />
        )}
      </>
    );
  }

  if (phase.kind === 'vote') {
    const myVote = me ? view.votes[me.id] ?? null : null;
    const voted = alive.filter((player) => view.votes[player.id]).length;
    const canVote = me?.alive === true;
    return (
      <>
        <Panel title={`Bỏ phiếu · ${voted}/${alive.length} đã chọn`} stop={3}>
          <p className="mb-3 text-sm text-muted">
            {canVote ? 'Chạm vào người bạn muốn treo cổ, có thể đổi ý tới khi hết giờ. Hoà phiếu thì không ai bị treo.' : 'Người đã chết chỉ được xem làng bỏ phiếu.'}
          </p>
          <PlayerGrid
            single
            players={view.players}
            online={onlineIds}
            selectedId={myVote}
            markers={voteMarkers(view)}
            canPick={(player) => canVote && !busy && player.alive && !player.isMe}
            onPick={canVote ? (player) => void send({ type: 'vote', targetId: player.id }) : undefined}
          />
        </Panel>
        {canVote && (
          <ActionBar>
            <Button size="lg" variant="secondary" disabled={busy} onClick={() => void send({ type: 'vote', targetId: SKIP_VOTE })} className={cn(myVote === SKIP_VOTE && 'border-2 border-edge rounded-xl')}>
              {myVote === SKIP_VOTE ? 'Đã chọn bỏ qua' : 'Bỏ qua, chưa chắc'}
              {(voteMarkers(view)[SKIP_VOTE]?.length ?? 0) > 0 && <span className="text-muted">· {voteMarkers(view)[SKIP_VOTE].length}</span>}
            </Button>
          </ActionBar>
        )}
      </>
    );
  }

  const needed = Math.floor(alive.length / 2) + 1;
  return (
    <>
      <MorningNews view={view} />
      {me && !me.alive && (
        <p className="flex items-center gap-3 border-l-4 border-edge bg-elevated px-4 py-3 text-sm font-semibold text-ink">
          <GiDeathSkull className="h-6 w-6 flex-shrink-0 text-muted" />
          Bạn đã chết, hãy giữ im lặng. Bạn vẫn xem được diễn biến và trò chuyện với các hồn ma.
        </p>
      )}
      <Panel title="Dân làng" stop={8}>
        <PlayerGrid players={view.players} online={onlineIds} note={(player) => (view.ready.includes(player.id) ? <span className="text-ramp-text-8">Sẵn sàng bỏ phiếu</span> : null)} />
      </Panel>
      {me && (me.alive || me.isHost) && (
        <ActionBar>
          {me.alive && (
            <Button size="lg" variant={iAmReady ? 'secondary' : 'primary'} disabled={busy} onClick={() => void send({ type: 'ready', ready: !iAmReady })}>
              {iAmReady ? <FaCheck className="h-4 w-4" /> : null}
              {iAmReady ? 'Đã sẵn sàng' : me.isHost ? 'Sẵn sàng' : 'Sẵn sàng bỏ phiếu'} · {view.ready.length}/{needed}
            </Button>
          )}
          {me.isHost && (
            <Button size="lg" variant="secondary" disabled={busy} onClick={() => void send({ type: 'skip' })}>
              <FaForwardStep className="h-4 w-4" /> Bỏ phiếu
            </Button>
          )}
        </ActionBar>
      )}
    </>
  );
}
