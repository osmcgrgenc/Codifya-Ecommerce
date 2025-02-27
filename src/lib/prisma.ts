import { PrismaClient } from "@prisma/client";

// PrismaClient'ın global bir örneğini oluştur
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Geliştirme ortamında birden fazla örnek oluşmasını önlemek için
// global bir değişken olarak saklıyoruz
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Geliştirme ortamında değilse, prisma'yı global değişkene ata
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 