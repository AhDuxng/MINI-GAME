// Bàn xoay chai dự phòng khi không có WebGL: mặt bàn tròn nhìn từ trên xuống, tên mọi người quanh mép và chai xoay bằng CSS
'use client';

import { motion } from 'framer-motion';
import { spreadStop, rampFill } from '@/shared/lib/ramp';
import { cn, truncate } from '@/shared/lib/utils';
import { SPIN_SECONDS, seatHeading } from './spin-rules';

interface BottleBoardProps {
  seats: string[];
  rotation: number;
  spinning: boolean;
  winner: number | null;
  onSpin: () => void;
  onSpinEnd: () => void;
}

export default function BottleBoard({ seats, rotation, spinning, winner, onSpin, onSpinEnd }: BottleBoardProps) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div
        className="absolute inset-[9%] rounded-full shadow-[0_24px_50px_-18px_rgba(0,0,0,0.7)]"
        style={{ background: 'repeating-radial-gradient(circle at 50% 50%, rgb(60 30 10 / 0) 0 9px, rgb(60 30 10 / 0.14) 9px 10px), radial-gradient(circle at 40% 35%, #d8975a, #b06d3a 55%, #7d4724)' }}
      />
      <div className="absolute inset-[9%] rounded-full border-[7px] border-[#5a3218] shadow-[inset_0_0_0_2px_rgba(240,190,130,0.45)]" />

      {seats.map((name, index) => {
        const heading = (seatHeading(index, seats.length) * Math.PI) / 180;
        return (
          <span
            key={`${name}-${index}`}
            className={cn(
              'absolute flex -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap px-2 py-1 font-display text-xs font-bold text-[#12121a] transition-transform duration-300 sm:text-sm rounded-md',
              index === winner && 'z-10 scale-125 border-2 border-edge',
            )}
            style={{ left: `${50 + Math.sin(heading) * 43}%`, top: `${50 - Math.cos(heading) * 43}%`, background: rampFill(spreadStop(index, seats.length)) }}
          >
            {truncate(name, 10)}
          </span>
        );
      })}

      <button
        type="button"
        onClick={onSpin}
        disabled={spinning}
        aria-label="Xoay chai"
        className="absolute left-1/2 top-1/2 h-[46%] w-[14%] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.span
          className="block h-full w-full"
          animate={{ rotate: rotation }}
          transition={spinning ? { duration: SPIN_SECONDS, ease: [0.12, 0.8, 0.2, 1] } : { duration: 0 }}
          onAnimationComplete={() => {
            if (spinning) onSpinEnd();
          }}
        >
          <svg viewBox="0 0 40 140" className="h-full w-full drop-shadow-[0_6px_6px_rgba(18,18,26,0.35)]" aria-hidden>
            <rect x={14} y={2} width={12} height={8} style={{ fill: 'var(--ramp-3)' }} />
            <path d="M 15 10 L 25 10 L 25 34 Q 36 46 36 62 L 36 132 Q 36 138 30 138 L 10 138 Q 4 138 4 132 L 4 62 Q 4 46 15 34 Z" style={{ fill: 'var(--ramp-8)' }} opacity={0.92} />
            <rect x={4} y={84} width={32} height={30} style={{ fill: 'var(--ramp-3)' }} />
            <rect x={4} y={94} width={32} height={8} style={{ fill: 'var(--ramp-0)' }} />
            <rect x={9} y={44} width={4} height={80} fill="#ffffff" opacity={0.4} />
          </svg>
        </motion.span>
      </button>
    </div>
  );
}
