// Tiện ích dùng chung: gộp class Tailwind và chuẩn hoá chuỗi tiếng Việt
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const MAX_LINE_LENGTH = 40;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export function collapseSpaces(text: string) {
  return text.trim().replace(/\s+/g, ' ');
}

export function stripDiacritics(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function searchKey(text: string) {
  return stripDiacritics(collapseSpaces(text)).toLowerCase();
}

export function parseLines(text: string, { unique = false } = {}) {
  const lines = text
    .split('\n')
    .map((line) => collapseSpaces(line).slice(0, MAX_LINE_LENGTH))
    .filter(Boolean);

  if (!unique) return lines;

  const seen = new Set<string>();
  return lines.filter((line) => {
    const key = searchKey(line);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatClock(date: Date) {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
