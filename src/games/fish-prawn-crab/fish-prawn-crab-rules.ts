// Luật Bầu Cua thuần: sáu linh vật, lắc ba xúc xắc và tính điểm thắng thua cho từng người theo số xúc xắc trùng ô đã cược
import { FISH_PRAWN_CRAB_SYMBOL_IDS, type SymbolId } from '@/features/catalog';

export const SYMBOL_IDS = FISH_PRAWN_CRAB_SYMBOL_IDS;
export const DICE_COUNT = 3;

export type { SymbolId };
export type Bets = Partial<Record<SymbolId, number>>;

export function rollDice(random: () => number = Math.random): SymbolId[] {
  return Array.from({ length: DICE_COUNT }, () => SYMBOL_IDS[Math.floor(random() * SYMBOL_IDS.length)]);
}

export function countMatches(roll: SymbolId[], symbol: SymbolId) {
  return roll.filter((face) => face === symbol).length;
}

export function totalStake(bets: Bets) {
  return SYMBOL_IDS.reduce((sum, symbol) => sum + (bets[symbol] ?? 0), 0);
}

export function settleBets(bets: Bets, roll: SymbolId[]) {
  return SYMBOL_IDS.reduce((net, symbol) => {
    const stake = bets[symbol] ?? 0;
    if (stake === 0) return net;
    const matches = countMatches(roll, symbol);
    return net + (matches > 0 ? stake * matches : -stake);
  }, 0);
}
