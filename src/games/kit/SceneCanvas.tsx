// Khung vẽ WebGL dùng chung cho mọi cảnh 3D: lúc đang chạy (lắc, quay, đua) vẽ đủ khung hình, lúc nghỉ chỉ vẽ thưa theo idleFps hoặc đứng yên hẳn để đỡ tốn pin; giữ độ phân giải và vòng lặp vẽ trong state để R3F không ghi đè, máy không giữ nổi 50 khung/giây thì hạ dần độ phân giải, cảnh trôi khỏi màn hình thì ngừng vẽ
'use client';

import { Canvas, useFrame, useThree, type CanvasProps } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

const DEFAULT_MAX_DPR = 1.75;
const MIN_DPR = 1;
const DPR_STEP = 0.25;
const WARMUP_SECONDS = 2;
const WINDOW_SECONDS = 1;
const SLOW_FPS = 50;
const STALL_SECONDS = 0.25;
const SETTLE_MS = 600;

function FrameRateWatch({ onSlow }: { onSlow: () => void }) {
  const sample = useRef({ elapsed: 0, time: 0, frames: 0 });

  useFrame((_, delta) => {
    const current = sample.current;
    if (delta > STALL_SECONDS) return;
    current.elapsed += delta;
    if (current.elapsed < WARMUP_SECONDS) return;
    current.time += delta;
    current.frames += 1;
    if (current.time < WINDOW_SECONDS) return;
    const fps = current.frames / current.time;
    current.time = 0;
    current.frames = 0;
    if (fps < SLOW_FPS) onSlow();
  });

  return null;
}

function IdleTicker({ fps }: { fps: number }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const settleUntil = performance.now() + SETTLE_MS;
    let frame = 0;
    const settle = () => {
      invalidate();
      if (performance.now() < settleUntil) frame = requestAnimationFrame(settle);
    };
    settle();
    const timer = fps > 0 ? window.setInterval(() => invalidate(), 1000 / fps) : 0;
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, [fps, invalidate]);

  return null;
}

interface SceneCanvasProps {
  camera: CanvasProps['camera'];
  children: ReactNode;
  shadows?: CanvasProps['shadows'];
  maxDpr?: number;
  active?: boolean;
  idleFps?: number;
}

export default function SceneCanvas({ camera, children, shadows = 'percentage', maxDpr = DEFAULT_MAX_DPR, active = true, idleFps = 0 }: SceneCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(() => Math.max(MIN_DPR, Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1, maxDpr)));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const lowerResolution = useCallback(() => setDpr((current) => Math.max(MIN_DPR, current - DPR_STEP)), []);
  const frameloop = !visible ? 'never' : active ? 'always' : 'demand';

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <Canvas flat shadows={shadows} dpr={dpr} frameloop={frameloop} camera={camera} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        {active ? <FrameRateWatch onSlow={lowerResolution} /> : visible && <IdleTicker fps={idleFps} />}
        {children}
      </Canvas>
    </div>
  );
}
