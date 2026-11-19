// Lá "Cháy" lấp ló cho người chưa VIP: cứ vài lá lại hé vài chữ đầu của một lá mức Cháy thật, phần còn lại làm mờ, chạm vào thì mở hộp thoại mua vé; chỉ hiện khi người chơi đang chọn mức Sôi động hoặc Tất cả
'use client';

import { FaFire, FaLock } from 'react-icons/fa6';
import { HERO_PLAN_ID, getPlan, usePremium } from '@/features/billing';
import { ALL_LEVELS } from './deck';
import { formatCurrency } from '@/shared/lib/utils';

export const TEASE_EVERY = 4;
const TEASE_LEVELS = [2, ALL_LEVELS];
const VISIBLE_WORDS = 3;

export function shouldTease(isVip: boolean, level: number, draws: number) {
  return !isVip && TEASE_LEVELS.includes(level) && draws > 0 && draws % TEASE_EVERY === 0;
}

export function teaserText(texts: string[], draws: number) {
  return texts.length > 0 ? texts[(draws * 7) % texts.length] : null;
}

export default function LockedTeaser({ text }: { text: string }) {
  const { openPaywall } = usePremium();
  const words = text.split(' ');
  const shown = words.slice(0, VISIBLE_WORDS).join(' ');
  const hidden = words.slice(VISIBLE_WORDS).join(' ');

  return (
    <button
      type="button"
      onClick={() => openPaywall('Lá này thuộc mức "Cháy". Mở VIP để lật hết các lá Cháy cho cả bàn.')}
      className="flex w-full items-center gap-3 rounded-xl border-2 border-edge bg-[linear-gradient(115deg,color-mix(in_srgb,var(--ramp-3)_22%,rgb(var(--canvas))),color-mix(in_srgb,var(--ramp-1)_22%,rgb(var(--canvas))))] px-4 py-3 text-left transition-transform active:scale-[0.99]"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-ramp-3 text-[#12121a]">
        <FaFire className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ramp-text-3">
          <FaLock className="h-2.5 w-2.5" />
          Lá Cháy đang bị khoá
        </span>
        <span className="block truncate font-display text-base font-bold text-ink">
          {shown}{' '}
          <span aria-hidden className="select-none blur-[5px]">
            {hidden}
          </span>
        </span>
      </span>
      <span className="flex-shrink-0 rounded-full bg-[#12121a] px-3 py-1.5 font-display text-xs font-extrabold text-[#fbc175]">Lật · {formatCurrency(getPlan(HERO_PLAN_ID).price)}</span>
    </button>
  );
}
