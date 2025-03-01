import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/services/order-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

/**
 * Kullanıcının siparişlerini getiren API endpoint'i
 * GET /api/orders
 */
export async function GET(request: NextRequest) {
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
    
    // Admin tüm siparişleri görebilir, normal kullanıcı sadece kendi siparişlerini görebilir
    let orders;
    
    if (session.user.role === UserRole.ADMIN) {
      // URL'den sorgu parametrelerini al
      const searchParams = request.nextUrl.searchParams;
      const userId = searchParams.get('userId');
      
      // Belirli bir kullanıcının siparişleri istendiyse
      if (userId) {
        orders = await orderService.getUserOrders(userId);
      } else {
        // Tüm siparişleri getir
        orders = await orderService.getAllOrders();
      }
    } else {
      // Kullanıcının kendi siparişlerini getir
      orders = await orderService.getUserOrders(session.user.id);
    }
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Siparişler getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Siparişler getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 