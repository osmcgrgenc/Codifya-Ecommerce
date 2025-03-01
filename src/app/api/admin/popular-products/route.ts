import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { OrderStatus, OrderItem } from '@prisma/client';

interface ProductWithSales {
  id: string;
  name: string;
  price: number;
  soldCount: number;
}

export async function GET() {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    // Tüm sipariş öğelerini getir (tamamlanmış siparişlerden)
    const orderItems = await db.orderItem.findMany({
      where: {
        order: {
          status: {
            in: [OrderStatus.PAID, OrderStatus.DELIVERED],
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    // Ürünleri grupla ve satış sayılarını hesapla
    const productSales = new Map<string, ProductWithSales>();

    orderItems.forEach((item: any) => {
      const productId = item.product.id;
      if (!productSales.has(productId)) {
        productSales.set(productId, {
          id: productId,
          name: item.product.name,
          price: item.product.price,
          soldCount: 0,
        });
      }

      const productData = productSales.get(productId);
      if (productData) {
        productData.soldCount += item.quantity;
      }
    });

    // Satış sayısına göre sırala ve ilk 5'i al
    const popularProducts = Array.from(productSales.values())
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5);

    return NextResponse.json(popularProducts);
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}
