// Bàn phím số cỡ lớn cho Bom Số: chín phím số, xoá hết, số 0 và xoá lùi, bấm thoải mái bằng ngón cái trên điện thoại
import { FaDeleteLeft } from 'react-icons/fa6';
import { cn } from '@/shared/lib/utils';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const KEY = 'flex h-14 select-none items-center justify-center rounded-xl border border-line bg-canvas font-display text-2xl font-bold text-ink shadow-[0_3px_0_rgb(0_0_0/0.35)] transition-[background-color,transform,box-shadow] duration-150 hover:bg-elevated active:translate-y-0.5 active:shadow-none disabled:opacity-40 sm:h-12';

interface KeypadProps {
  disabled?: boolean;
  onDigit: (digit: number) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export default function Keypad({ disabled, onDigit, onBackspace, onClear }: KeypadProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {DIGITS.map((digit) => (
        <button key={digit} type="button" className={KEY} disabled={disabled} onClick={() => onDigit(digit)}>
          {digit}
        </button>
      ))}
      <button type="button" className={cn(KEY, 'text-base text-muted')} disabled={disabled} onClick={onClear}>
        Xoá
      </button>
      <button type="button" className={KEY} disabled={disabled} onClick={() => onDigit(0)}>
        0
      </button>
      <button type="button" className={KEY} disabled={disabled} onClick={onBackspace} aria-label="Xoá lùi">
        <FaDeleteLeft className="h-6 w-6" />
      </button>
    </div>
  );
}
