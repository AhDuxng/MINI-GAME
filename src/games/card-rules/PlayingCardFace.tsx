// Mặt lá bài Luật Bài: hai góc ghi lá và chất, chất lớn ở giữa kèm tên luật và lời luật, viền cam; mặt lưng hoa văn dải màu dùng cho chồng bài
import { cn } from '@/shared/lib/utils';
import { ruleFor, suitOf, type PlayingCard } from './card-deck';

export function CardBack() {
  return (
    <span className="relative flex h-full w-full overflow-hidden border-2 border-edge bg-[linear-gradient(135deg,var(--ramp-3),var(--ramp-5))] p-2.5 rounded-xl">
      <span className="dot-screen absolute inset-0 opacity-60" />
      <span className="relative flex flex-1 flex-col items-center justify-center gap-1 rounded-lg border-2 border-white/70">
        <span className="font-display text-4xl font-extrabold leading-none text-white">♠ ♥</span>
        <span className="font-display text-4xl font-extrabold leading-none text-white">♣ ♦</span>
        <span className="mt-2 font-display text-lg font-extrabold uppercase tracking-wider text-white">Luật Bài</span>
      </span>
    </span>
  );
}

function Corner({ rank, symbol, className }: { rank: string; symbol: string; className: string }) {
  return (
    <span className={cn('absolute flex flex-col items-center leading-none', className)}>
      <span className="font-display text-3xl font-extrabold">{rank}</span>
      <span className="text-xl">{symbol}</span>
    </span>
  );
}

interface CardFaceProps {
  card: PlayingCard;
  order: number;
  drawer: string | null;
}

export function CardFace({ card, order, drawer }: CardFaceProps) {
  const suit = suitOf(card.suit);
  const rule = ruleFor(card.rank);
  const tone = suit.red ? 'text-ramp-text-3' : 'text-ink';

  return (
    <article className="relative flex aspect-[5/7] w-full flex-col border-2 border-edge bg-canvas p-4 shadow-[0_30px_50px_-24px_rgba(0,0,0,0.75)] rounded-xl">
      <Corner rank={card.rank} symbol={suit.symbol} className={cn('left-3 top-3', tone)} />
      <Corner rank={card.rank} symbol={suit.symbol} className={cn('bottom-3 right-3 rotate-180', tone)} />
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
        <span className={cn('text-7xl leading-none', tone)}>{suit.symbol}</span>
        <p className="font-display text-3xl font-extrabold leading-tight text-ink">{rule.title}</p>
        <p className="text-balance text-sm font-semibold leading-relaxed text-muted sm:text-base">{rule.rule}</p>
      </div>
      <p className="text-center text-xs font-bold text-muted">
        Lá thứ {order}
        {drawer ? ` · ${drawer} rút` : ''}
      </p>
    </article>
  );
}
