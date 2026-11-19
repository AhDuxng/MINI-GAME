// Gói VIP và giới hạn bản miễn phí: giá, thời hạn, lời mời chào từng gói, mức chia tiền theo đầu người, ưu đãi nâng cấp từ vé 9k và tóm tắt quyền lợi; máy chủ dùng chung bảng giá này khi tạo đơn
import type { GameSlug } from '@/features/catalog';

export type PlanId = 'party-pass' | 'monthly' | 'lifetime';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  durationDays: number | null;
  period: string;
  tagline: string;
  badge: string;
  pitch: string;
  needsAccount: boolean;
  hero?: boolean;
}

export interface Membership {
  planId: PlanId;
  expiresAt: number | null;
}

export const PLANS: Plan[] = [
  {
    id: 'party-pass',
    name: 'Vé Đêm Tiệc',
    price: 9000,
    durationDays: 1,
    period: '24 giờ',
    tagline: 'Mở khoá tất cả cho cả bàn tối nay',
    badge: 'Chơi ngay tối nay',
    pitch: 'Không cần tài khoản, quét mã là chơi',
    needsAccount: false,
    hero: true,
  },
  {
    id: 'monthly',
    name: 'Gói Tháng',
    price: 29000,
    durationDays: 30,
    period: '30 ngày',
    tagline: 'Cho nhóm hay tụ tập',
    badge: 'Rẻ hơn từ buổi thứ 4',
    pitch: 'Bằng giá hơn 3 vé, dùng cả tháng',
    needsAccount: true,
  },
  {
    id: 'lifetime',
    name: 'Trọn Đời',
    price: 99000,
    durationDays: null,
    period: 'mãi mãi',
    tagline: 'Trả một lần, dùng mãi mãi',
    badge: 'Giá trị nhất',
    pitch: 'Bằng 11 vé đêm tiệc, gồm mọi game ra sau này',
    needsAccount: true,
  },
];

export const HERO_PLAN_ID: PlanId = 'party-pass';

export const FREE_LIMITS = {
  trialRoundsPerDay: 3,
  duckRacers: 6,
  reflexPlayers: 3,
  bottleSeats: 10,
};

export const VIP_LIMITS = {
  duckRacers: 8,
  reflexPlayers: 4,
  bottleSeats: 16,
};

export const VIP_TASTE_MINUTES = 10;
export const UPGRADE_WINDOW_DAYS = 7;

export const VIP_HIGHLIGHTS = [
  'Bầu Cua, Gián Điệp, Bom Nổ Chậm không giới hạn',
  'Mức "Cháy" cho 5 game bàn nhậu',
  `Nhóm đông tới ${VIP_LIMITS.bottleSeats} người`,
];

export function checkoutHref(planId: PlanId, returnTo?: string | null) {
  const from = returnTo?.startsWith('/game/') ? `&from=${encodeURIComponent(returnTo)}` : '';
  return `/vip/checkout?plan=${planId}${from}`;
}

export function getPlan(id: PlanId) {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[0];
}

export function isPlanId(value: string | null): value is PlanId {
  return PLANS.some((plan) => plan.id === value);
}

export function isMembershipActive(membership: Membership | null, now = Date.now()) {
  return membership !== null && (membership.expiresAt === null || membership.expiresAt > now);
}

export function perPerson(price: number, people: number) {
  return people >= 2 ? Math.ceil(price / people / 100) * 100 : price;
}

export function priceAfterCredit(plan: Plan, credit: number) {
  return plan.id === HERO_PLAN_ID ? plan.price : Math.max(plan.price - credit, 1000);
}

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export type TrialLog = Partial<Record<GameSlug, { date: string; used: number }>>;

export function trialsUsedToday(log: TrialLog, slug: GameSlug, today = localDateKey()) {
  const entry = log[slug];
  return entry && entry.date === today ? entry.used : 0;
}
