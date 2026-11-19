// Phát hiện thao tác lắc điện thoại qua cảm biến gia tốc; iOS cần người dùng bấm cấp quyền trước
import { useCallback, useEffect, useRef, useState } from 'react';

const SHAKE_THRESHOLD = 15;
const SHAKE_COOLDOWN_MS = 1200;

export type ShakePermission = 'unsupported' | 'prompt' | 'granted' | 'denied';

type MotionEventWithPermission = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

function isTouchDevice() {
  return 'DeviceMotionEvent' in window && window.matchMedia('(pointer: coarse)').matches;
}

export default function useShake(onShake: () => void, enabled = true) {
  const [permission, setPermission] = useState<ShakePermission>('unsupported');
  const onShakeRef = useRef(onShake);

  useEffect(() => {
    onShakeRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    if (!isTouchDevice()) return;
    const MotionEvent = DeviceMotionEvent as MotionEventWithPermission;
    setPermission(typeof MotionEvent.requestPermission === 'function' ? 'prompt' : 'granted');
  }, []);

  const requestPermission = useCallback(async () => {
    const MotionEvent = DeviceMotionEvent as MotionEventWithPermission;
    if (typeof MotionEvent.requestPermission !== 'function') return;
    try {
      setPermission(await MotionEvent.requestPermission());
    } catch {
      setPermission('denied');
    }
  }, []);

  useEffect(() => {
    if (!enabled || permission !== 'granted') return;

    let previous: { x: number; y: number; z: number } | null = null;
    let lastShakeAt = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.accelerationIncludingGravity ?? {};
      if (x == null || y == null || z == null) return;

      if (previous) {
        const delta = Math.abs(x - previous.x) + Math.abs(y - previous.y) + Math.abs(z - previous.z);
        const now = Date.now();
        if (delta > SHAKE_THRESHOLD && now - lastShakeAt > SHAKE_COOLDOWN_MS) {
          lastShakeAt = now;
          onShakeRef.current();
        }
      }
      previous = { x, y, z };
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [enabled, permission]);

  return { permission, requestPermission };
}
