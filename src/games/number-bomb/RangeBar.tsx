// Thanh khoảng số của Bom Số: hai đầu đã bị loại gạch chéo mờ, khoảng an toàn tô dải màu, vạch đánh dấu các số đã đoán và vị trí bom khi nổ
import type { BombRound } from './number-bomb-rules';

const HATCH = 'repeating-linear-gradient(45deg, rgb(var(--line)) 0 6px, transparent 6px 12px)';

export default function RangeBar({ round }: { round: BombRound }) {
  const percent = (value: number) => (value / round.max) * 100;
  const left = percent(round.low);
  const right = percent(round.max - round.high + 1);

  return (
    <div className="space-y-1.5">
      <div className="relative h-6 overflow-hidden rounded-full border border-line bg-elevated">
        <div className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-house" style={{ width: `${left}%`, background: HATCH }} />
        <div
          className="absolute inset-y-0 transition-[left,right] duration-500 ease-house"
          style={{ left: `${left}%`, right: `${right}%`, background: 'linear-gradient(90deg, var(--ramp-0), var(--ramp-2), var(--ramp-3))' }}
        />
        <div className="absolute inset-y-0 right-0 transition-[width] duration-500 ease-house" style={{ width: `${right}%`, background: HATCH }} />
        {round.guesses.map((guess) => (
          <span key={guess.value} className="absolute inset-y-0 w-0.5 bg-[#12121a]/55" style={{ left: `${percent(guess.value - 0.5)}%` }} />
        ))}
        {round.exploded && (
          <span className="absolute inset-y-0 w-1.5 -translate-x-1/2 bg-[#12121a]" style={{ left: `${percent(round.secret - 0.5)}%` }} />
        )}
      </div>
      <div className="flex justify-between text-xs font-bold text-muted">
        <span>1</span>
        <span>{round.max}</span>
      </div>
    </div>
  );
}
