// Mặt lưng và mặt nội dung của lá bài Thật/Thách; "Thật" dùng đầu lạnh, "Thách" dùng đầu ấm của dải màu
import type { PromptCard } from '@/data';
import { levelLabel } from '@/games/kit';
import { rampFill, rampText } from '@/shared/lib/ramp';
import type { PromptKind } from './useTruthDare';

export const KIND_STYLES: Record<PromptKind, { label: string; hint: string; from: number; to: number }> = {
  truth: { label: 'Thật', hint: 'Câu hỏi', from: 6, to: 8 },
  dare: { label: 'Thách', hint: 'Thử thách', from: 1, to: 3 },
};

export function CardBack({ kind }: { kind: PromptKind }) {
  const card = KIND_STYLES[kind];
  return (
    <span
      className="relative flex h-full w-full flex-col items-center justify-center gap-1 border border-[#12121a]/20 rounded-xl"
      style={{ background: `linear-gradient(135deg, ${rampFill(card.from)}, ${rampFill(card.to)})` }}
    >
      <span className="dot-screen absolute inset-0 opacity-60" />
      <span className="relative font-display text-4xl font-extrabold text-[#12121a] sm:text-5xl">{card.label}</span>
      <span className="relative text-sm font-bold text-[#12121a]/70">{card.hint}</span>
    </span>
  );
}

export function CardFront({ kind, card }: { kind: PromptKind; card: PromptCard }) {
  const style = KIND_STYLES[kind];
  return (
    <article className="surface flex min-h-[300px] w-full flex-col shadow-[0_30px_50px_-24px_rgba(0,0,0,0.6)]">
      <div className="h-2 rounded-t-[13px]" style={{ background: `linear-gradient(90deg, ${rampFill(style.from)}, ${rampFill(style.to)})` }} />
      <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-9 [transform:translateZ(20px)]">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-extrabold" style={{ color: rampText(style.to) }}>
            {style.label}
          </span>
          <span className="chip">{levelLabel(card.level)}</span>
        </div>
        <p className="text-balance text-center font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">{card.text}</p>
        <p className="text-center text-sm text-muted">Không dám? Uống 1 ngụm rồi đổi câu khác.</p>
      </div>
    </article>
  );
}
