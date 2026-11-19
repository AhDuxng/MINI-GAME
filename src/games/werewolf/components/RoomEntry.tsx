// Sảnh Ma Sói: nhập tên rồi tạo phòng mới hoặc vào phòng bằng mã; chưa đăng nhập thì vào nhanh với tư cách khách
'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { FaArrowRight, FaDoorOpen, FaPlus } from 'react-icons/fa6';
import { GameIllustration } from '@/features/catalog';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import Button from '@/shared/ui/Button';
import Panel from '@/shared/ui/Panel';
import { GameLayout } from '@/games/kit';
import { ROLES, type RoleId } from '../engine/roles';
import { NAME_MAX, cleanName } from '../engine/setup';
import type { SessionResult } from '../useGuestSession';
import { RoleIcon } from './role-art';
import { rampFill } from '@/shared/lib/ramp';

const CODE_LENGTH = 5;

export function normalizeCodeInput(raw: string) {
  return raw
    .toUpperCase()
    .replace(/[^A-HJKMNP-Z2-9]/g, '')
    .slice(0, CODE_LENGTH);
}

interface RoomEntryProps {
  accountName: string;
  initialCode?: string;
  ensureSession: (name: string) => Promise<SessionResult>;
  onEnter: (code: string) => void;
}

export default function RoomEntry({ accountName, initialCode = '', ensureSession, onEnter }: RoomEntryProps) {
  const [savedName, setSavedName] = useLocalStorage('werewolf:name', '');
  const [name, setName] = useState('');
  const [code, setCode] = useState(normalizeCodeInput(initialCode));
  const [busy, setBusy] = useState<'create' | 'join' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needLogin, setNeedLogin] = useState(false);

  useEffect(() => {
    setName((current) => current || savedName || accountName);
  }, [savedName, accountName]);

  const prepare = async () => {
    const clean = cleanName(name);
    if (!clean) {
      setError('Hãy nhập tên hiển thị của bạn trước.');
      return null;
    }
    setSavedName(clean);
    const session = await ensureSession(clean);
    if (!session.ok) {
      setError(session.error);
      setNeedLogin(session.needLogin);
      return null;
    }
    return clean;
  };

  const create = async () => {
    setError(null);
    setBusy('create');
    try {
      const clean = await prepare();
      if (!clean) return;
      const response = await fetch('/api/werewolf/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: clean }) });
      const body = (await response.json().catch(() => ({}))) as { code?: string; error?: string };
      if (!response.ok || !body.code) setError(body.error ?? 'Không tạo được phòng, bạn thử lại nhé.');
      else onEnter(body.code);
    } finally {
      setBusy(null);
    }
  };

  const join = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (code.length !== CODE_LENGTH) {
      setError('Mã phòng gồm 5 ký tự, ví dụ K7P2Q.');
      return;
    }
    setBusy('join');
    try {
      const clean = await prepare();
      if (!clean) return;
      const response = await fetch(`/api/werewolf/rooms/${code}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'join', name: clean }) });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) setError(body.error ?? 'Không vào được phòng, bạn thử lại nhé.');
      else onEnter(code);
    } finally {
      setBusy(null);
    }
  };

  return (
    <GameLayout
      main={
        <>
          <div className="relative aspect-[16/9] overflow-hidden border-2 border-edge sm:aspect-[16/7] rounded-2xl">
            <GameIllustration slug="werewolf" className="h-full w-full" />
          </div>

          <section className="surface space-y-5 p-5 sm:p-6">
            <label className="block space-y-2">
              <span className="font-display text-lg font-bold text-ink">Tên hiển thị trong làng</span>
              <input value={name} onChange={(event) => setName(event.target.value)} maxLength={NAME_MAX} placeholder="Ví dụ: Tuấn Béo" className="field h-12 text-lg" autoComplete="nickname" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3 border-2 border-edge bg-elevated p-4 rounded-xl">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <FaPlus className="h-4 w-4 text-ramp-text-2" /> Tạo phòng mới
                </p>
                <p className="flex-1 text-sm text-muted">Bạn làm chủ phòng, chọn bộ vai và gửi mã cho cả nhóm.</p>
                <Button size="lg" onClick={create} disabled={busy !== null}>
                  {busy === 'create' ? 'Đang tạo phòng...' : 'Tạo phòng'}
                  <FaArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={join} className="flex flex-col gap-3 border-2 border-line p-4 rounded-xl">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <FaDoorOpen className="h-4 w-4 text-ramp-text-6" /> Vào phòng có sẵn
                </p>
                <input
                  value={code}
                  onChange={(event) => setCode(normalizeCodeInput(event.target.value))}
                  placeholder="MÃ PHÒNG"
                  aria-label="Mã phòng"
                  inputMode="text"
                  autoCapitalize="characters"
                  className="field h-12 text-center font-display text-2xl font-extrabold tracking-[0.4em]"
                />
                <Button size="lg" variant="secondary" type="submit" disabled={busy !== null}>
                  {busy === 'join' ? 'Đang vào...' : 'Vào phòng'}
                </Button>
              </form>
            </div>

            {error && (
              <p role="alert" className="border-l-4 border-edge bg-elevated px-3 py-2 text-sm font-semibold text-ink">
                {error}{' '}
                {needLogin && (
                  <Link href={`/login?next=${encodeURIComponent(`/game/werewolf${code ? `?room=${code}` : ''}`)}`} className="font-bold text-ramp-text-6 underline">
                    Đăng nhập
                  </Link>
                )}
              </p>
            )}
          </section>
        </>
      }
      aside={
        <Panel title="Các vai trong làng" stop={3}>
          <ul className="space-y-3">
            {(Object.keys(ROLES) as RoleId[]).map((role) => (
              <li key={role} className="flex gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-[#12121a] rounded-lg" style={{ background: rampFill(ROLES[role].stop) }}>
                  <RoleIcon role={role} className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-display font-bold text-ink">{ROLES[role].name}</span>
                  <span className="block text-sm text-muted">{ROLES[role].summary}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      }
    />
  );
}
