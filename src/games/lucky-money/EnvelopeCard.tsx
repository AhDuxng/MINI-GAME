// Bao lì xì 3D: túi đỏ son hoa văn chấm vàng viền kim tuyến, nắp lật mở quanh mép trên rồi tờ lì xì trắng trượt lên; nội dung chỉ render sau khi mở để không lộ giải
'use client';

import { cn } from '@/shared/lib/utils';
import { prizeLabel, type Envelope } from './lucky-rules';

const PATTERN = {
  backgroundColor: '#e8392b',
  backgroundImage: 'linear-gradient(160deg, rgb(255 255 255 / 0.16), transparent 55%), radial-gradient(rgb(246 207 107 / 0.75) 1.2px, transparent 1.6px), radial-gradient(rgb(246 207 107 / 0.4) 1px, transparent 1.4px)',
  backgroundSize: '100% 100%, 10px 10px, 10px 10px',
  backgroundPosition: '0 0, 0 0, 5px 5px',
};
const FLAP_PATTERN = { ...PATTERN, backgroundColor: '#c42a22' };
const INSIDE = { background: '#8e1912' };
const FLAP_DOWN = '[clip-path:polygon(0_0,100%_0,50%_100%)]';
const FLAP_UP = '[clip-path:polygon(50%_0,100%_100%,0_100%)]';

interface EnvelopeCardProps {
  envelope: Envelope;
  onOpen: (id: number) => void;
}

export default function EnvelopeCard({ envelope, onOpen }: EnvelopeCardProps) {
  const { opened } = envelope;
  const number = String(envelope.id + 1).padStart(2, '0');
  const isMoney = envelope.prize.amount > 0;

  return (
    <button
      type="button"
      disabled={opened}
      onClick={() => onOpen(envelope.id)}
      aria-label={opened ? `Bao số ${envelope.id + 1}: ${prizeLabel(envelope.prize)}` : `Mở bao lì xì số ${envelope.id + 1}`}
      data-theme="light"
      className="group relative aspect-[3/4] w-full [perspective:800px] disabled:cursor-default"
    >
      <span
        className={cn(
          'preserve-3d absolute inset-0 transition-transform duration-500 ease-house',
          !opened && 'group-hover:[transform:rotateX(12deg)_translateZ(18px)] group-active:[transform:translateZ(4px)]',
        )}
      >
        <span className="absolute inset-0 rounded-sm border border-[#f6cf6b]/50 shadow-[0_14px_20px_-10px_rgba(0,0,0,0.6)]" style={INSIDE} />

        <span
          className={cn(
            'absolute inset-x-[8%] bottom-[8%] top-[6%] flex flex-col items-center justify-start gap-0.5 rounded-sm border border-line bg-canvas px-1 pt-[7%] text-center transition-transform delay-300 duration-700 ease-house',
            opened ? '[transform:translateZ(1px)_translateY(-38%)]' : '[transform:translateZ(1px)]',
          )}
        >
          {opened && (
            <>
              <span className={cn('font-display text-sm font-extrabold sm:text-base', isMoney ? 'text-ramp-text-3' : 'text-ramp-text-1')}>
                {prizeLabel(envelope.prize)}
              </span>
              {envelope.openedBy && <span className="line-clamp-1 text-[10px] text-muted sm:text-xs">{envelope.openedBy}</span>}
            </>
          )}
        </span>

        <span className="absolute inset-0 flex items-end justify-center rounded-sm border-2 border-[#f6cf6b] pb-1.5 [transform:translateZ(2px)]" style={PATTERN}>
          <span className="font-display text-xs font-bold text-[#ffe9c2]">{number}</span>
        </span>

        <span
          className={cn(
            'preserve-3d absolute inset-x-0 top-0 h-[46%] origin-top transition-transform duration-500 ease-house',
            opened ? '[transform:translateZ(0.5px)_rotateX(180deg)]' : '[transform:translateZ(3px)]',
          )}
        >
          <span className={cn('backface-hidden absolute -inset-x-px top-0 h-[calc(100%+2px)] bg-[#12121a]/30', FLAP_DOWN)} />
          <span className={cn('backface-hidden absolute inset-0 [transform:translateZ(0.5px)]', FLAP_DOWN)} style={FLAP_PATTERN} />
          <span className={cn('backface-hidden absolute inset-0 [transform:rotateX(180deg)]', FLAP_UP)} style={INSIDE} />
          <span className="backface-hidden absolute inset-x-0 top-[58%] mx-auto flex aspect-square w-[38%] items-center justify-center rounded-full border-2 border-[#8e1912]/40 bg-[#f6cf6b] text-[10px] font-extrabold text-[#7a120c] shadow-[0_2px_4px_rgba(0,0,0,0.3)] [transform:translateZ(1px)] sm:text-xs">
            LỘC
          </span>
        </span>
      </span>
    </button>
  );
}
