// Nhận cử chỉ cúi máy xuống hoặc ngửa máy lên khi điện thoại áp trên trán, cầm dọc hay cầm ngang đều được; phải đưa máy về thẳng đứng thì cú nghiêng tiếp theo mới được tính; iOS cần người dùng bấm cấp quyền trước
import { useEffect, useRef } from 'react';

export type TiltDirection = 'down' | 'up';

const NEUTRAL_DEGREES = 20;
const TRIGGER_DEGREES = 42;

type OrientationWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function tiltSupported() {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window && window.matchMedia('(pointer: coarse)').matches;
}

export async function requestTiltPermission() {
  if (!tiltSupported()) return false;
  const Orientation = DeviceOrientationEvent as OrientationWithPermission;
  if (typeof Orientation.requestPermission !== 'function') return true;
  try {
    return (await Orientation.requestPermission()) === 'granted';
  } catch {
    return false;
  }
}

export default function useTiltGesture(active: boolean, onTilt: (direction: TiltDirection) => void) {
  const callback = useRef(onTilt);

  useEffect(() => {
    callback.current = onTilt;
  }, [onTilt]);

  useEffect(() => {
    if (!active || !tiltSupported()) return;
    let mode: 'portrait' | 'landscape' | null = null;
    let armed = false;

    const handle = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta === null || gamma === null) return;
      const landscapeTilt = 90 - Math.abs(gamma);
      const portraitTilt = Math.abs(90 - Math.abs(beta));

      if (!armed) {
        if (landscapeTilt < NEUTRAL_DEGREES) {
          mode = 'landscape';
          armed = true;
        } else if (portraitTilt < NEUTRAL_DEGREES && Math.abs(gamma) < 35) {
          mode = 'portrait';
          armed = true;
        }
        return;
      }

      const tilt = mode === 'landscape' ? landscapeTilt : portraitTilt;
      if (tilt > TRIGGER_DEGREES) {
        armed = false;
        callback.current(Math.abs(beta) > 90 ? 'down' : 'up');
      }
    };

    window.addEventListener('deviceorientation', handle);
    return () => window.removeEventListener('deviceorientation', handle);
  }, [active]);
}
