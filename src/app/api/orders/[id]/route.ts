import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/services/order-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrderStatus, UserRole } from '@prisma/client';

/**
 * Belirli bir siparişi getiren API endpoint'i
 * GET /api/orders/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Siparişi getir
    const order = await orderService.getOrderById(params.id);
    
    // Sipariş bulunamadıysa hata döndür
    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı.' },
        { status: 404 }
      );
    }
    
    // Admin tüm siparişleri görebilir, normal kullanıcı sadece kendi siparişlerini görebilir
    if (session.user.role !== UserRole.ADMIN && order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmamaktadır.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Sipariş getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Sipariş getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

/**
 * Sipariş durumunu güncelleyen API endpoint'i
 * PATCH /api/orders/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    
    // Kullanıcı giriş yapmamışsa veya admin değilse erişimi reddet
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmamaktadır.' },
        { status: 403 }
      );
    }
    
    // İstek gövdesini al
    const body = await request.json();
    
    // Durum alanını kontrol et
    if (!body.status || !Object.values(OrderStatus).includes(body.status)) {
      return NextResponse.json(
        { error: 'Geçerli bir sipariş durumu belirtilmelidir.' },
        { status: 400 }
      );
    }
    
    // Siparişin var olup olmadığını kontrol et
    const existingOrder = await orderService.getOrderById(params.id);
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı.' },
        { status: 404 }
      );
    }
    
    // Sipariş durumunu güncelle
    const updatedOrder = await orderService.updateOrderStatus(params.id, body.status);
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Sipariş güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Sipariş güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

/**
 * Siparişi iptal eden API endpoint'i
 * DELETE /api/orders/[id]
 * Not: Gerçek bir silme işlemi yapmaz, sadece durumu CANCELLED olarak günceller
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Siparişi getir
    const order = await orderService.getOrderById(params.id);
    
    // Sipariş bulunamadıysa hata döndür
    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı.' },
        { status: 404 }
      );
    }
    
    // Admin tüm siparişleri iptal edebilir, normal kullanıcı sadece kendi siparişlerini iptal edebilir
    if (session.user.role !== UserRole.ADMIN && order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmamaktadır.' },
        { status: 403 }
      );
    }
    
    // Sipariş durumunu CANCELLED olarak güncelle
    const cancelledOrder = await orderService.updateOrderStatus(params.id, OrderStatus.CANCELLED);
    
    return NextResponse.json(cancelledOrder);
  } catch (error) {
    console.error('Sipariş iptal edilirken hata:', error);
    return NextResponse.json(
      { error: 'Sipariş iptal edilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 