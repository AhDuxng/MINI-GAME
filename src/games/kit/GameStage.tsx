// Sân khấu theo chủ đề của từng game, chạm vào chỗ trống hoặc vật thể trên sân khấu là chạy hành động chính của lúc đó (nút và ô nhập bên trong vẫn giữ việc riêng của chúng): khung bo góc với nền riêng (bàn nỉ, quầy bar, Tết, hồ nước, sân khấu, vùng nguy hiểm, phòng điều tra, bảng phấn, tiệc đêm, đêm trăng) nằm dưới nội dung; cảnh 3D trong suốt nên nền hiện ra phía sau, nền tối tự đổi chữ bên trong sang tông sáng
import { memo, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

export type StageTheme = 'felt' | 'bar' | 'tet' | 'pond' | 'show' | 'danger' | 'noir' | 'chalk' | 'party' | 'night';

const layer = 'pointer-events-none absolute';

function seeded(count: number, salt: number) {
  return Array.from({ length: count }, (_, index) => {
    const a = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    const b = Math.sin((index + 1) * 39.3468 + salt * 11.135) * 24634.6345;
    return { x: Math.round((a - Math.floor(a)) * 1e4) / 1e4, y: Math.round((b - Math.floor(b)) * 1e4) / 1e4, index };
  });
}

const TET_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><g fill='none' stroke='#f6cf6b' stroke-width='2' stroke-linecap='round'><path d='M8 40c0-9 12-9 12 0s12 9 12 0 12-9 12 0'/><path d='M14 40c0-4 6-4 6 0'/><path d='M56 84c0-9 12-9 12 0s12 9 12 0'/><circle cx='74' cy='22' r='7'/><circle cx='74' cy='22' r='2.5'/></g></svg>",
)}")`;

function Felt() {
  return (
    <>
      <div className={cn(layer, 'inset-0')} style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgb(255 255 255 / 0.035) 0 1px, transparent 1px 5px), repeating-linear-gradient(-45deg, rgb(0 0 0 / 0.06) 0 1px, transparent 1px 5px)' }} />
      <div className={cn(layer, 'inset-0')} style={{ background: 'radial-gradient(60% 45% at 50% 0%, rgb(255 255 255 / 0.14), transparent 70%)' }} />
      <div className={cn(layer, 'inset-x-[9%] inset-y-[14%] rounded-[50%] border-2 border-dashed border-white/[0.12]')} />
      <div className={cn(layer, 'inset-0 rounded-2xl')} style={{ boxShadow: 'inset 0 0 0 7px #6b4527, inset 0 0 0 9px #3f2716, inset 0 0 80px rgb(0 0 0 / 0.55)' }} />
    </>
  );
}

const BOKEH = ['#fbc175', '#fc9a75', '#f1e682', '#fb7c78'];

function Bar() {
  return (
    <>
      <div className={cn(layer, 'inset-0')} style={{ background: 'radial-gradient(70% 55% at 50% -10%, rgb(251 193 117 / 0.38), transparent 70%)' }} />
      {seeded(14, 3).map(({ x, y, index }) => (
        <span
          key={index}
          className={cn(layer, 'rounded-full')}
          style={{ left: `${x * 100}%`, top: `${y * 55}%`, width: 26 + (index % 4) * 18, height: 26 + (index % 4) * 18, background: BOKEH[index % BOKEH.length], opacity: 0.16 + (index % 3) * 0.08, filter: 'blur(9px)' }}
        />
      ))}
      <div className={cn(layer, 'inset-x-0 bottom-0 h-2/5')} style={{ background: 'linear-gradient(180deg, transparent, rgb(107 66 38 / 0.45)), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.025) 0 2px, transparent 2px 26px)' }} />
    </>
  );
}

function Lantern({ side }: { side: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 40 90" className={cn(layer, 'top-0 h-24 w-11 sm:h-28 sm:w-12', side === 'left' ? 'left-[6%]' : 'right-[6%]')}>
      <line x1={20} y1={0} x2={20} y2={22} stroke="#f6cf6b" strokeWidth={1.5} />
      <rect x={12} y={20} width={16} height={5} rx={1.5} fill="#f6cf6b" />
      <ellipse cx={20} cy={46} rx={17} ry={21} fill="#e8392b" stroke="#f6cf6b" strokeWidth={1.5} />
      <path d="M20 25 Q 8 46 20 67 M20 25 Q 32 46 20 67" fill="none" stroke="#f6cf6b" strokeWidth={1.2} opacity={0.8} />
      <rect x={12} y={66} width={16} height={5} rx={1.5} fill="#f6cf6b" />
      <path d="M16 71 v14 M20 71 v17 M24 71 v14" stroke="#f6cf6b" strokeWidth={1.5} />
    </svg>
  );
}

function Blossom({ x, y, size }: { x: string; y: string; size: number }) {
  return (
    <svg viewBox="-12 -12 24 24" className={cn(layer)} style={{ left: x, top: y, width: size, height: size }}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx={0} cy={-6} rx={4.2} ry={6} fill="#f6d34f" transform={`rotate(${angle})`} />
      ))}
      <circle r={3} fill="#e8892b" />
    </svg>
  );
}

function Tet() {
  return (
    <>
      <div className={cn(layer, 'inset-0 opacity-[0.16]')} style={{ backgroundImage: TET_PATTERN, backgroundSize: '96px 96px' }} />
      <div className={cn(layer, 'inset-0')} style={{ background: 'radial-gradient(55% 50% at 50% 45%, rgb(255 214 120 / 0.22), transparent 75%)' }} />
      <div className={cn(layer, 'inset-2.5 rounded-xl border border-[#f6cf6b]/50')} />
      <Lantern side="left" />
      <Lantern side="right" />
      <Blossom x="3%" y="78%" size={26} />
      <Blossom x="9%" y="88%" size={18} />
      <Blossom x="90%" y="80%" size={24} />
      <Blossom x="84%" y="90%" size={16} />
    </>
  );
}

function Pond() {
  return (
    <>
      <div className={cn(layer, 'right-[10%] top-[8%] h-24 w-24 rounded-full')} style={{ background: 'radial-gradient(circle, #fff6c9 0%, rgb(255 236 160 / 0.55) 45%, transparent 70%)' }} />
      {[
        ['8%', '14%', 120],
        ['30%', '6%', 90],
        ['58%', '18%', 140],
      ].map(([left, top, width]) => (
        <span key={left} className={cn(layer, 'h-8 rounded-full bg-white/70')} style={{ left, top, width, filter: 'blur(6px)' }} />
      ))}
      <div className={cn(layer, 'inset-x-0 bottom-0 h-1/2')} style={{ background: 'linear-gradient(180deg, transparent, rgb(53 149 155 / 0.25))' }} />
    </>
  );
}

function Show() {
  return (
    <>
      {(['left', 'right'] as const).map((side) => (
        <div
          key={side}
          className={cn(layer, '-top-6 h-[130%] w-[42%]', side === 'left' ? 'left-[2%] origin-top-left rotate-[-14deg]' : 'right-[2%] origin-top-right rotate-[14deg]')}
          style={{ background: 'linear-gradient(180deg, rgb(255 255 255 / 0.22), transparent 75%)', clipPath: side === 'left' ? 'polygon(0 0, 22% 0, 100% 100%, 40% 100%)' : 'polygon(78% 0, 100% 0, 60% 100%, 0 100%)', filter: 'blur(2px)' }}
        />
      ))}
      <div className={cn(layer, 'inset-x-0 bottom-0 h-1/2')} style={{ background: 'radial-gradient(60% 70% at 50% 100%, rgb(135 102 164 / 0.6), transparent 75%)' }} />
      {seeded(22, 7).map(({ x, y, index }) => (
        <span key={index} className={cn(layer, 'rounded-full')} style={{ left: `${x * 100}%`, top: `${y * 100}%`, width: 3 + (index % 3), height: 3 + (index % 3), background: `var(--ramp-${index % 9})`, opacity: 0.75 }} />
      ))}
    </>
  );
}

function Danger() {
  const stripes: CSSProperties = { backgroundImage: 'repeating-linear-gradient(-45deg, #f1c84b 0 12px, #1b1b1b 12px 24px)', opacity: 0.85 };
  return (
    <>
      <div className={cn(layer, 'inset-0')} style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.035) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className={cn(layer, 'inset-0')} style={{ background: 'radial-gradient(45% 40% at 50% 48%, rgb(251 124 120 / 0.3), transparent 75%)' }} />
      <div className={cn(layer, 'inset-x-0 top-0 h-2.5')} style={stripes} />
      <div className={cn(layer, 'inset-x-0 bottom-0 h-2.5')} style={stripes} />
    </>
  );
}

function Skyline() {
  return (
    <svg viewBox="0 0 400 80" preserveAspectRatio="none" className={cn(layer, 'inset-x-0 bottom-0 h-[22%] w-full')}>
      <path d="M0 80 V44 H22 V30 H40 V50 H58 V18 H80 V40 H96 V26 H122 V52 H140 V34 H160 V12 H178 V44 H198 V30 H220 V48 H240 V22 H262 V40 H280 V28 H300 V50 H318 V16 H338 V42 H356 V32 H378 V46 H400 V80 Z" fill="#07101a" />
      {seeded(18, 5).map(({ x, y, index }) => (
        <rect key={index} x={x * 390} y={30 + y * 40} width={4} height={5} fill="#fbc175" opacity={0.55} />
      ))}
    </svg>
  );
}

function Noir() {
  return (
    <>
      <div className={cn(layer, 'inset-0')} style={{ backgroundImage: 'repeating-linear-gradient(105deg, rgb(255 255 255 / 0.03) 0 1px, transparent 1px 10px)' }} />
      <div className={cn(layer, 'inset-0')} style={{ background: 'radial-gradient(42% 60% at 50% 12%, rgb(241 230 130 / 0.24), transparent 70%)' }} />
      <Skyline />
    </>
  );
}

const CHALK_LETTERS = ['A', 'Ă', 'B', 'C', 'Đ', 'Ê', 'G', 'H', 'Ô', 'Ư', 'N', 'T'];

function Chalk() {
  return (
    <>
      {seeded(5, 9).map(({ x, y, index }) => (
        <span key={index} className={cn(layer, 'h-32 w-48 rounded-full')} style={{ left: `${x * 80}%`, top: `${y * 70}%`, background: 'radial-gradient(closest-side, rgb(255 255 255 / 0.07), transparent)' }} />
      ))}
      {seeded(CHALK_LETTERS.length, 4).map(({ x, y, index }) => (
        <span key={index} className={cn(layer, 'font-display font-extrabold text-white/[0.08]')} style={{ left: `${4 + x * 88}%`, top: `${4 + y * 84}%`, fontSize: 22 + (index % 3) * 10, transform: `rotate(${(index % 5) * 9 - 18}deg)` }}>
          {CHALK_LETTERS[index]}
        </span>
      ))}
      <div className={cn(layer, 'inset-0 rounded-2xl')} style={{ boxShadow: 'inset 0 0 0 7px #8a5a35, inset 0 0 0 9px #5c3a21, inset 0 0 60px rgb(0 0 0 / 0.45)' }} />
    </>
  );
}

function Party() {
  return (
    <>
      {[
        ['-8%', '-10%', 3],
        ['62%', '-14%', 5],
        ['28%', '48%', 7],
      ].map(([left, top, stop]) => (
        <span key={String(stop)} className={cn(layer, 'h-64 w-64 rounded-full')} style={{ left: String(left), top: String(top), background: `var(--ramp-${stop})`, opacity: 0.32, filter: 'blur(48px)' }} />
      ))}
      <div className={cn(layer, '-inset-x-1/4 bottom-0 h-1/2 origin-bottom')} style={{ backgroundImage: 'linear-gradient(rgb(230 147 157 / 0.22) 1px, transparent 1px), linear-gradient(90deg, rgb(230 147 157 / 0.22) 1px, transparent 1px)', backgroundSize: '36px 36px', transform: 'perspective(260px) rotateX(58deg)', maskImage: 'linear-gradient(180deg, transparent, black 70%)', WebkitMaskImage: 'linear-gradient(180deg, transparent, black 70%)' }} />
      {seeded(16, 2).map(({ x, y, index }) => (
        <span key={index} className={cn(layer, 'h-1.5 w-3 rounded-sm')} style={{ left: `${x * 100}%`, top: `${y * 60}%`, background: `var(--ramp-${(index * 2) % 9})`, transform: `rotate(${index * 37}deg)`, opacity: 0.7 }} />
      ))}
    </>
  );
}

function Night() {
  return (
    <>
      {seeded(40, 11).map(({ x, y, index }) => (
        <span key={index} className={cn(layer, 'rounded-full bg-[#f4f1ff]')} style={{ left: `${x * 100}%`, top: `${y * 70}%`, width: index % 6 === 0 ? 3 : 1.5, height: index % 6 === 0 ? 3 : 1.5, opacity: 0.35 + (index % 4) * 0.15 }} />
      ))}
      <span className={cn(layer, 'right-[8%] top-[8%] h-16 w-16 rounded-full shadow-[0_0_60px_18px_rgba(241,230,130,0.2)]')} style={{ background: 'radial-gradient(circle at 35% 35%, #fffbe8, #f1e682 60%, #c9b956)' }} />
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" className={cn(layer, 'inset-x-0 bottom-0 h-[16%] w-full fill-[#020308]')}>
        <path d="M0 60 L0 40 L18 30 L30 38 L44 16 L58 36 L74 22 L90 40 L110 26 L126 42 L150 18 L170 38 L190 30 L214 44 L236 14 L256 38 L274 26 L296 42 L318 22 L338 38 L360 28 L380 42 L400 34 L400 60 Z" />
      </svg>
    </>
  );
}

interface Preset {
  tone: 'light' | 'dark';
  base: string;
  Decor: () => JSX.Element;
}

const PRESETS: Record<StageTheme, Preset> = {
  felt: { tone: 'dark', base: 'radial-gradient(120% 95% at 50% 35%, #2f8a64 0%, #1f6a4c 45%, #10392b 100%)', Decor: Felt },
  bar: { tone: 'dark', base: 'linear-gradient(180deg, #2d1b12 0%, #1c110b 60%, #120a07 100%)', Decor: Bar },
  tet: { tone: 'dark', base: 'radial-gradient(120% 95% at 50% 30%, #d23a2c 0%, #a3231a 50%, #6f120d 100%)', Decor: Tet },
  pond: { tone: 'light', base: 'linear-gradient(180deg, #8fd0e6 0%, #c6ebf1 48%, #e6f6ee 100%)', Decor: Pond },
  show: { tone: 'dark', base: 'radial-gradient(120% 100% at 50% 0%, #4a2a80 0%, #26134a 55%, #150a2b 100%)', Decor: Show },
  danger: { tone: 'dark', base: 'radial-gradient(110% 90% at 50% 45%, #43211d 0%, #24151a 55%, #0f0b0d 100%)', Decor: Danger },
  noir: { tone: 'dark', base: 'linear-gradient(165deg, #0f1d2e 0%, #142a3f 50%, #0a131e 100%)', Decor: Noir },
  chalk: { tone: 'dark', base: 'radial-gradient(120% 100% at 50% 40%, #36473f 0%, #27342f 60%, #1b2421 100%)', Decor: Chalk },
  party: { tone: 'dark', base: 'linear-gradient(160deg, #1d1235 0%, #140c26 55%, #0c0718 100%)', Decor: Party },
  night: { tone: 'dark', base: 'radial-gradient(ellipse at 70% 0%, #1b2140 0%, #0a0c18 55%, #04050a 100%)', Decor: Night },
};

interface GameStageProps {
  theme: StageTheme;
  className?: string;
  children: ReactNode;
  onTap?: () => void;
}

const OWN_INTERACTION = 'button, a, input, textarea, select, label, [role="button"], [data-tap-ignore]';

function DecorLayer({ theme }: { theme: StageTheme }) {
  const { base, Decor } = PRESETS[theme];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl" style={{ background: base }}>
      <Decor />
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.08),inset_0_-40px_80px_-40px_rgb(0_0_0_/_0.5)]" />
    </div>
  );
}

const MemoDecor = memo(DecorLayer);

export default function GameStage({ theme, className, children, onTap }: GameStageProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onTap) return;
    const owner = (event.target as HTMLElement).closest(OWN_INTERACTION);
    if (owner && event.currentTarget.contains(owner)) return;
    onTap();
  };

  return (
    <div data-theme={PRESETS[theme].tone} onClick={onTap ? handleClick : undefined} className={cn('relative isolate rounded-2xl text-ink shadow-stage', onTap && 'cursor-pointer select-none', className)}>
      <MemoDecor theme={theme} />
      {children}
    </div>
  );
}
