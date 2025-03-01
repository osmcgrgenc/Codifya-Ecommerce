import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Order, OrderStatus } from '@prisma/client';

export async function GET() {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    // Şu anki ay ve geçen ay için tarih aralıkları
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgoStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    // Tamamlanmış siparişleri getir (PAID veya DELIVERED durumunda)
    const currentMonthOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: currentMonthStart,
        },
        status: {
          in: [OrderStatus.PAID, OrderStatus.DELIVERED],
        },
      },
    });

    const lastMonthOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lt: currentMonthStart,
        },
        status: {
          in: [OrderStatus.PAID, OrderStatus.DELIVERED],
        },
      },
    });

    const twoMonthsAgoOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: twoMonthsAgoStart,
          lt: lastMonthStart,
        },
        status: {
          in: [OrderStatus.PAID, OrderStatus.DELIVERED],
        },
      },
    });

    // Toplam müşteri sayısı
    const currentMonthCustomers = await db.user.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
        },
      },
    });

    const lastMonthCustomers = await db.user.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lt: currentMonthStart,
        },
      },
    });

    // İstatistikleri hesapla
    const currentMonthSales = currentMonthOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
    const lastMonthSales = lastMonthOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
    const twoMonthsAgoSales = twoMonthsAgoOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);

    const currentMonthOrderCount = currentMonthOrders.length;
    const lastMonthOrderCount = lastMonthOrders.length;
    const twoMonthsAgoOrderCount = twoMonthsAgoOrders.length;

    // Büyüme oranları
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const salesGrowth = calculateGrowth(currentMonthSales, lastMonthSales);
    const ordersGrowth = calculateGrowth(currentMonthOrderCount, lastMonthOrderCount);
    const customersGrowth = calculateGrowth(currentMonthCustomers, lastMonthCustomers);

    // Ortalama sipariş değeri
    const currentAOV = currentMonthOrderCount > 0 ? currentMonthSales / currentMonthOrderCount : 0;
    const lastAOV = lastMonthOrderCount > 0 ? lastMonthSales / lastMonthOrderCount : 0;
    const aovGrowth = calculateGrowth(currentAOV, lastAOV);

    // Toplam istatistikler
    const totalOrders = await db.order.count({
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.DELIVERED],
        },
      },
    });

    const totalCustomers = await db.user.count();
    const totalSales = await db.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.DELIVERED],
        },
      },
    });

    const averageOrderValue = totalOrders > 0 ? (totalSales._sum.totalAmount || 0) / totalOrders : 0;

    return NextResponse.json({
      totalSales: totalSales._sum.totalAmount || 0,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      salesGrowth,
      ordersGrowth,
      customersGrowth,
      aovGrowth,
    });
  } catch (error) {
    console.error('İstatistik verileri alınırken hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 