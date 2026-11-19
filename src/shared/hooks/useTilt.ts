// Nghiêng phần tử 3D theo con trỏ, ghi transform trực tiếp trong requestAnimationFrame thay vì qua state để không render lại mỗi lần rê chuột
import { useEffect, useRef } from 'react';

export default function useTilt<T extends HTMLElement>(maxDegrees = 8) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const apply = (rotateX: number, rotateY: number, lift: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${lift}px)`;
      });
    };

    const handleMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      apply(-y * maxDegrees * 2, x * maxDegrees * 2, 12);
    };
    const handleLeave = () => apply(0, 0, 0);

    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerleave', handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerleave', handleLeave);
    };
  }, [maxDegrees]);

  return ref;
}
