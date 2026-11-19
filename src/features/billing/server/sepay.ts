// Tích hợp SePay phía máy chủ: sinh mã đơn, đọc mã đơn từ nội dung chuyển khoản, xác thực webhook (HMAC-SHA256 hoặc API Key) và tạo ảnh VietQR
import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { PaymentInstructions } from '../payment-types';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;
const SIGNATURE_TOLERANCE_S = 300;

export const ORDER_CODE_PREFIX = (process.env.PAYMENT_CODE_PREFIX ?? 'VC').toUpperCase();

export interface SepayTransaction {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  subAccount: string | null;
  code: string | null;
  content: string;
  transferType: 'in' | 'out';
  description: string;
  transferAmount: number;
  accumulated: number;
  referenceCode: string;
}

export function paymentConfigured() {
  return Boolean(process.env.BANK_ACCOUNT_NUMBER && process.env.BANK_CODE);
}

export function generateOrderCode() {
  const body = Array.from(randomBytes(CODE_LENGTH), (byte) => ALPHABET[byte % ALPHABET.length]).join('');
  return ORDER_CODE_PREFIX + body;
}

export function extractOrderCode(transaction: Pick<SepayTransaction, 'code' | 'content' | 'description'>) {
  const pattern = new RegExp(`${ORDER_CODE_PREFIX}[${ALPHABET}]{${CODE_LENGTH}}`);
  for (const text of [transaction.code, transaction.content, transaction.description]) {
    const match = text?.toUpperCase().replace(/[^A-Z0-9]/g, '').match(pattern);
    if (match) return match[0];
  }
  return null;
}

function safeEqual(received: string, expected: string) {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifySepayRequest(headers: Headers, rawBody: string, nowMs = Date.now()) {
  const secret = process.env.SEPAY_WEBHOOK_SECRET;
  const apiKey = process.env.SEPAY_WEBHOOK_API_KEY;

  if (secret) {
    const signature = headers.get('x-sepay-signature') ?? '';
    const timestamp = headers.get('x-sepay-timestamp') ?? '';
    if (!/^\d+$/.test(timestamp) || Math.abs(nowMs / 1000 - Number(timestamp)) > SIGNATURE_TOLERANCE_S) return false;
    const expected = `sha256=${createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex')}`;
    return safeEqual(signature, expected);
  }

  if (apiKey) return safeEqual(headers.get('authorization') ?? '', `Apikey ${apiKey}`);
  return false;
}

export function parseSepayBody(rawBody: string, contentType: string): SepayTransaction {
  const data: Record<string, unknown> = contentType.includes('application/json')
    ? JSON.parse(rawBody)
    : Object.fromEntries(new URLSearchParams(rawBody));
  return {
    ...(data as unknown as SepayTransaction),
    id: Number(data.id),
    transferAmount: Number(data.transferAmount),
    accumulated: Number(data.accumulated ?? 0),
    code: typeof data.code === 'string' && data.code.length > 0 ? data.code : null,
    content: String(data.content ?? ''),
    description: String(data.description ?? ''),
  };
}

export function paymentInstructions(order: { code: string; amount: number }): PaymentInstructions {
  const accountNumber = process.env.BANK_ACCOUNT_NUMBER ?? '';
  const bank = process.env.BANK_CODE ?? '';
  const transferNote = [process.env.PAYMENT_NOTE_PREFIX, order.code].filter(Boolean).join(' ');
  const query = new URLSearchParams({ acc: accountNumber, bank, amount: String(order.amount), des: transferNote, template: 'compact' });
  return {
    bank,
    accountNumber,
    accountName: process.env.BANK_ACCOUNT_NAME ?? '',
    amount: order.amount,
    transferNote,
    qrUrl: `https://qr.sepay.vn/img?${query}`,
  };
}
