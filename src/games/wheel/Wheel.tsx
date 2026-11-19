// Vòng quay SVG co giãn theo khung chứa; chỉ hiển thị góc xoay do hook điều khiển và báo lại khi quay xong
'use client';

import { motion } from 'framer-motion';
import { truncate } from '@/shared/lib/utils';
import { SPIN_DURATION_S, isLeftHalf, labelStyle, polarToCartesian, segmentColor, slicePath } from './wheel-geometry';

const VIEWBOX = 500;
const CENTER = VIEWBOX / 2;
const RADIUS = 232;
const LABEL_RADIUS = RADIUS * 0.6;
const SPIN_EASING: [number, number, number, number] = [0.15, 0.85, 0.25, 1];

interface WheelProps {
  segments: string[];
  colors: string[];
  rotation: number;
  isSpinning: boolean;
  canSpin: boolean;
  onSpin: () => void;
  onSpinEnd: () => void;
}

export default function Wheel({ segments, colors, rotation, isSpinning, canSpin, onSpin, onSpinEnd }: WheelProps) {
  const count = segments.length;
  const slice = 360 / Math.max(count, 1);
  const { fontSize, maxChars } = labelStyle(count);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="absolute -top-[4%] left-1/2 z-20 w-[9%] -translate-x-1/2 rotate-180 fill-ink"
      >
        <path d="M12 3L3 21H21L12 3Z" stroke="rgb(var(--canvas))" strokeWidth={1.5} strokeLinejoin="round" />
      </svg>

      <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} aria-hidden className="absolute inset-0 h-full w-full">
        <circle cx={CENTER} cy={CENTER} r={CENTER - 2} className="fill-canvas stroke-ink" strokeWidth={3} />
      </svg>

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: rotation }}
        transition={isSpinning ? { duration: SPIN_DURATION_S, ease: SPIN_EASING } : { duration: 0 }}
        onAnimationComplete={() => {
          if (isSpinning) onSpinEnd();
        }}
      >
        <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} role="img" aria-label="Vòng quay" className="h-full w-full">
          {count === 0 && <circle cx={CENTER} cy={CENTER} r={RADIUS} className="fill-elevated" />}
          {segments.map((label, index) => {
            const start = index * slice;
            const middle = start + slice / 2;
            const anchor = polarToCartesian(CENTER, LABEL_RADIUS, middle);
            const labelAngle = isLeftHalf(middle) ? middle + 180 : middle;

            return (
              <g key={`${label}-${index}`}>
                <path
                  d={slicePath(CENTER, RADIUS, start, start + slice)}
                  style={{ fill: segmentColor(index, count, colors), stroke: 'rgb(var(--canvas))' }}
                  strokeWidth={2}
                />
                <text
                  x={anchor.x}
                  y={anchor.y}
                  transform={`rotate(${labelAngle}, ${anchor.x}, ${anchor.y})`}
                  style={{ fill: 'var(--on-ramp)' }}
                  fontSize={fontSize}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none"
                >
                  {truncate(label, maxChars)}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={onSpin}
          disabled={!canSpin}
          className="pointer-events-auto flex aspect-square w-[22%] items-center justify-center rounded-full border-[3px] border-canvas bg-ink font-display text-sm font-extrabold tracking-wider text-canvas outline outline-1 outline-ink transition-transform duration-300 ease-house hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 sm:text-sm"
        >
          QUAY
        </button>
      </div>
    </div>
  );
}
