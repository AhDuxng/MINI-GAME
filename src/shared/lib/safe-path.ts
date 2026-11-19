// Lọc đường dẫn quay về (sau đăng nhập, sau thanh toán): chỉ nhận đường dẫn nội bộ cùng gốc, chặn các dạng lách ra trang ngoài như //evil, /\evil hay ký tự điều khiển, có thể giới hạn thêm theo tiền tố
const INTERNAL_ORIGIN = 'http://internal.invalid';

export function safeInternalPath<T extends string | null>(value: string | null | undefined, fallback: T, prefix = '/'): string | T {
  if (!value || !value.startsWith('/')) return fallback;
  try {
    const url = new URL(value, INTERNAL_ORIGIN);
    if (url.origin !== INTERNAL_ORIGIN) return fallback;
    const path = `${url.pathname}${url.search}${url.hash}`;
    return path.startsWith(prefix) ? path : fallback;
  } catch {
    return fallback;
  }
}
