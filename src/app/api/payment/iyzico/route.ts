import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createPaymentForm, retrievePaymentResult } from '@/lib/iyzico';
import { prisma } from '@/lib/prisma';

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

// Ödeme formu oluşturma endpoint'i
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

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: 'PENDING_PAYMENT',
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        paymentMethod: 'iyzico',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // İyzico ödeme formu oluştur
    const paymentData = {
      locale: 'tr',
      conversationId: order.id,
      price: totalAmount.toString(),
      paidPrice: totalAmount.toString(),
      currency: 'TRY',
      basketId: order.id,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/iyzico/callback?orderId=${order.id}`,
      buyer: {
        id: session.user.id,
        name: shippingAddress.contactName.split(' ')[0] || '',
        surname: shippingAddress.contactName.split(' ').slice(1).join(' ') || '',
        gsmNumber: '+905350000000', // Varsayılan telefon numarası
        email: session.user.email || '',
        identityNumber: '11111111111', // TC Kimlik No (test için)
        registrationAddress: shippingAddress.address,
        ip: '85.34.78.112', // Test IP adresi
        city: shippingAddress.city,
        country: shippingAddress.country,
        zipCode: shippingAddress.zipCode,
      },
      shippingAddress: {
        contactName: shippingAddress.contactName,
        city: shippingAddress.city,
        country: shippingAddress.country,
        address: shippingAddress.address,
        zipCode: shippingAddress.zipCode,
      },
      billingAddress: {
        contactName: billingAddress.contactName,
        city: billingAddress.city,
        country: billingAddress.country,
        address: billingAddress.address,
        zipCode: billingAddress.zipCode,
      },
      basketItems: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        category1: item.category || 'Genel',
        itemType: 'PHYSICAL',
        price: (item.price * item.quantity).toString(),
      })),
    };

    const result = await createPaymentForm(paymentData);

    if (result.status !== 'success') {
      // Ödeme formu oluşturulamadı, siparişi iptal et
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      });

      return NextResponse.json({ error: 'Ödeme formu oluşturulamadı' }, { status: 500 });
    }

    // Ödeme sayfası URL'sini döndür
    return NextResponse.json({
      paymentPageUrl: result.paymentPageUrl,
      orderId: order.id,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Ödeme işlemi başlatılırken bir hata oluştu', error: error },
      { status: 500 }
    );
  }
}

// Ödeme sonucu callback endpoint'i
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Geçersiz ödeme token.' }, { status: 400 });
    }

    // İyzico'dan ödeme sonucunu al
    const paymentResult = await retrievePaymentResult(token);

    if (!paymentResult || typeof paymentResult !== 'object') {
      throw new Error('Ödeme sonucu alınamadı');
    }

    // Ödeme başarılıysa siparişi güncelle
    if (paymentResult.status === 'success') {
      const orderId = paymentResult.conversationId;

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          paymentId: paymentResult.paymentId || '',
          paymentMethod: 'IYZICO',
        },
      });

      // Kullanıcıyı başarılı ödeme sayfasına yönlendir
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/orders/success?orderId=${orderId}`
      );
    } else {
      // Ödeme başarısızsa siparişi iptal et
      const orderId = paymentResult.conversationId;

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          paymentId: paymentResult.paymentId || '',
          paymentMethod: 'IYZICO',
        },
      });

      // Kullanıcıyı başarısız ödeme sayfasına yönlendir
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/orders/failed?orderId=${orderId}`
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ödeme sonucu işlenirken hata oluştu:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/orders/failed?error=payment-process-error`
    );
  }
}
