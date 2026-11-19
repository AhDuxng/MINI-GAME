// Đồng bộ một phòng Ma Sói: tải bản nhìn của mình, nhận tín hiệu thay đổi có số phiên bản qua Supabase Realtime (gộp các tín hiệu dồn dập thành một lần tải), hỏi lại định kỳ thưa hơn khi realtime đang chạy và dừng khi ẩn tab, hỏi đúng lúc hết pha có rải ngẫu nhiên, gửi hành động lên máy chủ
'use client';

import type { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { browserSupabase } from '@/shared/supabase/browser';
import type { Action, RoomView } from './engine/types';

const POLL_TICK_MS = 3000;
const POLL_WITH_REALTIME_MS = 12000;
const SYNC_COALESCE_MS = 300;
const DEADLINE_SLACK_MS = 400;
const DEADLINE_JITTER_MS = 700;

export type RoomStatus = 'loading' | 'ready' | 'missing' | 'error';

interface RoomResponse {
  view: RoomView;
  advanced: boolean;
}

export default function useRoom(code: string, userId: string | null) {
  const [view, setView] = useState<RoomView | null>(null);
  const [status, setStatus] = useState<RoomStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [online, setOnline] = useState<string[]>([]);
  const version = useRef(0);
  const offset = useRef(0);
  const channel = useRef<RealtimeChannel | null>(null);
  const realtime = useRef(false);
  const inFlight = useRef(false);
  const queued = useRef(false);
  const lastLoadAt = useRef(0);
  const syncTimer = useRef<number>();

  const accept = useCallback((next: RoomView) => {
    offset.current = next.serverNow - Date.now();
    if (next.version < version.current) return;
    const changed = next.version !== version.current;
    version.current = next.version;
    if (changed) setView(next);
    setStatus('ready');
  }, []);

  const ping = useCallback(() => {
    void channel.current?.send({ type: 'broadcast', event: 'sync', payload: { v: version.current } });
  }, []);

  const refresh = useCallback(async () => {
    if (inFlight.current) {
      queued.current = true;
      return;
    }
    inFlight.current = true;
    lastLoadAt.current = Date.now();
    try {
      const response = await fetch(`/api/werewolf/rooms/${code}`, { cache: 'no-store' });
      if (response.status === 404) {
        setStatus('missing');
        return;
      }
      if (!response.ok) {
        setStatus((current) => (current === 'ready' ? current : 'error'));
        return;
      }
      const body = (await response.json()) as RoomResponse;
      accept(body.view);
      if (body.advanced) ping();
    } catch {
      setStatus((current) => (current === 'ready' ? current : 'error'));
    } finally {
      inFlight.current = false;
      if (queued.current) {
        queued.current = false;
        window.setTimeout(() => void refreshRef.current(), 0);
      }
    }
  }, [code, accept, ping]);

  const refreshRef = useRef(refresh);
  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  const send = useCallback(
    async (action: Action) => {
      setBusy(true);
      setError(null);
      try {
        const response = await fetch(`/api/werewolf/rooms/${code}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action),
        });
        const body = (await response.json().catch(() => ({}))) as Partial<RoomResponse> & { error?: string };
        if (!response.ok || !body.view) {
          setError(body.error ?? 'Có lỗi xảy ra, bạn thử lại nhé.');
          void refresh();
          return false;
        }
        accept(body.view);
        ping();
        return true;
      } catch {
        setError('Mất kết nối, kiểm tra mạng rồi thử lại.');
        return false;
      } finally {
        setBusy(false);
      }
    },
    [code, accept, ping, refresh],
  );

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      const gap = realtime.current ? POLL_WITH_REALTIME_MS : POLL_TICK_MS;
      if (Date.now() - lastLoadAt.current >= gap - 100) void refresh();
    }, POLL_TICK_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  const endsAt = view && 'endsAt' in view.phase ? view.phase.endsAt : 0;
  useEffect(() => {
    if (!endsAt) return;
    const delay = Math.max(0, endsAt - (Date.now() + offset.current)) + DEADLINE_SLACK_MS + Math.random() * DEADLINE_JITTER_MS;
    const timer = window.setTimeout(() => void refresh(), delay);
    return () => window.clearTimeout(timer);
  }, [endsAt, refresh]);

  useEffect(() => {
    const supabase = browserSupabase();
    if (!supabase) return;
    const scheduleSync = (payload: { v?: unknown }) => {
      if (typeof payload.v === 'number' && payload.v <= version.current) return;
      window.clearTimeout(syncTimer.current);
      syncTimer.current = window.setTimeout(() => void refresh(), SYNC_COALESCE_MS);
    };
    const room = supabase.channel(`werewolf:${code}`, {
      config: { broadcast: { self: false }, presence: { key: userId ?? `guest-${Math.random().toString(36).slice(2)}` } },
    });
    room
      .on('broadcast', { event: 'sync' }, ({ payload }) => scheduleSync((payload ?? {}) as { v?: unknown }))
      .on('presence', { event: 'sync' }, () => setOnline(Object.keys(room.presenceState())))
      .subscribe((state) => {
        realtime.current = state === 'SUBSCRIBED';
        if (state === 'SUBSCRIBED' && userId) void room.track({ online: true });
      });
    channel.current = room;
    return () => {
      window.clearTimeout(syncTimer.current);
      realtime.current = false;
      channel.current = null;
      void supabase.removeChannel(room);
    };
  }, [code, userId, refresh]);

  const serverNow = useCallback(() => Date.now() + offset.current, []);
  const clearError = useCallback(() => setError(null), []);

  return { view, status, error, busy, online, send, refresh, serverNow, clearError };
}
