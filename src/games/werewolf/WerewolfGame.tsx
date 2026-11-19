// Màn gốc Ma Sói online: đọc mã phòng trên đường dẫn, chưa có phòng thì vào sảnh tạo hoặc tìm phòng, có phòng thì mở phòng; máy chủ chưa cấu hình thì báo rõ
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback } from 'react';
import { GiWolfHowl } from 'react-icons/gi';
import { buttonStyles } from '@/shared/ui/Button';
import RoomEntry, { normalizeCodeInput } from './components/RoomEntry';
import RoomScreen from './components/RoomScreen';
import useGuestSession from './useGuestSession';

const CODE_LENGTH = 5;

function OfflineNotice() {
  return (
    <section className="surface mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-12 text-center">
      <GiWolfHowl className="h-16 w-16 text-ramp-text-5" />
      <p className="font-display text-2xl font-extrabold text-ink">Làng Ma Sói chưa mở cửa</p>
      <p className="text-muted">Chế độ online cần máy chủ để giữ bí mật vai của từng người. Trong lúc chờ, cả nhóm thử các trò khác nhé.</p>
      <Link href="/" className={buttonStyles({ size: 'lg' })}>
        Xem các trò khác
      </Link>
    </section>
  );
}

function WerewolfRouter() {
  const params = useSearchParams();
  const router = useRouter();
  const session = useGuestSession();
  const code = normalizeCodeInput(params.get('room') ?? '');

  const enter = useCallback((next: string) => router.replace(`/game/werewolf?room=${next}`, { scroll: false }), [router]);
  const exit = useCallback(() => router.replace('/game/werewolf', { scroll: false }), [router]);

  if (!session.enabled) return <OfflineNotice />;
  if (!session.ready) return <div className="surface h-64 animate-pulse" />;
  if (code.length !== CODE_LENGTH) return <RoomEntry accountName={session.accountName} ensureSession={session.ensureSession} onEnter={enter} />;

  return <RoomScreen key={code} code={code} userId={session.userId} accountName={session.accountName} ensureSession={session.ensureSession} onExit={exit} />;
}

export default function WerewolfGame() {
  return (
    <Suspense fallback={<div className="surface h-64 animate-pulse" />}>
      <WerewolfRouter />
    </Suspense>
  );
}
