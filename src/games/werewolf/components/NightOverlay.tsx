// Màn đêm phủ toàn màn hình: cả làng chìm trong bóng tối và sao trời, người ngủ chỉ thấy lời dẫn; vai được gọi thức dậy trong vùng sáng, rung máy báo lượt, người chết trò chuyện với hồn ma
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GiGhost } from 'react-icons/gi';
import { FaHourglassHalf } from 'react-icons/fa6';
import { useSound } from '@/features/settings';
import { cn } from '@/shared/lib/utils';
import { STEP_SECONDS } from '../engine/setup';
import type { Action, RoomView } from '../engine/types';
import usePhaseClock from '../usePhaseClock';
import ChatBox from './ChatBox';
import NightAction from './NightAction';
import { STEP_NARRATION } from './PhaseBanner';
import RoleCard from './RoleCard';

const STARS = Array.from({ length: 46 }, (_, index) => ({
  x: (index * 37 + 11) % 100,
  y: (index * 61 + 7) % 100,
  size: index % 5 === 0 ? 3 : index % 3 === 0 ? 2 : 1.5,
  delay: (index % 9) * 0.45,
}));

function Sky() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,#1b2140_0%,#0a0c18_55%,#04050a_100%)]" />
      {STARS.map((star, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-[#f4f1ff]"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: star.delay }}
        />
      ))}
      <motion.div
        className="absolute right-[8%] top-[7%] h-24 w-24 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fffbe8,#f1e682_60%,#c9b956)] shadow-[0_0_80px_24px_rgba(241,230,130,0.22)] sm:h-32 sm:w-32"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-28 w-full fill-[#020308]">
        <path d="M0 80 L0 52 L18 40 L30 50 L44 22 L58 48 L74 30 L90 52 L110 36 L126 54 L150 26 L170 50 L190 40 L214 56 L236 20 L256 50 L274 34 L296 54 L318 30 L338 50 L360 38 L380 54 L400 44 L400 80 Z" />
      </svg>
    </div>
  );
}

interface NightOverlayProps {
  view: RoomView;
  busy: boolean;
  error: string | null;
  send: (action: Action) => Promise<boolean>;
  serverNow: () => number;
}

export default function NightOverlay({ view, busy, error, send, serverNow }: NightOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const { play } = useSound();
  const phase = view.phase.kind === 'night' ? view.phase : null;
  const step = phase?.step ?? 'wolves';
  const me = view.me;
  const awake = me?.awake === true && view.night !== null;
  const { seconds } = usePhaseClock(awake && phase ? phase.endsAt : 0, STEP_SECONDS[step], serverNow);
  const mates = view.players.filter((player) => player.wolfMate);

  useEffect(() => {
    setMounted(true);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (!awake) return;
    play('pop');
    if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.([140, 80, 140]);
  }, [awake, step, play]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      data-theme="dark"
      role="dialog"
      aria-modal="true"
      aria-label={`Đêm ${view.round}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      className="fixed inset-0 z-[90] overflow-y-auto bg-[#04050a] text-ink"
    >
      <Sky />
      <div className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 pb-16 pt-10 sm:pt-14">
        <p className="eyebrow mb-2 text-[#9aa0c8]">Đêm {view.round}</p>
        <h2 className="font-display text-3xl font-extrabold leading-tight text-[#f4f1ff] sm:text-4xl">{STEP_NARRATION[step].title}</h2>
        <p className="mt-1 max-w-lg text-[#b9bddb]">{STEP_NARRATION[step].line}</p>

        <div className="mt-8 flex-1">
          {awake && view.night ? (
            <motion.section
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="border-2 border-edge bg-canvas/95 p-4 shadow-[0_0_90px_10px_rgba(249,143,69,0.18)] sm:p-6 rounded-xl"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-display text-xl font-extrabold text-ramp-text-1">Bạn đang thức</p>
                {seconds !== null && (
                  <span className={cn('flex items-center gap-1.5 font-display text-2xl font-extrabold tabular-nums', seconds <= 10 ? 'animate-pulse text-ramp-text-3' : 'text-ink')}>
                    <FaHourglassHalf className="h-4 w-4" />
                    {seconds}s
                  </span>
                )}
              </div>
              <NightAction view={view} night={view.night} busy={busy} send={send} />
              {error && <p role="alert" className="mt-3 border-l-4 border-edge bg-elevated px-3 py-2 text-sm font-semibold text-ink">{error}</p>}
            </motion.section>
          ) : me && !me.alive ? (
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#b9bddb]">
                <GiGhost className="h-12 w-12 text-[#d7dbf5]" />
                <p>Bạn đã ra đi. Hồn ma chỉ được lặng lẽ dõi theo và thì thầm với nhau.</p>
              </div>
              <ChatBox title="Hồn ma" messages={view.chat.filter((message) => message.channel === 'dead')} players={view.players} channel={me.chat} onSend={(text) => send({ type: 'chat', text })} />
            </section>
          ) : (
            <section className="flex flex-col items-center gap-6 pt-6 text-center">
              <div className="relative h-24 w-40">
                {['Z', 'z', 'z'].map((letter, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-display font-extrabold text-[#cfd3f2]"
                    style={{ left: `${30 + index * 22}%`, fontSize: 40 - index * 9 }}
                    animate={{ y: [40, -10], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.6 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-[#f4f1ff]">Bạn đang ngủ</p>
                <p className="mx-auto mt-2 max-w-sm text-[#b9bddb]">Úp điện thoại xuống và nhắm mắt lại. Màn hình sẽ tự sáng khi tới lượt bạn hoặc khi trời sáng.</p>
              </div>
              {me?.role && (
                <div className="w-full max-w-[220px] opacity-70">
                  <RoleCard role={me.role} mates={mates} compact />
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}
