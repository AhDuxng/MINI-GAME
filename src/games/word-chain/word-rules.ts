// Luật nối từ: chuẩn hoá từ nhập vào, kiểm tra số tiếng, tiếng nối và từ đã dùng
import { collapseSpaces } from '@/shared/lib/utils';

export type WordMode = 'chain' | 'topic';

const CHAIN_SYLLABLES = 2;

export type Validation = { ok: true; word: string } | { ok: false; reason: string };

export function normalizeWord(input: string) {
  return collapseSpaces(input.normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu, ' ')).toLowerCase();
}

export function lastSyllable(word: string) {
  const syllables = normalizeWord(word).split(' ');
  return syllables[syllables.length - 1];
}

export function validateWord(input: string, mode: WordMode, previous: string | null, used: string[]): Validation {
  const word = normalizeWord(input);
  if (!word) return { ok: false, reason: 'Bạn chưa nhập từ nào.' };
  if (used.includes(word)) return { ok: false, reason: `"${word}" đã được dùng rồi.` };
  if (mode === 'topic') return { ok: true, word };

  const syllables = word.split(' ');
  if (syllables.length !== CHAIN_SYLLABLES) return { ok: false, reason: 'Từ phải gồm đúng 2 tiếng.' };

  const required = previous ? lastSyllable(previous) : null;
  if (required && syllables[0] !== required) return { ok: false, reason: `Từ phải bắt đầu bằng "${required}".` };

  return { ok: true, word };
}
