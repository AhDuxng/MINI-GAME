// Màn một phòng Ma Sói: tải và đồng bộ phòng, mời người mở link vào làng, rồi hiển thị phòng chờ, ban ngày, màn đêm hoặc kết thúc theo pha; âm thanh và thông báo lỗi khi thao tác
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { FaArrowLeft, FaXmark } from 'react-icons/fa6';
import { useSound } from '@/features/settings';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import { GameLayout, useWakeLock } from '@/games/kit';
import { NAME_MAX, cleanName } from '../engine/setup';
import type { SessionResult } from '../useGuestSession';
import useRoom from '../useRoom';
import ChatBox from './ChatBox';
import DayStage from './DayStage';
import EndScreen from './EndScreen';
import EventLog from './EventLog';
import Lobby from './Lobby';
import NightOverlay from './NightOverlay';
import PhaseBanner from './PhaseBanner';
import PlayerGrid from './PlayerGrid';
import RoleCard from './RoleCard';

const ROOM_ANCHOR = 'werewolf-room';

interface RoomScreenProps {
  code: string;
  userId: string | null;
  accountName: string;
  ensureSession: (name: string) => Promise<SessionResult>;
  onExit: () => void;
}

function Notice({ title, text, onExit }: { title: string; text: string; onExit: () => void }) {
  return (
    <section className="surface mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-12 text-center">
      <p className="font-display text-2xl font-extrabold text-ink">{title}</p>
      <p className="text-muted">{text}</p>
      <Button size="lg" onClick={onExit}>
        <FaArrowLeft className="h-4 w-4" /> Về sảnh Ma Sói
      </Button>
    </section>
  );
}

function JoinForm({ code, accountName, onJoin }: { code: string; accountName: string; onJoin: (name: string) => Promise<void> }) {
  const [savedName, setSavedName] = useLocalStorage('werewolf:name', '');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName((current) => current || savedName || accountName);
  }, [savedName, accountName]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const clean = cleanName(name);
    if (!clean) return;
    setSavedName(clean);
    setBusy(true);
    try {
      await onJoin(clean);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="surface mx-auto flex max-w-md flex-col gap-4 p-6">
      <p className="eyebrow">Bạn được mời vào làng</p>
      <p className="font-display text-4xl font-extrabold tracking-[0.3em] text-ink">{code}</p>
      <label className="space-y-2">
        <span className="block font-display text-lg font-bold text-ink">Tên hiển thị</span>
        <input value={name} onChange={(event) => setName(event.target.value)} maxLength={NAME_MAX} placeholder="Ví dụ: Tuấn Béo" className="field h-12 text-lg" autoComplete="nickname" />
      </label>
      <Button size="lg" type="submit" disabled={busy || !cleanName(name)}>
        {busy ? 'Đang vào làng...' : 'Vào làng'}
      </Button>
    </form>
  );
}

export default function RoomScreen({ code, userId, accountName, ensureSession, onExit }: RoomScreenProps) {
  const room = useRoom(code, userId);
  const { view, status, error, busy, online, send, serverNow, clearError } = room;
  const { play } = useSound();
  const [joinError, setJoinError] = useState<string | null>(null);
  const lastPhase = useRef<string | null>(null);
  const phaseKind = view?.phase.kind ?? null;
  const lynched = view?.phase.kind === 'verdict' ? view.phase.lynchedId : null;
  useWakeLock(Boolean(view?.me) && phaseKind !== null && phaseKind !== 'lobby' && phaseKind !== 'ended');

  useEffect(() => {
    if (!phaseKind || lastPhase.current === phaseKind) return;
    const first = lastPhase.current === null;
    lastPhase.current = phaseKind;
    document.getElementById(ROOM_ANCHOR)?.scrollIntoView({ behavior: first ? 'auto' : 'smooth', block: 'start' });
    if (first) return;
    if (phaseKind === 'night') play('start');
    else if (phaseKind === 'day' || phaseKind === 'ended') play('success');
    else if (phaseKind === 'verdict' && lynched) play('fail');
  }, [phaseKind, lynched, play]);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(clearError, 4500);
    return () => window.clearTimeout(timer);
  }, [error, clearError]);

  const join = async (name: string) => {
    setJoinError(null);
    const session = await ensureSession(name).catch(() => null);
    if (!session?.ok) {
      setJoinError(session?.error ?? 'Chưa vào được làng, kiểm tra mạng rồi thử lại.');
      return;
    }
    await send({ type: 'join', name });
  };

  if (status === 'missing') return <Notice title={`Không tìm thấy phòng ${code}`} text="Phòng có thể đã hết hạn sau 24 giờ hoặc mã chưa đúng. Hãy hỏi lại chủ phòng nhé." onExit={onExit} />;
  if (!view) {
    if (status === 'error') return <Notice title="Không tải được phòng" text="Kết nối tới máy chủ đang trục trặc, bạn thử tải lại trang nhé." onExit={onExit} />;
    return <div className="surface h-64 animate-pulse" />;
  }

  const toast = (
    <AnimatePresence>
      {(error || joinError) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          role="alert"
          className="fixed inset-x-4 bottom-[calc(var(--tabbar-height)+env(safe-area-inset-bottom)+84px)] z-[95] mx-auto flex max-w-md items-center gap-3 border-2 border-edge bg-canvas px-4 py-3 shadow-lg md:bottom-8"
        >
          <p className="flex-1 text-sm font-semibold text-ink">{error ?? joinError}</p>
          <button type="button" aria-label="Đóng" onClick={() => {
              clearError();
              setJoinError(null);
            }} className="text-muted hover:text-ink">
            <FaXmark className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!view.me && view.phase.kind === 'lobby') {
    return (
      <>
        <JoinForm code={code} accountName={accountName} onJoin={join} />
        {toast}
      </>
    );
  }

  if (view.phase.kind === 'lobby') {
    return (
      <>
        <div id={ROOM_ANCHOR} className="scroll-mt-[calc(var(--header-height)+12px)]">
          <Lobby view={view} online={online} busy={busy} send={send} onLeave={onExit} />
        </div>
        {toast}
      </>
    );
  }

  const mates = view.players.filter((player) => player.wolfMate);
  const chatMessages = view.chat.filter((message) => message.channel === 'all' || (message.channel === 'dead' && view.me?.alive === false) || view.phase.kind === 'ended');

  return (
    <div id={ROOM_ANCHOR} className="scroll-mt-[calc(var(--header-height)+12px)]">
      <GameLayout
        main={
          <>
            {!view.me && <p className="border-l-4 border-edge bg-elevated px-4 py-3 text-sm font-semibold text-ink">Ván đang diễn ra, bạn đang xem với tư cách khán giả. Chờ ván sau để vào làng nhé.</p>}
            {view.phase.kind === 'ended' ? (
              <EndScreen view={view} busy={busy} send={send} onLeave={onExit} />
            ) : (
              <>
                <PhaseBanner view={view} serverNow={serverNow} />
                {view.phase.kind === 'night' ? <PlayerGrid players={view.players} /> : <DayStage view={view} busy={busy} online={online} send={send} />}
              </>
            )}
          </>
        }
        aside={
          <>
            {view.me?.role && view.phase.kind !== 'reveal' && view.phase.kind !== 'ended' && (
              <Panel title="Vai của bạn" stop={3}>
                <RoleCard role={view.me.role} mates={mates} compact />
              </Panel>
            )}
            <ChatBox messages={chatMessages} players={view.players} channel={view.me?.chat === 'wolves' ? null : view.me?.chat ?? null} onSend={(text) => send({ type: 'chat', text })} />
            <EventLog events={view.events} players={view.players} />
          </>
        }
      />
      <AnimatePresence>{view.phase.kind === 'night' && <NightOverlay key="night" view={view} busy={busy} error={error} send={send} serverNow={serverNow} />}</AnimatePresence>
      {toast}
    </div>
  );
}
