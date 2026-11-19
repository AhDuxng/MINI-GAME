// Đọc màu từ CSS custom properties cho cảnh 3D, cập nhật khi đổi giao diện sáng/tối để globals.css vẫn là nguồn màu duy nhất
import { useEffect, useState } from 'react';
import { RAMP_SIZE } from '@/shared/lib/ramp';

export interface SceneColors {
  ramp: string[];
  canvas: string;
  elevated: string;
  ink: string;
  line: string;
  onRamp: string;
}

function readColors(): SceneColors {
  const style = getComputedStyle(document.documentElement);
  const value = (name: string) => style.getPropertyValue(name).trim();
  const triplet = (name: string) => `rgb(${value(name).split(/\s+/).join(', ')})`;

  return {
    ramp: Array.from({ length: RAMP_SIZE }, (_, index) => value(`--ramp-${index}`)),
    canvas: triplet('--canvas'),
    elevated: triplet('--elevated'),
    ink: triplet('--ink'),
    line: triplet('--line'),
    onRamp: value('--on-ramp'),
  };
}

export default function useSceneColors() {
  const [colors, setColors] = useState(readColors);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readColors()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
