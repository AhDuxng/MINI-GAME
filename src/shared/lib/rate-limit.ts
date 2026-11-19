// Giới hạn tần suất gọi API theo cửa sổ trượt, lưu trong bộ nhớ của từng máy chủ: đủ chặn spam trên một tiến trình; chạy nhiều máy chủ thì thay bằng bộ đếm dùng chung (Upstash, WAF) với cùng giao diện
const MAX_KEYS = 20_000;
const hits = new Map<string, number[]>();

function prune(now: number, windowMs: number) {
  for (const [key, times] of hits) {
    if (times[times.length - 1] <= now - windowMs) hits.delete(key);
  }
}

export function allowRequest(key: string, limit: number, windowMs: number, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((time) => time > now - windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_KEYS) prune(now, windowMs);
  return true;
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}
