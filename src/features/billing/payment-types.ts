// Kiểu dữ liệu đơn hàng và hướng dẫn thanh toán trao đổi giữa API và giao diện
import type { PlanId } from './plans';

export type OrderStatus = 'pending' | 'paid';

export interface OrderView {
  code: string;
  planId: PlanId;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  expiresAt: string;
  paidAt: string | null;
}

export interface PaymentInstructions {
  bank: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  transferNote: string;
  qrUrl: string;
}

export interface CreateOrderResponse {
  order: OrderView;
  payment: PaymentInstructions;
}

export interface OrderRow {
  code: string;
  plan_id: PlanId;
  amount: number;
  status: OrderStatus;
  created_at: string;
  expires_at: string;
  paid_at: string | null;
}

export function toOrderView(row: OrderRow): OrderView {
  return {
    code: row.code,
    planId: row.plan_id,
    amount: row.amount,
    status: row.status,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    paidAt: row.paid_at,
  };
}
