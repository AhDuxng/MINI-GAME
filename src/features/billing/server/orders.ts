// Nghiệp vụ tạo đơn VIP phía máy chủ: kiểm tra quyền mua theo loại phiên, tính giá sau ưu đãi nâng cấp (mỗi vé 9k trong 7 ngày chỉ trừ một lần), dùng lại đơn đang chờ cùng gói và cùng giá, sinh mã đơn không trùng
import 'server-only';
import { adminSupabase } from '@/shared/supabase/admin';
import { HERO_PLAN_ID, UPGRADE_WINDOW_DAYS, getPlan, priceAfterCredit, type PlanId } from '../plans';
import { toOrderView, type CreateOrderResponse, type OrderRow } from '../payment-types';
import { generateOrderCode, paymentInstructions } from './sepay';

const ORDER_COLUMNS = 'code, plan_id, amount, status, created_at, expires_at, paid_at';
const UNIQUE_VIOLATION = '23505';
const MAX_CODE_ATTEMPTS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface Buyer {
  id: string;
  isAnonymous: boolean;
}

export type CreateOrderResult = { ok: true; response: CreateOrderResponse } | { ok: false; status: 401 | 500; message: string };

type Admin = ReturnType<typeof adminSupabase>;

async function findUnusedTicket(admin: Admin, userId: string) {
  const since = new Date(Date.now() - UPGRADE_WINDOW_DAYS * DAY_MS).toISOString();
  const { data: ticket } = await admin
    .from('orders')
    .select('id, amount')
    .eq('user_id', userId)
    .eq('plan_id', HERO_PLAN_ID)
    .eq('status', 'paid')
    .gt('paid_at', since)
    .order('paid_at', { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string; amount: number }>();
  if (!ticket) return null;
  const { count } = await admin.from('orders').select('id', { count: 'exact', head: true }).eq('credit_order_id', ticket.id).eq('status', 'paid');
  return (count ?? 0) > 0 ? null : ticket;
}

export async function createOrderFor(buyer: Buyer, planId: PlanId): Promise<CreateOrderResult> {
  const plan = getPlan(planId);
  if (buyer.isAnonymous && plan.needsAccount) return { ok: false, status: 401, message: `${plan.name} cần đăng nhập để dùng được trên mọi máy.` };

  const admin = adminSupabase();
  const credit = plan.id === HERO_PLAN_ID || buyer.isAnonymous ? null : await findUnusedTicket(admin, buyer.id);
  const amount = priceAfterCredit(plan, credit?.amount ?? 0);

  const { data: pending } = await admin
    .from('orders')
    .select(ORDER_COLUMNS)
    .eq('user_id', buyer.id)
    .eq('plan_id', plan.id)
    .eq('amount', amount)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<OrderRow>();

  let row = pending;
  for (let attempt = 0; !row && attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const { data, error } = await admin
      .from('orders')
      .insert({
        code: generateOrderCode(),
        user_id: buyer.id,
        plan_id: plan.id,
        amount,
        duration_days: plan.durationDays,
        credit_order_id: credit?.id ?? null,
        credit_amount: credit ? plan.price - amount : 0,
      })
      .select(ORDER_COLUMNS)
      .single<OrderRow>();
    if (error && error.code !== UNIQUE_VIOLATION) return { ok: false, status: 500, message: 'Không tạo được đơn hàng, vui lòng thử lại.' };
    row = data;
  }
  if (!row) return { ok: false, status: 500, message: 'Không tạo được đơn hàng, vui lòng thử lại.' };

  return { ok: true, response: { order: toOrderView(row), payment: paymentInstructions(row) } };
}
