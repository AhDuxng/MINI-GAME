// Quả bom số: thân cầu bóng có dấu hỏi tỏa quầng đỏ đậm dần theo độ nóng, ngòi cháy ngắn dần, tia lửa nhấp nháy và rung mạnh dần; khi nổ hiện chùm nổ kèm con số bom
'use client';

import { AnimatePresence, motion } from 'framer-motion';

const FUSE_START = { x: 120, y: 64 };
const FUSE_CONTROL = { x: 102, y: 14 };
const FUSE_END = { x: 176, y: 16 };
const MIN_FUSE = 0.1;
const BOOM_SPIKES = 14;
const INK = '#12121a';

const FUSE_PATH = `M ${FUSE_START.x} ${FUSE_START.y} Q ${FUSE_CONTROL.x} ${FUSE_CONTROL.y} ${FUSE_END.x} ${FUSE_END.y}`;

const BOOM_POINTS = Array.from({ length: BOOM_SPIKES * 2 }, (_, index) => {
  const angle = (index / (BOOM_SPIKES * 2)) * Math.PI * 2;
  const radius = index % 2 === 0 ? 112 : 70;
  return `${(120 + Math.cos(angle) * radius).toFixed(1)},${(120 + Math.sin(angle) * radius).toFixed(1)}`;
}).join(' ');

function fusePoint(t: number) {
  const u = 1 - t;
  return {
    x: u * u * FUSE_START.x + 2 * u * t * FUSE_CONTROL.x + t * t * FUSE_END.x,
    y: u * u * FUSE_START.y + 2 * u * t * FUSE_CONTROL.y + t * t * FUSE_END.y,
  };
}

interface BombVisualProps {
  heat: number;
  exploded: boolean;
  secret: number;
}

export default function BombVisual({ heat, exploded, secret }: BombVisualProps) {
  const fuse = Math.max(1 - heat, MIN_FUSE);
  const tip = fusePoint(fuse);
  const wobble = 2 + heat * 9;
  const period = Math.max(0.16, 1.3 - heat * 1.1);

  return (
    <div className="relative mx-auto flex h-44 w-full max-w-[280px] items-center justify-center [perspective:700px] sm:h-60">
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,124,120,0.55),rgba(251,124,120,0.12)_45%,transparent_70%)] transition-opacity duration-500"
        style={{ opacity: exploded ? 0 : 0.35 + heat * 0.65 }}
      />
      <span className="absolute bottom-2 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full bg-black/50 blur-md sm:bottom-3 sm:h-5 sm:w-40" />
      <div className="preserve-3d flex scale-[0.72] items-center justify-center sm:scale-100">
        <AnimatePresence mode="wait">
          {exploded ? (
            <motion.div
              key="boom"
              className="relative flex h-60 w-60 items-center justify-center"
              initial={{ scale: 0.2, rotate: -25, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 13 }}
            >
              <svg viewBox="0 0 240 240" className="absolute inset-0 h-full w-full" aria-hidden>
                <polygon points={BOOM_POINTS} style={{ fill: 'var(--ramp-3)' }} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
                <circle cx={120} cy={120} r={60} style={{ fill: 'var(--ramp-1)' }} stroke={INK} strokeWidth={3} />
              </svg>
              <span className="relative flex flex-col items-center leading-none text-[#12121a]">
                <span className="font-display text-2xl font-extrabold">BÙM!</span>
                <span className="font-display text-5xl font-extrabold">{secret}</span>
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="bomb"
              className="preserve-3d relative h-[230px] w-[240px]"
              animate={{ rotateZ: [-wobble, wobble, -wobble], rotateY: [-12, 12, -12], y: [0, -5, 0] }}
              transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }}
              exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.15 } }}
            >
              <svg viewBox="0 0 240 230" className="h-full w-full overflow-visible" aria-hidden>
                <defs>
                  <radialGradient id="number-bomb-body" cx="36%" cy="30%" r="75%">
                    <stop offset="0%" style={{ stopColor: 'color-mix(in srgb, var(--ramp-5) 55%, #12121a)' }} />
                    <stop offset="60%" style={{ stopColor: '#12121a' }} />
                    <stop offset="100%" style={{ stopColor: 'color-mix(in srgb, var(--ramp-7) 35%, #12121a)' }} />
                  </radialGradient>
                </defs>
                <path d={FUSE_PATH} pathLength={1} strokeDasharray={`${fuse} 1`} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
                <path d={FUSE_PATH} pathLength={1} strokeDasharray={`${fuse} 1`} fill="none" style={{ stroke: 'var(--ramp-1)' }} strokeWidth={6} strokeLinecap="round" />
                <rect x={100} y={56} width={40} height={24} transform="rotate(-8 120 68)" style={{ fill: 'color-mix(in srgb, #12121a 65%, var(--ramp-6))' }} stroke={INK} strokeWidth={3} />
                <circle cx={118} cy={146} r={80} fill="url(#number-bomb-body)" stroke={INK} strokeWidth={4} />
                <ellipse cx={86} cy={110} rx={20} ry={11} transform="rotate(-32 86 110)" style={{ fill: 'var(--ramp-0)' }} opacity={0.45} />
                <text x={120} y={156} textAnchor="middle" dominantBaseline="central" className="font-display" style={{ fill: 'rgb(255 255 255 / 0.9)', fontSize: 78, fontWeight: 800 }}>
                  ?
                </text>
                <motion.g
                  style={{ x: tip.x, y: tip.y }}
                  animate={{ scale: [0.8, 1.35, 0.9, 1.2, 0.8], rotate: [0, 45, 90, 135, 180] }}
                  transition={{ duration: Math.max(0.25, period * 0.6), repeat: Infinity, ease: 'linear' }}
                >
                  <path d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z" style={{ fill: 'var(--ramp-1)' }} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
                  <circle r={5} style={{ fill: 'var(--ramp-2)' }} />
                </motion.g>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
