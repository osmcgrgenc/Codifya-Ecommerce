import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/services/order-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Yeni sipariş oluşturan API endpoint'i
 * POST /api/orders/create
 */
export async function POST(request: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    
    // Kullanıcı giriş yapmamışsa erişimi reddet
    if (!session) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmanız gerekmektedir.' },
        { status: 401 }
      );
    }
    
    // İstek gövdesini al
    const body = await request.json();
    
    // Gerekli alanları kontrol et
    if (!body.totalAmount || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Toplam tutar ve en az bir ürün belirtilmelidir.' },
        { status: 400 }
      );
    }
    
    // Ürün öğelerini kontrol et
    for (const item of body.items) {
      if (!item.productId || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: 'Her ürün için ürün ID, miktar ve fiyat belirtilmelidir.' },
          { status: 400 }
        );
      }
    }
    
    // Sipariş verilerini hazırla
    const orderData = {
      userId: session.user.id,
      totalAmount: body.totalAmount,
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress,
      paymentMethod: body.paymentMethod,
      items: body.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    
    // Siparişi oluştur
    const newOrder = await orderService.createOrder(orderData);
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Sipariş oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 