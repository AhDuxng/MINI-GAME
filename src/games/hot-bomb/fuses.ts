// Các mức độ dài ngòi nổ của Bom Nổ Chậm (giây)
export type FuseId = 'short' | 'medium' | 'long';

export const FUSES: Record<FuseId, { label: string; min: number; max: number }> = {
  short: { label: 'Ngắn · 10–20s', min: 10, max: 20 },
  medium: { label: 'Vừa · 15–35s', min: 15, max: 35 },
  long: { label: 'Dài · 25–50s', min: 25, max: 50 },
};
