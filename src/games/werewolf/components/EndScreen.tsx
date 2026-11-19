// Màn kết thúc ván: tuyên bố phe thắng, lật vai của cả làng, nhật ký trận và nút mở ván mới cho chủ phòng
'use client';

import { motion } from 'framer-motion';
import { FaRotateRight } from 'react-icons/fa6';
import { GiFarmer, GiWolfHowl } from 'react-icons/gi';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import { ActionBar } from '@/games/kit';
import { TEAM_NAMES, ROLES } from '../engine/roles';
import type { Action, RoomView } from '../engine/types';
import PlayerGrid from './PlayerGrid';

interface EndScreenProps {
  view: RoomView;
  busy: boolean;
  send: (action: Action) => Promise<boolean>;
  onLeave: () => void;
}

export default function EndScreen({ view, busy, send, onLeave }: EndScreenProps) {
  if (view.phase.kind !== 'ended') return null;
  const winner = view.phase.winner;
  const Icon = winner === 'wolves' ? GiWolfHowl : GiFarmer;
  const myTeam = view.me?.role ? ROLES[view.me.role].team : null;
  const verdict = myTeam === null ? '' : myTeam === winner ? 'Bạn đã thắng!' : 'Bạn đã thua, ván sau phục thù nhé.';

  return (
    <>
      <motion.section
        initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative flex flex-col items-center gap-3 overflow-hidden border-2 border-edge px-6 py-10 text-center text-[#12121a] rounded-2xl"
        style={{ background: winner === 'wolves' ? 'linear-gradient(135deg, var(--ramp-3), var(--ramp-5))' : 'linear-gradient(135deg, var(--ramp-0), var(--ramp-8))' }}
      >
        <span className="dot-screen absolute inset-0 opacity-40" />
        <motion.span initial={{ y: -20 }} animate={{ y: [0, -8, 0] }} transition={{ duration: 2.4, repeat: Infinity }} className="relative">
          <Icon className="h-20 w-20" />
        </motion.span>
        <p className="relative font-display text-4xl font-extrabold leading-tight sm:text-5xl">{TEAM_NAMES[winner]} chiến thắng!</p>
        {verdict && <p className="relative text-lg font-bold">{verdict}</p>}
      </motion.section>

      <Panel title="Vai thật của cả làng" stop={5}>
        <PlayerGrid players={view.players} />
      </Panel>

      <ActionBar>
        {view.me?.isHost ? (
          <Button size="lg" disabled={busy} onClick={() => void send({ type: 'restart' })}>
            <FaRotateRight className="h-4 w-4" /> Chơi ván mới
          </Button>
        ) : (
          <span className="flex items-center justify-center text-center text-sm font-semibold text-muted">Chờ chủ phòng mở ván mới...</span>
        )}
        <Button size="lg" variant="secondary" onClick={onLeave}>
          Về sảnh
        </Button>
      </ActionBar>
    </>
  );
}
