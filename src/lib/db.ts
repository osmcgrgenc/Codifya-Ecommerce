import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Tarayıcı ortamında çalışmayı engelle
const isServer = typeof window === 'undefined';

// PrismaClient'ı sadece sunucu tarafında başlat
export const db = isServer ? globalThis.prisma || new PrismaClient() : ({} as PrismaClient); // Tarayıcı tarafında boş bir nesne döndür

// Geliştirme ortamında global nesneye kaydet (hot reloading için)
if (process.env.NODE_ENV !== 'production' && isServer) {
  globalThis.prisma = db;
}
