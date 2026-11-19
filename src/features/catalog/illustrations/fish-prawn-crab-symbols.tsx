// Hình vẽ 6 linh vật Bầu Cua dùng chung cho game và ảnh thu nhỏ, kèm danh sách mã linh vật làm chuẩn cho luật chơi
import type { CSSProperties, ReactElement } from 'react';

export const FISH_PRAWN_CRAB_SYMBOL_IDS = ['gourd', 'crab', 'shrimp', 'fish', 'rooster', 'deer'] as const;
export type SymbolId = (typeof FISH_PRAWN_CRAB_SYMBOL_IDS)[number];

const INK = 'rgb(var(--ink))';
const CANVAS = 'rgb(var(--canvas))';
const ON_RAMP = '#12121a';
const ramp = (stop: number) => `var(--ramp-${stop})`;
const inked = (fill: string): CSSProperties => ({ fill, stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' });
const line: CSSProperties = { fill: 'none', stroke: INK, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' };

function Gourd() {
  return (
    <g>
      <path d="M32 5 V13" style={line} />
      <path d="M33 11 Q42 2 50 7 Q42 15 33 11 Z" style={inked(ramp(7))} />
      <circle cx={32} cy={44} r={15} style={inked(ramp(8))} />
      <circle cx={32} cy={23} r={10} style={inked(ramp(8))} />
      <ellipse cx={26} cy={40} rx={4} ry={6} style={{ fill: CANVAS, opacity: 0.55 }} />
      <ellipse cx={28} cy={21} rx={2.5} ry={3.5} style={{ fill: CANVAS, opacity: 0.55 }} />
    </g>
  );
}

function Crab() {
  return (
    <g>
      {[-1, 1].map((side) => (
        <g key={side}>
          <path d={`M${32 + side * 14} 40 L${32 + side * 26} 46 M${32 + side * 14} 44 L${32 + side * 25} 53 M${32 + side * 12} 47 L${32 + side * 20} 58`} style={line} />
          <path d={`M${32 + side * 12} 32 Q${32 + side * 20} 24 ${32 + side * 19} 18`} style={line} />
          <circle cx={32 + side * 19} cy={15} r={7} style={inked(ramp(3))} />
          <path d={`M${32 + side * 19} 15 L${32 + side * 24} 9`} style={{ ...line, stroke: CANVAS }} />
        </g>
      ))}
      <ellipse cx={32} cy={40} rx={17} ry={12} style={inked(ramp(3))} />
      <path d="M27 29 V23 M37 29 V23" style={line} />
      <circle cx={27} cy={22} r={3} style={inked(CANVAS)} />
      <circle cx={37} cy={22} r={3} style={inked(CANVAS)} />
      <path d="M27 44 Q32 48 37 44" style={line} />
    </g>
  );
}

function Shrimp() {
  return (
    <g>
      <path d="M44 14 Q56 6 60 10 M42 16 Q50 18 58 22" style={line} />
      <path d="M44 18 C30 10 12 20 14 36 C16 48 28 54 38 48" style={{ ...line, strokeWidth: 19 }} />
      <path d="M44 18 C30 10 12 20 14 36 C16 48 28 54 38 48" style={{ fill: 'none', stroke: ramp(2), strokeWidth: 13, strokeLinecap: 'round' }} />
      <path d="M24 16 L28 26 M16 28 L25 31 M15 40 L24 38 M22 49 L28 44" style={{ ...line, strokeWidth: 2 }} />
      <path d="M38 48 L48 42 L46 54 Z" style={inked(ramp(2))} />
      <circle cx={42} cy={18} r={2.5} style={{ fill: ON_RAMP }} />
    </g>
  );
}

function Fish() {
  return (
    <g>
      <path d="M14 32 L3 20 L3 44 Z" style={inked(ramp(6))} />
      <path d="M28 20 Q34 8 44 18" style={inked(ramp(7))} />
      <ellipse cx={34} cy={32} rx={21} ry={14} style={inked(ramp(6))} />
      <path d="M24 26 Q28 32 24 38 M31 25 Q35 32 31 39" style={{ ...line, strokeWidth: 2 }} />
      <circle cx={45} cy={28} r={4.5} style={inked(CANVAS)} />
      <circle cx={46} cy={28} r={2} style={{ fill: ON_RAMP }} />
      <path d="M50 37 Q53 38 55 36" style={line} />
    </g>
  );
}

function Rooster() {
  return (
    <g>
      <path d="M18 30 Q4 18 8 6 Q16 16 22 24 Z" style={inked(ramp(5))} />
      <path d="M18 34 Q2 30 4 16 Q14 24 22 30 Z" style={inked(ramp(7))} />
      <path d="M26 52 V60 M34 52 V60" style={line} />
      <ellipse cx={30} cy={40} rx={16} ry={13} style={inked(ramp(0))} />
      <path d="M38 14 Q40 6 44 10 Q46 4 50 9 Q54 6 54 13 Z" style={inked(ramp(3))} />
      <circle cx={45} cy={23} r={10} style={inked(ramp(0))} />
      <path d="M54 22 L62 25 L54 28 Z" style={inked(ramp(1))} />
      <path d="M52 30 Q54 37 49 36 Z" style={inked(ramp(3))} />
      <circle cx={47} cy={21} r={2} style={{ fill: ON_RAMP }} />
      <path d="M22 40 Q30 46 36 38" style={{ ...line, strokeWidth: 2 }} />
    </g>
  );
}

function Deer() {
  return (
    <g>
      <path d="M22 18 L14 4 M17 10 L8 10 M42 18 L50 4 M47 10 L56 10" style={line} />
      <ellipse cx={14} cy={26} rx={8} ry={4.5} transform="rotate(-25 14 26)" style={inked(ramp(1))} />
      <ellipse cx={50} cy={26} rx={8} ry={4.5} transform="rotate(25 50 26)" style={inked(ramp(1))} />
      <path d="M20 22 Q32 14 44 22 Q48 40 32 58 Q16 40 20 22 Z" style={inked(ramp(1))} />
      <ellipse cx={32} cy={48} rx={8} ry={7} style={inked(CANVAS)} />
      <circle cx={32} cy={45} r={3} style={{ fill: ON_RAMP }} />
      <circle cx={26} cy={30} r={2.4} style={{ fill: ON_RAMP }} />
      <circle cx={38} cy={30} r={2.4} style={{ fill: ON_RAMP }} />
      <circle cx={24} cy={38} r={1.6} style={{ fill: CANVAS }} />
      <circle cx={40} cy={38} r={1.6} style={{ fill: CANVAS }} />
    </g>
  );
}

export interface FishPrawnCrabSymbol {
  id: SymbolId;
  name: string;
  stop: number;
  Glyph: () => ReactElement;
}

export const SYMBOLS: FishPrawnCrabSymbol[] = [
  { id: 'gourd', name: 'Bầu', stop: 8, Glyph: Gourd },
  { id: 'crab', name: 'Cua', stop: 3, Glyph: Crab },
  { id: 'shrimp', name: 'Tôm', stop: 2, Glyph: Shrimp },
  { id: 'fish', name: 'Cá', stop: 6, Glyph: Fish },
  { id: 'rooster', name: 'Gà', stop: 0, Glyph: Rooster },
  { id: 'deer', name: 'Nai', stop: 1, Glyph: Deer },
];

export function getSymbol(id: SymbolId) {
  return SYMBOLS.find((symbol) => symbol.id === id) ?? SYMBOLS[0];
}

export function SymbolIcon({ id, className }: { id: SymbolId; className?: string }) {
  const { Glyph, name } = getSymbol(id);
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={name} className={className}>
      <Glyph />
    </svg>
  );
}
