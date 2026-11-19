// Đồng hồ đếm ngược của pha hiện tại theo giờ máy chủ: số giây còn lại và tỉ lệ thời gian đã trôi để vẽ thanh tiến trình
'use client';

import { useEffect, useState } from 'react';

export default function usePhaseClock(endsAt: number, totalSeconds: number, serverNow: () => number) {
  const [now, setNow] = useState(() => serverNow());

  useEffect(() => {
    if (!endsAt) return;
    setNow(serverNow());
    const timer = window.setInterval(() => setNow(serverNow()), 250);
    return () => window.clearInterval(timer);
  }, [endsAt, serverNow]);

  if (!endsAt) return { seconds: null, progress: 0 };
  const remaining = Math.max(0, endsAt - now);
  const total = Math.max(1, totalSeconds * 1000);
  return { seconds: Math.ceil(remaining / 1000), progress: Math.min(1, Math.max(0, 1 - remaining / total)) };
}
