// Khoá trang khi một game chiếm toàn màn hình (sàn đấu chạm nhanh, màn đoán trên trán): giữ màn hình luôn sáng và chặn cuộn trang phía dưới, trả lại như cũ khi thoát
import { useEffect } from 'react';
import useWakeLock from './useWakeLock';

export default function useFullscreenLock(active: boolean) {
  useWakeLock(active);

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [active]);
}
