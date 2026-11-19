// Các hàm ngẫu nhiên thuần dùng cho logic game
export function randomInt(maxExclusive: number) {
  return Math.floor(Math.random() * maxExclusive);
}

export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function pickRandom<T>(items: readonly T[]): T {
  return items[randomInt(items.length)];
}

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
