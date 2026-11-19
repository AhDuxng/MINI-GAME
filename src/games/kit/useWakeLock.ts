// Giữ màn hình điện thoại luôn sáng khi đang trong ván (máy úp xuống ban đêm, áp lên trán, đặt giữa bàn) để máy không tự khoá giữa chừng
'use client';

import { useEffect } from 'react';

export default function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let stopped = false;

    const request = async () => {
      if (document.visibilityState !== 'visible' || (lock && !lock.released)) return;
      try {
        lock = await navigator.wakeLock.request('screen');
        if (stopped) void lock.release();
      } catch {
        lock = null;
      }
    };

    void request();
    document.addEventListener('visibilitychange', request);
    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', request);
      void lock?.release();
    };
  }, [active]);
}
