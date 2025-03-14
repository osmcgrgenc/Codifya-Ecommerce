import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Metni URL dostu bir slug'a dönüştürür
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Decimal veri tiplerini number'a dönüştürür
 * Next.js Server Component'lerinden Client Component'lere veri aktarırken kullanılır
 */
export function convertDecimalToNumber<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertDecimalToNumber(item)) as unknown as T;
  }

  const result = { ...obj };

  for (const key in result) {
    const value = result[key];

    // Decimal tipindeki değerleri kontrol et
    if (
      value &&
      typeof value === 'object' &&
      'toNumber' in value &&
      typeof value.toNumber === 'function'
    ) {
      result[key] = value.toNumber();
    } else if (value && typeof value === 'object') {
      result[key] = convertDecimalToNumber(value);
    }
  }

  return result;
}
