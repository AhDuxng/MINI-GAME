// Vùng sáng của người đang thức ban đêm: Bảo Vệ chọn người che chở, bầy sói thấy nhau và thống nhất con mồi, Tiên Tri soi một người, Phù Thủy dùng bình cứu hoặc bình độc
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { GiDeathSkull, GiPotionBall, GiWolfHead } from 'react-icons/gi';
import Button from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import type { Action, NightView, PlayerView, RoomView } from '../engine/types';
import ChatBox from './ChatBox';
import PlayerGrid from './PlayerGrid';
import { Avatar } from './role-art';

interface NightActionProps {
  view: RoomView;
  night: NightView;
  busy: boolean;
  send: (action: Action) => Promise<boolean>;
}

function Hint({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-sm font-semibold text-muted">{children}</p>;
}

function GuardStep({ view, night, busy, send }: NightActionProps & { night: Extract<NightView, { step: 'guard' }> }) {
  return (
    <>
      <Hint>Chọn một người để che chở khỏi nanh sói đêm nay, có thể chọn chính mình.</Hint>
      <PlayerGrid
        dense
        players={view.players.filter((player) => player.alive)}
        selectedId={night.targetId}
        canPick={(player) => !busy && player.id !== night.blockedId}
        onPick={(player) => void send({ type: 'guard', targetId: player.id })}
        note={(player) => (player.id === night.blockedId ? <span>Đã giữ đêm qua</span> : null)}
      />
    </>
  );
}

function WolvesStep({ view, night, busy, send }: NightActionProps & { night: Extract<NightView, { step: 'wolves' }> }) {
  const me = view.me;
  const pack = view.players.filter((player) => player.alive && player.role === 'wolf');
  const myVote = me ? night.votes[me.id] ?? null : null;
  const markers: Record<string, PlayerView[]> = {};
  Object.entries(night.votes).forEach(([wolfId, targetId]) => {
    const wolf = view.players.find((player) => player.id === wolfId);
    if (wolf) markers[targetId] = [...(markers[targetId] ?? []), wolf];
  });
  const targets = new Set(Object.values(night.votes));
  const unanimous = pack.length > 0 && pack.every((wolf) => night.votes[wolf.id]) && targets.size === 1;
  const prey = unanimous ? view.players.find((player) => targets.has(player.id)) : null;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-muted">Bầy của bạn:</span>
        {pack.map((wolf) => (
          <span key={wolf.id} className="flex items-center gap-2 border-2 border-edge bg-elevated px-2 py-1 rounded-xl">
            <Avatar name={wolf.name} seat={wolf.seat} size="sm" />
            <span className="font-display text-sm font-bold text-ink">{wolf.isMe ? 'Bạn' : wolf.name}</span>
            <GiWolfHead className="h-4 w-4 text-ramp-text-3" />
          </span>
        ))}
      </div>
      <Hint>{prey ? `Cả bầy đã thống nhất cắn ${prey.name}.` : 'Chạm vào con mồi. Cả bầy cần chọn cùng một người, nếu không sẽ lấy người nhiều phiếu nhất.'}</Hint>
      <PlayerGrid
        dense
        players={view.players.filter((player) => player.alive && player.role !== 'wolf')}
        selectedId={myVote}
        markers={markers}
        canPick={() => !busy}
        onPick={(player) => void send({ type: 'wolf-vote', targetId: player.id === myVote ? null : player.id })}
      />
      <ChatBox
        title="Bàn kế của bầy sói"
        className="mt-4"
        messages={view.chat.filter((message) => message.channel === 'wolves')}
        players={view.players}
        channel={view.me?.chat ?? null}
        onSend={(text) => send({ type: 'chat', text })}
      />
    </>
  );
}

function SeerStep({ view, night, busy, send }: NightActionProps & { night: Extract<NightView, { step: 'seer' }> }) {
  const reading = night.reading;
  const target = reading ? view.players.find((player) => player.id === reading.targetId) : null;

  if (reading && target) {
    return (
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="flex flex-col items-center gap-3 border-2 border-edge p-6 text-center text-[#12121a] rounded-xl"
        style={{ background: reading.isWolf ? 'var(--ramp-3)' : 'var(--ramp-8)' }}
      >
        <Avatar name={target.name} seat={target.seat} size="lg" />
        <p className="font-display text-3xl font-extrabold leading-tight">{reading.isWolf ? `${target.name} là Ma Sói!` : `${target.name} không phải sói`}</p>
        <p className="text-sm font-semibold">Ghi nhớ kỹ, quả cầu sẽ tắt khi trời sáng.</p>
      </motion.div>
    );
  }

  return (
    <>
      <Hint>Chọn một người để soi. Bạn chỉ được soi một người mỗi đêm.</Hint>
      <PlayerGrid
        dense
        players={view.players.filter((player) => player.alive && !player.isMe)}
        canPick={() => !busy}
        onPick={(player) => void send({ type: 'seer', targetId: player.id })}
        note={(player) => {
          const past = view.seerReadings.find((item) => item.targetId === player.id);
          return past ? <span className={past.isWolf ? 'text-ramp-text-3' : 'text-ramp-text-8'}>{past.isWolf ? 'Đã soi: Sói' : 'Đã soi: Dân'}</span> : null;
        }}
      />
    </>
  );
}

function WitchStep({ view, night, busy, send }: NightActionProps & { night: Extract<NightView, { step: 'witch' }> }) {
  const [heal, setHeal] = useState(false);
  const [poisonId, setPoisonId] = useState<string | null>(null);
  const victim = view.players.find((player) => player.id === night.victimId) ?? null;
  const poisoned = view.players.find((player) => player.id === night.poisonId) ?? null;

  if (night.done) {
    return (
      <div className="flex flex-col items-center gap-2 border-2 border-line p-6 text-center rounded-xl">
        <FaCheck className="h-8 w-8 text-ramp-text-8" />
        <p className="font-display text-xl font-bold text-ink">Bạn đã quyết định cho đêm nay</p>
        <p className="text-sm text-muted">
          {night.healed && victim ? `Đã cứu ${victim.name}. ` : ''}
          {poisoned ? `Đã đầu độc ${poisoned.name}.` : ''}
          {!night.healed && !poisoned ? 'Không dùng bình nào.' : ''}
        </p>
      </div>
    );
  }

  if (!night.potions.heal && !night.potions.poison) {
    return <Hint>Bạn đã dùng hết cả hai bình. Hãy nhắm mắt chờ trời sáng.</Hint>;
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-3 border-2 border-edge bg-elevated p-3 rounded-xl">
        {victim ? <Avatar name={victim.name} seat={victim.seat} /> : <GiDeathSkull className="h-10 w-10 text-muted" />}
        <p className="flex-1 font-display text-lg font-bold text-ink">{victim ? `Đêm nay sói cắn ${victim.name}` : 'Đêm nay sói không cắn ai'}</p>
      </div>

      {night.potions.heal && victim && (
        <button
          type="button"
          aria-pressed={heal}
          onClick={() => setHeal((value) => !value)}
          className={cn('mb-4 flex w-full items-center gap-3 border-2 p-3 text-left transition-colors rounded-xl', heal ? 'border-edge bg-ramp-8/20' : 'border-line')}
        >
          <GiPotionBall className="h-8 w-8 text-ramp-text-8" />
          <span className="flex-1">
            <span className="block font-display font-bold text-ink">Bình cứu</span>
            <span className="block text-sm text-muted">Cứu sống {victim.name}, chỉ dùng được một lần cả ván.</span>
          </span>
          {heal && <FaCheck className="h-5 w-5 text-ramp-text-8" />}
        </button>
      )}

      {night.potions.poison && (
        <>
          <Hint>Bình độc: chạm một người để đầu độc, chạm lại để huỷ.</Hint>
          <PlayerGrid
            dense
            players={view.players.filter((player) => player.alive && !player.isMe)}
            selectedId={poisonId}
            canPick={() => !busy}
            onPick={(player) => setPoisonId((current) => (current === player.id ? null : player.id))}
          />
        </>
      )}

      <Button size="lg" className="mt-4 w-full" disabled={busy} onClick={() => void send({ type: 'witch', heal, poisonId })}>
        {heal || poisonId ? 'Dùng bình và đi ngủ' : 'Không dùng, đi ngủ'}
      </Button>
    </>
  );
}

export default function NightAction(props: NightActionProps) {
  const { night } = props;
  return (
    <AnimatePresence mode="wait">
      <motion.div key={night.step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
        {night.step === 'guard' && <GuardStep {...props} night={night} />}
        {night.step === 'wolves' && <WolvesStep {...props} night={night} />}
        {night.step === 'seer' && <SeerStep {...props} night={night} />}
        {night.step === 'witch' && <WitchStep {...props} night={night} />}
      </motion.div>
    </AnimatePresence>
  );
}
