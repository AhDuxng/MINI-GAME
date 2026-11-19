// Trạng thái thành viên VIP: gói và ưu đãi nâng cấp đọc song song từ máy chủ theo phiên hiện tại (bỏ kết quả cũ nếu phiên đổi giữa chừng, lỗi mạng thì giữ gói cũ và tự thử lại), 10 phút thử VIP một lần mỗi máy, lượt chơi thử mỗi ngày; lý do mở hộp thoại mua nằm ở context riêng để mở hộp thoại không làm render lại cả trang game
'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import type { GameSlug } from '@/features/catalog';
import { useAuth } from '@/features/auth';
import { backendEnabled } from '@/shared/supabase/config';
import { FREE_LIMITS, HERO_PLAN_ID, UPGRADE_WINDOW_DAYS, VIP_TASTE_MINUTES, isMembershipActive, isPlanId, localDateKey, trialsUsedToday, type Membership, type TrialLog } from './plans';

export type VipSource = 'membership' | 'taste' | null;

interface Taste {
  endsAt: number;
}

interface PremiumContextValue {
  membership: Membership | null;
  isVip: boolean;
  vipSource: VipSource;
  ready: boolean;
  refreshMembership: () => Promise<Membership | null>;
  trialsLeft: (slug: GameSlug) => number;
  consumeTrial: (slug: GameSlug) => boolean;
  tasteAvailable: boolean;
  tasteEndsAt: number | null;
  startTaste: () => void;
  upgradeCredit: number;
  openPaywall: (reason?: string) => void;
  closePaywall: () => void;
}

const PremiumContext = createContext<PremiumContextValue | null>(null);
const PaywallContext = createContext<string | null>(null);

const DEFAULT_REASON = 'Mở khoá toàn bộ trò chơi và nội dung nâng cao cho cả bàn.';
const TASTE_OVER_REASON = `Hết ${VIP_TASTE_MINUTES} phút chơi thử VIP. Giữ VIP cho cả bàn tới giờ này ngày mai.`;
const DAY_MS = 24 * 60 * 60 * 1000;
const TRIAL_DEBOUNCE_MS = 1500;
const RETRY_MS = 15000;

async function loadClient() {
  if (!backendEnabled) return null;
  const { browserSupabase } = await import('@/shared/supabase/browser');
  return browserSupabase();
}

async function fetchMembership(): Promise<Membership | null> {
  const supabase = await loadClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from('memberships').select('plan_id, expires_at').maybeSingle();
  if (error) throw error;
  if (!data || !isPlanId(data.plan_id)) return null;
  return { planId: data.plan_id, expiresAt: data.expires_at ? new Date(data.expires_at).getTime() : null };
}

async function fetchUpgradeCredit(): Promise<number> {
  const supabase = await loadClient();
  if (!supabase) return 0;
  const since = new Date(Date.now() - UPGRADE_WINDOW_DAYS * DAY_MS).toISOString();
  const { data: ticket } = await supabase
    .from('orders')
    .select('id, amount')
    .eq('plan_id', HERO_PLAN_ID)
    .eq('status', 'paid')
    .gt('paid_at', since)
    .order('paid_at', { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string; amount: number }>();
  if (!ticket) return 0;
  const { count, error } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('credit_order_id', ticket.id).eq('status', 'paid');
  return error || (count ?? 0) > 0 ? 0 : ticket.amount;
}

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { user, sessionUser, ready: authReady } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [membershipReady, setMembershipReady] = useState(false);
  const [membershipFailed, setMembershipFailed] = useState(false);
  const [upgradeCredit, setUpgradeCredit] = useState(0);
  const [trialLog, setTrialLog, trialsReady] = useLocalStorage<TrialLog>('vip-trials', {});
  const [taste, setTaste] = useLocalStorage<Taste | null>('vip-taste', null);
  const [now, setNow] = useState(() => Date.now());
  const [paywallReason, setPaywallReason] = useState<string | null>(null);
  const requestId = useRef(0);
  const trialGuard = useRef<{ slug: GameSlug; at: number } | null>(null);

  const refreshMembership = useCallback(async () => {
    const id = ++requestId.current;
    if (!sessionUser) {
      setMembership(null);
      setUpgradeCredit(0);
      setMembershipReady(true);
      return null;
    }
    try {
      const [next, credit] = await Promise.all([fetchMembership(), user ? fetchUpgradeCredit().catch(() => 0) : Promise.resolve(0)]);
      if (id === requestId.current) {
        setMembership(next);
        setUpgradeCredit(credit);
        setMembershipFailed(false);
      }
      return next;
    } catch {
      if (id === requestId.current) setMembershipFailed(true);
      return null;
    } finally {
      if (id === requestId.current) setMembershipReady(true);
    }
  }, [sessionUser, user]);

  useEffect(() => {
    if (authReady) void refreshMembership();
  }, [authReady, refreshMembership]);

  useEffect(() => {
    if (!membershipFailed) return;
    const timer = window.setTimeout(() => void refreshMembership(), RETRY_MS);
    return () => window.clearTimeout(timer);
  }, [membershipFailed, refreshMembership]);

  const memberActive = isMembershipActive(membership, now);
  const tasteActive = taste !== null && taste.endsAt > now;
  const vipSource: VipSource = memberActive ? 'membership' : tasteActive ? 'taste' : null;

  useEffect(() => {
    const deadlines = [membership?.expiresAt ?? null, taste?.endsAt ?? null].filter((value): value is number => value !== null && value > Date.now());
    if (deadlines.length === 0) return;
    const timer = window.setTimeout(() => setNow(Date.now()), Math.min(...deadlines) - Date.now() + 50);
    return () => window.clearTimeout(timer);
  }, [membership, taste, now]);

  const trialsLeft = useCallback(
    (slug: GameSlug) => Math.max(0, FREE_LIMITS.trialRoundsPerDay - trialsUsedToday(trialLog, slug)),
    [trialLog],
  );

  const consumeTrial = useCallback(
    (slug: GameSlug) => {
      if (trialsLeft(slug) <= 0) return false;
      const at = Date.now();
      if (trialGuard.current?.slug === slug && at - trialGuard.current.at < TRIAL_DEBOUNCE_MS) return true;
      trialGuard.current = { slug, at };
      const today = localDateKey();
      setTrialLog((log) => ({ ...log, [slug]: { date: today, used: trialsUsedToday(log, slug, today) + 1 } }));
      return true;
    },
    [trialsLeft, setTrialLog],
  );

  const openPaywall = useCallback((reason?: string) => setPaywallReason(reason ?? DEFAULT_REASON), []);
  const closePaywall = useCallback(() => setPaywallReason(null), []);

  const startTaste = useCallback(() => {
    if (taste !== null) return;
    setTaste({ endsAt: Date.now() + VIP_TASTE_MINUTES * 60 * 1000 });
    setNow(Date.now());
    setPaywallReason(null);
  }, [taste, setTaste]);

  useEffect(() => {
    if (!taste || memberActive) return;
    const left = taste.endsAt - Date.now();
    if (left <= 0) return;
    const timer = window.setTimeout(() => setPaywallReason(TASTE_OVER_REASON), left);
    return () => window.clearTimeout(timer);
  }, [taste, memberActive]);

  const value = useMemo(
    () => ({
      membership,
      isVip: vipSource !== null,
      vipSource,
      ready: authReady && membershipReady && trialsReady,
      refreshMembership,
      trialsLeft,
      consumeTrial,
      tasteAvailable: trialsReady && taste === null && !memberActive,
      tasteEndsAt: tasteActive && taste ? taste.endsAt : null,
      startTaste,
      upgradeCredit,
      openPaywall,
      closePaywall,
    }),
    [membership, vipSource, authReady, membershipReady, trialsReady, refreshMembership, trialsLeft, consumeTrial, taste, memberActive, tasteActive, startTaste, upgradeCredit, openPaywall, closePaywall],
  );

  return (
    <PremiumContext.Provider value={value}>
      <PaywallContext.Provider value={paywallReason}>{children}</PaywallContext.Provider>
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) throw new Error('usePremium phải được dùng bên trong PremiumProvider');
  return context;
}

export function usePaywallReason() {
  return useContext(PaywallContext);
}
