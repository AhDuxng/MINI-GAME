// Lá bài từ bí mật 3D: mặt lưng in dấu hỏi, chạm để lật xem từ; chữ chỉ được render khi đang lật để người kế tiếp không nhìn trộm
'use client';

import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';

interface SpyCardProps {
  word: string | null;
  revealed: boolean;
  onFlip: () => void;
}

export default function SpyCard({ word, revealed, onFlip }: SpyCardProps) {
  return (
    <button
      type="button"
      onClick={onFlip}
      disabled={revealed}
      aria-label={revealed ? 'Từ bí mật đang hiện' : 'Chạm để xem từ bí mật'}
      className="group relative mx-auto block aspect-[3/4] w-full max-w-[240px] [perspective:1000px] disabled:cursor-default"
    >
      <span
        className={cn(
          'preserve-3d absolute inset-0 transition-transform duration-700 ease-house',
          !revealed && 'group-hover:[transform:translateZ(18px)_rotateX(6deg)] group-active:[transform:translateZ(4px)]',
        )}
        style={revealed ? { transform: 'rotateY(180deg)' } : undefined}
      >
        <span
          className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 border border-[#12121a]/20 rounded-xl"
          style={{ background: `linear-gradient(135deg, ${rampFill(5)}, ${rampFill(7)})` }}
        >
          <span className="dot-screen absolute inset-0 opacity-60" />
          <span className="relative font-display text-8xl font-extrabold leading-none text-[#12121a]">?</span>
          <span className="relative rounded-md bg-[#12121a]/80 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[var(--ramp-0)]">
            Chạm để xem từ
          </span>
        </span>
        <span data-theme="light" className="surface backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center [transform:rotateY(180deg)]">
          <span className="eyebrow">Từ của bạn</span>
          <span className="text-ramp break-words font-display text-4xl font-extrabold leading-tight">{word}</span>
          <span className="text-xs font-semibold text-muted">Đừng để ai nhìn thấy!</span>
        </span>
      </span>
      <span className="absolute -bottom-5 left-[14%] right-[14%] h-4 rounded-full bg-black/50 blur-md" />
    </button>
  );
}
