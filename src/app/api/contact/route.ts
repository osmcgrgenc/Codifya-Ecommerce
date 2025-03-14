import { NextRequest, NextResponse } from 'next/server';
import { contactService } from '@/services/contact-service';
import { z } from 'zod';

// İletişim formu doğrulama şeması
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'İsim en az 2 karakter olmalıdır' }),
  email: z.string().email({ message: 'Geçerli bir e-posta adresi giriniz' }),
  phone: z.string().optional(),
  subject: z.string().min(3, { message: 'Konu en az 3 karakter olmalıdır' }),
  message: z.string().min(10, { message: 'Mesaj en az 10 karakter olmalıdır' }),
});

export async function POST(request: NextRequest) {
  try {
    // İstek gövdesini JSON olarak al
    const body = await request.json();

    // Gelen veriyi doğrula
    const validationResult = contactFormSchema.safeParse(body);

    // Doğrulama hatası varsa
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Doğrulanmış veriyi al
    const validatedData = validationResult.data;

    // Veritabanına kaydet
    const contactMessage = await contactService.createContactMessage(validatedData);

    // Başarılı yanıt döndür
    return NextResponse.json(
      {
        success: true,
        message: 'Mesajınız başarıyla gönderildi',
        data: contactMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('İletişim mesajı kaydedilirken hata oluştu:', error);

    // Hata yanıtı döndür
    return NextResponse.json(
      {
        success: false,
        message: 'Mesajınız gönderilirken bir hata oluştu',
      },
      { status: 500 }
    );
  }
}
