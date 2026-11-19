// Sân lắc Bầu Cua: đĩa sứ viền vàng và ba xúc xắc 3D dưới nắp bát men lam; bát úp xuống rung lắc rồi nhấc lên để lộ kết quả
'use client';

import { motion } from 'framer-motion';
import { DICE_COUNT, type SymbolId } from './fish-prawn-crab-rules';
import SymbolDie from './SymbolDie';
import { SHAKE_MS, type FishPrawnCrabPhase, type SpinTurns } from './useFishPrawnCrab';

const INK = 'rgb(var(--ink))';
const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const DIE_DURATIONS = [SHAKE_MS - 300, SHAKE_MS - 150, SHAKE_MS];
const IDLE_FACES: SymbolId[] = ['gourd', 'crab', 'fish'];

interface BowlStageProps {
  roll: SymbolId[] | null;
  turns: SpinTurns[];
  phase: FishPrawnCrabPhase;
  lidClosed: boolean;
}

function Plate() {
  return (
    <svg viewBox="0 0 300 90" aria-hidden className="absolute inset-x-0 bottom-3 mx-auto w-[min(92%,340px)]">
      <ellipse cx={150} cy={58} rx={146} ry={34} style={{ fill: '#000000', opacity: 0.22 }} />
      <ellipse cx={150} cy={48} rx={146} ry={38} style={{ fill: '#f2c14e', stroke: INK, strokeWidth: 3 }} />
      <ellipse cx={150} cy={44} rx={124} ry={29} style={{ fill: 'rgb(var(--canvas))', stroke: INK, strokeWidth: 2.5 }} />
      <ellipse cx={150} cy={44} rx={110} ry={23} style={{ fill: 'none', stroke: 'var(--ramp-1)', strokeWidth: 3, strokeDasharray: '6 7' }} />
    </svg>
  );
}

function BowlLid() {
  return (
    <svg viewBox="0 0 240 130" aria-hidden className="h-full w-full">
      <path d="M18 116 Q18 22 120 18 Q222 22 222 116 Z" style={{ fill: 'rgb(var(--canvas))', stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' }} />
      <path d="M30 86 Q120 74 210 86 L214 102 Q120 90 26 102 Z" style={{ fill: 'var(--ramp-6)', stroke: INK, strokeWidth: 2.5 }} />
      {[60, 100, 140, 180].map((x) => (
        <circle key={x} cx={x} cy={58} r={6} style={{ fill: 'var(--ramp-1)', stroke: INK, strokeWidth: 2 }} />
      ))}
      <rect x={6} y={112} width={228} height={14} style={{ fill: 'rgb(var(--canvas))', stroke: INK, strokeWidth: 4 }} />
      <ellipse cx={120} cy={14} rx={18} ry={8} style={{ fill: 'var(--ramp-6)', stroke: INK, strokeWidth: 3 }} />
      <path d="M58 44 Q70 30 90 26" style={{ fill: 'none', stroke: 'rgb(var(--elevated))', strokeWidth: 6, strokeLinecap: 'round' }} />
    </svg>
  );
}

export default function BowlStage({ roll, turns, phase, lidClosed }: BowlStageProps) {
  const shaking = phase === 'shaking';
  const faces = roll ?? IDLE_FACES;

  return (
    <motion.div
      data-theme="light"
      className="relative mx-auto h-56 w-full max-w-md [perspective:900px] sm:h-64"
      animate={shaking ? { x: [0, -10, 10, -7, 7, -3, 3, 0], rotate: [0, -2.5, 2.5, -2, 2, 0] } : { x: 0, rotate: 0 }}
      transition={shaking ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.25 }}
    >
      <Plate />
      <div className="preserve-3d absolute inset-x-0 bottom-12 flex justify-center gap-4 sm:bottom-14">
        {Array.from({ length: DICE_COUNT }, (_, index) => (
          <SymbolDie key={index} face={faces[index]} turns={turns[index]} durationMs={DIE_DURATIONS[index]} />
        ))}
      </div>
      <motion.div
        className="absolute inset-x-0 bottom-6 mx-auto h-40 w-[min(84%,300px)] sm:h-44"
        initial={false}
        animate={lidClosed ? { y: 0, opacity: 1, rotate: 0 } : { y: '-75%', opacity: 0, rotate: -12 }}
        transition={{ duration: lidClosed ? 0.3 : 0.6, ease: EASE }}
      >
        <BowlLid />
      </motion.div>
    </motion.div>
  );
}
