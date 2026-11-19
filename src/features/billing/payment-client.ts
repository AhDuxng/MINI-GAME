// Gọi API thanh toán từ trình duyệt: tạo đơn, xem trạng thái đơn và giả lập tiền về khi phát triển
import type { PlanId } from './plans';
import type { CreateOrderResponse, OrderView } from './payment-types';

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data as { error?: string }).error ?? 'Có lỗi xảy ra, vui lòng thử lại.');
  return data as T;
}

export function createOrder(planId: PlanId) {
  return request<CreateOrderResponse>('/api/orders', { method: 'POST', body: JSON.stringify({ planId }) });
}

export async function fetchOrder(code: string) {
  return (await request<{ order: OrderView }>(`/api/orders/${encodeURIComponent(code)}`, { cache: 'no-store' })).order;
}

export function simulatePayment(code: string) {
  return request<{ result: string }>('/api/dev/simulate-payment', { method: 'POST', body: JSON.stringify({ code }) });
}
