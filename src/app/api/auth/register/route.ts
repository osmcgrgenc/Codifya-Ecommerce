import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { z } from 'zod';

import { db } from '@/lib/db';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // E-posta adresi kullanılıyor mu kontrol et
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 409 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await hash(password, 10);

    // Kullanıcıyı oluştur
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Hassas bilgileri kaldır
    // eslint-disable-next-line
    const { password: _password, ...result } = user;

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Geçersiz giriş verileri', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Bir hata oluştu', error: error }, { status: 500 });
  }
}
