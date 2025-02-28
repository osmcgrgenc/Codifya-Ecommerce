import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

// Sepet öğesi tipi
interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

// Adres tipi
interface Address {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
}

// Banka transferi ödeme işlemi endpoint'i
export async function POST(req: NextRequest) {
  try {
    // Kullanıcı oturumunu kontrol et
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
    }

    // İstek gövdesini al
    const body = await req.json();
    const { items, totalAmount, shippingAddress, billingAddress } = body;

    if (!items || !items.length || !totalAmount) {
      return NextResponse.json({ error: 'Geçersiz sepet verileri' }, { status: 400 });
    }

    // Benzersiz referans kodu oluştur
    const referenceCode = `BT-${randomUUID().substring(0, 8).toUpperCase()}`;

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: 'PENDING_PAYMENT',
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        paymentMethod: 'bank_transfer',
        referenceCode,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      referenceCode,
      message: 'Sipariş başarıyla oluşturuldu. Lütfen ödemenizi referans kodu ile yapınız.',
    });
  } catch (error) {
    console.error('Banka transferi sipariş hatası:', error);
    return NextResponse.json({ error: 'Sipariş oluşturulurken bir hata oluştu' }, { status: 500 });
  }
}

// Banka transferi onaylama endpoint'i (admin için)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Sadece admin kullanıcılar bu endpoint'i kullanabilir
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekmektedir.' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { orderId, status, notes } = data as {
      orderId: string;
      status: 'PAID' | 'CANCELLED';
      notes?: string;
    };

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Geçersiz istek. Sipariş ID ve durum belirtilmelidir.' },
        { status: 400 }
      );
    }

    // Siparişi güncelle
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        notes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: 'success',
      message: `Sipariş durumu başarıyla '${status}' olarak güncellendi.`,
      order,
    });
  } catch (error) {
    console.error('Banka transferi onaylanırken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Banka transferi onaylanırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
