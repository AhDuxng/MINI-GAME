// Lá bài 3D dùng chung: chồng bài lơ lửng để rút, và lá bài lật từ mặt lưng sang mặt nội dung, nghiêng theo con trỏ; sang lá mới thì lá đang mở úp xuống trước (vẫn giữ nội dung cũ trong lúc úp) rồi mới lật lá mới lên, bị bỏ khỏi bàn thì cũng úp xuống trước khi biến mất
'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import useTilt from '@/shared/hooks/useTilt';

const FLIP_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const CLOSE_SECONDS = 0.36;
const OPEN_SECONDS = 0.62;

interface CardStackProps {
  face: ReactNode;
  label: string;
  onDraw: () => void;
  delay?: number;
}

export function CardStack({ face, label, onDraw, delay = 0 }: CardStackProps) {
  return (
    <button type="button" onClick={onDraw} aria-label={label} className="group relative aspect-[3/4] w-full [perspective:900px]">
      <span className="preserve-3d absolute inset-0 animate-float [--tilt-x:12deg]" style={{ animationDelay: `${delay}ms` }}>
        <span className="preserve-3d absolute inset-0 transition-transform duration-500 ease-house group-hover:[transform:translateZ(28px)_rotateX(-6deg)] group-active:[transform:translateZ(8px)]">
          {[3, 2, 1].map((layer) => (
            <span
              key={layer}
              className="absolute inset-0 border border-line bg-canvas rounded-xl"
              style={{ transform: `translateZ(${-layer * 7}px) translate(${layer * 3}px, ${layer * 4}px)` }}
            />
          ))}
          <span className="absolute inset-0">{face}</span>
        </span>
      </span>
      <span className="absolute -bottom-5 left-[12%] right-[12%] h-4 rounded-full bg-ink/10 blur-md" />
    </button>
  );
}

interface FlipCardProps {
  flipKey: string;
  front: ReactNode;
  back: ReactNode;
}

export default function FlipCard({ flipKey, front, back }: FlipCardProps) {
  const tiltRef = useTilt<HTMLDivElement>(5);
  const [shownKey, setShownKey] = useState(flipKey);
  const shownFront = useRef(front);
  const closing = shownKey !== flipKey;

  useEffect(() => {
    if (!closing) shownFront.current = front;
  });

  return (
    <div className="[perspective:1400px]">
      <div ref={tiltRef} className="preserve-3d transition-transform duration-200 ease-out">
        <motion.div
          className="preserve-3d relative"
          initial={{ rotateY: 180, y: -24 }}
          animate={closing ? { rotateY: 180, y: -14 } : { rotateY: 0, y: 0 }}
          exit={{ rotateY: 180, y: -14, transition: { duration: CLOSE_SECONDS, ease: FLIP_EASE } }}
          transition={{ duration: closing ? CLOSE_SECONDS : OPEN_SECONDS, ease: FLIP_EASE }}
          onAnimationComplete={() => {
            if (closing) setShownKey(flipKey);
          }}
        >
          <div className="backface-hidden relative">{closing ? shownFront.current : front}</div>
          <div className="backface-hidden absolute inset-0 [transform:rotateY(180deg)]">{back}</div>
        </motion.div>
      </div>
    </div>
  );
}
