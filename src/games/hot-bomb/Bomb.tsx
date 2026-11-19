// Quả bom 3D bằng CSS: thân cầu nhiều lớp gradient tỏa quầng đỏ trên nền vùng nguy hiểm, ngòi cháy ngắn dần với tia lửa, rung mạnh dần theo thời gian; khi nổ hiện vụ nổ hoạt hình
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/utils';
import type { BombPhase } from './useHotBomb';

const FUSE_START = { x: 110, y: 64 };
const FUSE_CONTROL = { x: 92, y: 22 };
const FUSE_END = { x: 156, y: 12 };
const MIN_FUSE = 0.08;
const BOOM_SPIKES = 16;

const BODY_STYLE = {
  background: [
    'radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--ramp-0) 70%, transparent) 0 7%, transparent 16%)',
    'radial-gradient(circle at 72% 78%, color-mix(in srgb, var(--ramp-7) 45%, transparent) 0%, transparent 38%)',
    'radial-gradient(circle at 36% 32%, color-mix(in srgb, #12121a 62%, var(--ramp-5)) 0%, #12121a 58%)',
  ].join(', '),
};

const BOOM_POINTS = Array.from({ length: BOOM_SPIKES * 2 }, (_, index) => {
  const angle = (index / (BOOM_SPIKES * 2)) * Math.PI * 2;
  const radius = index % 2 === 0 ? 104 : 62;
  return `${(110 + Math.cos(angle) * radius).toFixed(1)},${(110 + Math.sin(angle) * radius).toFixed(1)}`;
}).join(' ');

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function fuseGeometry(remaining: number) {
  const control = { x: lerp(FUSE_START.x, FUSE_CONTROL.x, remaining), y: lerp(FUSE_START.y, FUSE_CONTROL.y, remaining) };
  const tip = {
    x: (1 - remaining) ** 2 * FUSE_START.x + 2 * (1 - remaining) * remaining * FUSE_CONTROL.x + remaining ** 2 * FUSE_END.x,
    y: (1 - remaining) ** 2 * FUSE_START.y + 2 * (1 - remaining) * remaining * FUSE_CONTROL.y + remaining ** 2 * FUSE_END.y,
  };
  return { path: `M ${FUSE_START.x} ${FUSE_START.y} Q ${control.x} ${control.y} ${tip.x} ${tip.y}`, tip };
}

const FULL_FUSE = fuseGeometry(1);

export default function Bomb({ phase, getHeat }: { phase: BombPhase; getHeat: () => number }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const fuseOutlineRef = useRef<SVGPathElement>(null);
  const fuseRef = useRef<SVGPathElement>(null);
  const sparkRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const outline = fuseOutlineRef.current;
    const fuse = fuseRef.current;
    const spark = sparkRef.current;
    if (!body || !outline || !fuse || !spark) return;

    if (phase !== 'burning') {
      body.style.transform = '';
      outline.setAttribute('d', FULL_FUSE.path);
      fuse.setAttribute('d', FULL_FUSE.path);
      spark.style.opacity = '0';
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const render = (time: number) => {
      const heat = getHeat();
      const { path, tip } = fuseGeometry(Math.max(1 - heat, MIN_FUSE));
      outline.setAttribute('d', path);
      fuse.setAttribute('d', path);
      spark.style.opacity = '1';
      spark.setAttribute('transform', `translate(${tip.x} ${tip.y}) scale(${0.8 + Math.random() * 0.5}) rotate(${Math.random() * 90})`);

      if (!reduceMotion) {
        const amplitude = 1 + heat * heat * 7;
        const dx = (Math.random() - 0.5) * amplitude * 2;
        const dy = (Math.random() - 0.5) * amplitude;
        const tilt = (Math.random() - 0.5) * amplitude * 1.2;
        const wobble = Math.sin(time / 380) * 14;
        body.style.transform = `translate(${dx}px, ${dy}px) rotateY(${wobble}deg) rotateZ(${tilt}deg)`;
      }
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [phase, getHeat]);

  return (
    <div className="relative flex h-72 w-full items-center justify-center [perspective:700px]">
      <span
        aria-hidden
        className={cn('absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-[44%] rounded-full bg-[radial-gradient(circle,rgba(251,124,120,0.5),rgba(251,124,120,0.12)_45%,transparent_70%)]', phase === 'burning' && 'animate-pulse')}
      />
      <div className={phase === 'exploded' ? 'invisible' : 'preserve-3d animate-float [--tilt-x:6deg]'}>
      <div ref={bodyRef} className="preserve-3d relative h-[260px] w-[220px]">
        <svg viewBox="0 0 220 90" className="absolute inset-x-0 top-0 h-[90px] w-[220px] overflow-visible" aria-hidden>
          <path ref={fuseOutlineRef} d={FULL_FUSE.path} fill="none" stroke="#12121a" strokeWidth={10} strokeLinecap="round" />
          <path ref={fuseRef} d={FULL_FUSE.path} fill="none" style={{ stroke: 'var(--ramp-1)' }} strokeWidth={6} strokeLinecap="round" strokeDasharray="5 4" />
          <g ref={sparkRef} style={{ opacity: 0 }}>
            <path d="M 0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" style={{ fill: 'var(--ramp-1)' }} stroke="#12121a" strokeWidth={1.5} strokeLinejoin="round" />
            <circle r={5} style={{ fill: 'var(--ramp-2)' }} />
          </g>
        </svg>
        <span className="absolute left-1/2 top-[54px] h-[26px] w-[48px] -translate-x-1/2 rounded-b-sm rounded-t-md border-2 border-[#12121a] bg-[color-mix(in_srgb,#12121a_70%,var(--ramp-6))] shadow-[inset_0_2px_0_rgba(255,255,255,0.15)]" />
        <span className="absolute bottom-0 left-1/2 h-[184px] w-[184px] -translate-x-1/2 rounded-full border-2 border-[#12121a] shadow-[inset_-10px_-14px_24px_rgba(0,0,0,0.55),0_0_0_2px_rgba(255,255,255,0.06),0_0_40px_rgba(251,124,120,0.35)]" style={BODY_STYLE} />
        <span className="absolute bottom-[112px] left-[62px] h-6 w-11 -rotate-[28deg] rounded-full bg-[var(--ramp-0)] opacity-40 blur-[2px]" />
      </div>
      </div>
      <span className="absolute bottom-2 left-1/2 h-5 w-48 -translate-x-1/2 rounded-full bg-black/50 blur-md" />

      <AnimatePresence>
        {phase === 'exploded' && (
          <motion.div
            key="boom"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          >
            <svg viewBox="0 0 220 220" className="h-64 w-64" aria-hidden>
              <polygon points={BOOM_POINTS} style={{ fill: 'var(--ramp-3)' }} stroke="#12121a" strokeWidth={4} strokeLinejoin="round" />
              <circle cx={110} cy={110} r={52} style={{ fill: 'var(--ramp-1)' }} stroke="#12121a" strokeWidth={3} />
            </svg>
            <span className="absolute font-display text-5xl font-extrabold text-[#12121a]">BÙM!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
