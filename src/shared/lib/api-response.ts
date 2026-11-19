// Tiện ích trả JSON lỗi thống nhất cho các Route Handler, kèm các câu báo chung cho yêu cầu quá lớn, hỏng hoặc gửi quá dày
import { NextResponse } from 'next/server';

export function errorResponse(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export function bodyErrorResponse(status: 400 | 413) {
  return errorResponse(status, status === 413 ? 'Yêu cầu quá lớn.' : 'Dữ liệu không hợp lệ.');
}

export function tooManyRequests() {
  return NextResponse.json({ error: 'Bạn thao tác quá nhanh, hãy đợi một chút rồi thử lại.' }, { status: 429, headers: { 'Retry-After': '30' } });
}
