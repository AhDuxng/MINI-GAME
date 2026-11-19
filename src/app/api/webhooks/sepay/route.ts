// Webhook SePay: đọc thân có giới hạn, xác thực chữ ký, chỉ xử lý giao dịch tiền vào đúng tài khoản nhận và có mã đơn, gọi settle_payment để kích hoạt gói; trả {"success": true} để SePay không gửi lại
import { NextResponse } from 'next/server';
import { bodyErrorResponse, errorResponse } from '@/shared/lib/api-response';
import { readTextBody } from '@/shared/lib/request-body';
import { extractOrderCode, parseSepayBody, verifySepayRequest } from '@/features/billing/server';
import { adminEnabled, adminSupabase } from '@/shared/supabase/admin';

const SUCCESS = { success: true };
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  if (!adminEnabled()) return errorResponse(503, 'Máy chủ chưa được cấu hình.');

  const body = await readTextBody(request, MAX_BODY_BYTES);
  if (!body.ok) return bodyErrorResponse(body.status);
  const rawBody = body.value;
  if (!verifySepayRequest(request.headers, rawBody)) return errorResponse(401, 'Chữ ký không hợp lệ.');

  let transaction;
  try {
    transaction = parseSepayBody(rawBody, request.headers.get('content-type') ?? 'application/json');
  } catch {
    return errorResponse(400, 'Dữ liệu không hợp lệ.');
  }

  const orderCode = extractOrderCode(transaction);
  const receivingAccount = process.env.BANK_ACCOUNT_NUMBER;
  const wrongAccount = Boolean(receivingAccount) && transaction.accountNumber !== receivingAccount;
  if (transaction.transferType !== 'in' || wrongAccount || !orderCode || !Number.isFinite(transaction.id)) {
    return NextResponse.json(SUCCESS);
  }

  const { error } = await adminSupabase().rpc('settle_payment', {
    p_transaction_id: transaction.id,
    p_order_code: orderCode,
    p_amount: transaction.transferAmount,
    p_payload: transaction,
  });

  if (error) return errorResponse(500, 'Không ghi nhận được giao dịch.');
  return NextResponse.json(SUCCESS);
}
