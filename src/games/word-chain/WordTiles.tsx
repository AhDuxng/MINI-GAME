// Hiển thị từ thành các khối chữ 3D như quân chữ gỗ ngà trên bảng phấn, có mặt trên và mặt bên, rơi xuống lần lượt; tiếng cuối tô dải màu (bỏ stop tím vì chữ tối thiếu tương phản)
import type { CSSProperties } from 'react';
import { rampFill } from '@/shared/lib/ramp';
import { cn } from '@/shared/lib/utils';

const LEGIBLE_STOPS = [0, 1, 2, 3, 4, 6, 7, 8];
const DROP_STAGGER_MS = 55;
const IVORY = '#f4e6c8';

function Tile({ letter, fill, delay }: { letter: string; fill: string | null; delay: number }) {
  const front = fill ?? IVORY;
  const faces = {
    '--front': front,
    '--top': `color-mix(in srgb, ${front} 70%, #ffffff)`,
    '--side': `color-mix(in srgb, ${front} 72%, #12121a)`,
    animationDelay: `${delay}ms`,
  } as CSSProperties;

  return (
    <span className="preserve-3d relative block h-11 w-9 animate-tile-drop sm:h-14 sm:w-11" style={faces}>
      <span className="absolute inset-x-0 top-0 h-2.5 origin-top border border-[#12121a]/20 bg-[var(--top)] [transform:rotateX(-90deg)]" />
      <span className="absolute left-full top-0 h-full w-2.5 origin-left border border-[#12121a]/20 bg-[var(--side)] [transform:rotateY(90deg)]" />
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-[3px] border bg-[var(--front)] font-display text-2xl font-extrabold uppercase text-[#12121a] sm:text-3xl',
          fill ? 'border-[#12121a]/25' : 'border-[#12121a]/15',
        )}
      >
        {letter}
      </span>
    </span>
  );
}

export default function WordTiles({ word, highlightLast = false }: { word: string; highlightLast?: boolean }) {
  const syllables = word.split(' ');
  const offsets = syllables.map((_, index) => syllables.slice(0, index).reduce((sum, part) => sum + [...part].length, 0));

  return (
    <div className="[perspective:800px]" aria-label={word}>
      <div className="preserve-3d flex flex-wrap justify-center gap-x-6 gap-y-4 [transform:rotateX(-18deg)_rotateY(-12deg)]" aria-hidden>
        {syllables.map((syllable, syllableIndex) => {
          const highlighted = highlightLast && syllableIndex === syllables.length - 1;
          const letters = [...syllable];
          return (
            <span key={`${syllable}-${syllableIndex}`} className="preserve-3d flex gap-1.5">
              {letters.map((letter, index) => {
                const stop = LEGIBLE_STOPS[Math.round((index * (LEGIBLE_STOPS.length - 1)) / Math.max(letters.length - 1, 1))];
                return (
                  <Tile
                    key={index}
                    letter={letter}
                    fill={highlighted ? rampFill(stop) : null}
                    delay={(offsets[syllableIndex] + index) * DROP_STAGGER_MS}
                  />
                );
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
}
