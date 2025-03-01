import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// Tüm kullanıcıları getir (sadece admin erişebilir)
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

    // Tüm kullanıcıları getir
    const users = await userService.getAllUsers();

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

// Yeni kullanıcı oluştur (sadece admin erişebilir)
export async function POST(request: NextRequest) {
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

    // Gerekli alanları kontrol et
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Ad, e-posta ve şifre alanları zorunludur.' },
        { status: 400 }
      );
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    }

    // E-posta adresi zaten kullanılıyor mu kontrol et
    const existingUser = await userService.getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılıyor.' }, { status: 409 });
    }

    // Yeni kullanıcı oluştur
    const newUser = await userService.createUser({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || UserRole.CUSTOMER,
    });

    // Hassas bilgileri temizle
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}
