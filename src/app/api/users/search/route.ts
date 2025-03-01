import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// Kullanıcı arama
export async function GET(request: NextRequest) {
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

    // URL'den arama terimini al
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Arama terimi belirtilmelidir.' }, { status: 400 });
    }

    // Kullanıcıları ara
    const users = await userService.searchUsers(query);

    // Hassas bilgileri temizle
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json(sanitizedUsers);
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}
