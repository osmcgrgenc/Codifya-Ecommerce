import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// Belirli bir kullanıcıyı getir
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Admin değilse ve kendi profili değilse erişimi reddet
    if (session.user.role !== UserRole.ADMIN && session.user.id !== params.id) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmamaktadır.' },
        { status: 403 }
      );
    }

    // Kullanıcıyı getir
    const user = await userService.getUserById(params.id);

    // Kullanıcı bulunamadıysa hata döndür
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Hassas bilgileri temizle
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}

// Kullanıcı güncelle
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Admin değilse ve kendi profili değilse erişimi reddet
    if (session.user.role !== UserRole.ADMIN && session.user.id !== params.id) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmamaktadır.' },
        { status: 403 }
      );
    }

    // Kullanıcının var olup olmadığını kontrol et
    const existingUser = await userService.getUserById(params.id);
    if (!existingUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // İstek gövdesini al
    const body = await request.json();

    // Güncelleme verilerini hazırla
    const updateData: any = {};

    // Sadece belirli alanların güncellenmesine izin ver
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.password !== undefined) updateData.password = body.password;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.phone !== undefined) updateData.phone = body.phone;

    // Sadece admin kullanıcı rolünü değiştirebilir
    if (session.user.role === UserRole.ADMIN && body.role !== undefined) {
      updateData.role = body.role;
    }

    // E-posta değiştiriliyorsa ve yeni e-posta zaten kullanılıyorsa hata döndür
    if (body.email && body.email !== existingUser.email) {
      const userWithEmail = await userService.getUserByEmail(body.email);
      if (userWithEmail) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten kullanılıyor.' },
          { status: 409 }
        );
      }
    }

    // Kullanıcıyı güncelle
    const updatedUser = await userService.updateUser(params.id, updateData);

    // Hassas bilgileri temizle
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}

// Kullanıcı sil
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Kullanıcının var olup olmadığını kontrol et
    const existingUser = await userService.getUserById(params.id);
    if (!existingUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Kullanıcıyı sil
    await userService.deleteUser(params.id);

    return NextResponse.json({ message: 'Kullanıcı başarıyla silindi.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Sunucu hatası', error: error }, { status: 500 });
  }
}
