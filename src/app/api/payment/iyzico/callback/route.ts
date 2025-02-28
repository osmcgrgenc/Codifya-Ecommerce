import { NextRequest, NextResponse } from 'next/server';
import { retrievePaymentResult } from '@/lib/iyzico';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(new URL('/payment/error?message=Geçersiz ödeme token', req.url));
    }

    // URL'den sipariş ID'sini al
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.redirect(
        new URL('/payment/error?message=Sipariş bilgisi bulunamadı', req.url)
      );
    }

    // İyzico'dan ödeme sonucunu al
    const paymentResult = await retrievePaymentResult(token);

    if (paymentResult.status !== 'success' || paymentResult.paymentStatus !== 'SUCCESS') {
      // Ödeme başarısız, siparişi iptal et
      await db.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          notes: `Ödeme başarısız: ${paymentResult.errorMessage || 'Bilinmeyen hata'}`,
        },
      });

      return NextResponse.redirect(
        new URL(
          `/payment/error?message=${encodeURIComponent(paymentResult.errorMessage || 'Ödeme işlemi başarısız oldu')}`,
          req.url
        )
      );
    }

    // Ödeme başarılı, siparişi güncelle
    await db.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paymentId: paymentResult.paymentId,
      },
    });

    // Başarılı ödeme sayfasına yönlendir
    return NextResponse.redirect(new URL(`/orders/${orderId}?success=true`, req.url));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('İyzico callback hatası:', error);
    return NextResponse.redirect(
      new URL('/payment/error?message=Ödeme işlemi sırasında bir hata oluştu', req.url)
    );
  }
}
