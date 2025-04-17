import { prisma } from '@/lib/prisma';

export const heroService = {
  async getActiveHero() {
    return prisma.heroSection.findFirst({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
};