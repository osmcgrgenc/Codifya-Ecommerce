import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

// Banka transferi ödeme işlemi endpoint'i
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekmektedir." },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { items, totalAmount, shippingAddress, billingAddress, bankInfo } = data as {
      items: CartItem[];
      totalAmount: number;
      shippingAddress: Address;
      billingAddress: Address;
      bankInfo: {
        bankName: string;
        accountName: string;
        accountNumber?: string;
        iban: string;
      };
    };

    if (!items || !items.length || !totalAmount || !shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: "Geçersiz ödeme bilgileri." },
        { status: 400 }
      );
    }

    // Kullanıcı bilgilerini veritabanından al
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    // Benzersiz bir referans kodu oluştur
    const referenceCode = `BT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING_PAYMENT",
        totalAmount,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        paymentMethod: "BANK_TRANSFER",
        referenceCode,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Banka bilgilerini ve referans kodunu döndür
    return NextResponse.json({
      status: "success",
      message: "Sipariş başarıyla oluşturuldu. Lütfen banka transferi yapınız.",
      orderId: order.id,
      referenceCode,
      bankInfo: {
        bankName: "Türkiye İş Bankası",
        accountName: "Codifya E-Ticaret A.Ş.",
        iban: "TR12 3456 7890 1234 5678 9012 34",
        description: `Ödeme açıklamasına '${referenceCode}' referans kodunu yazmayı unutmayınız.`,
      },
      totalAmount,
    });
  } catch (error) {
    console.error("Banka transferi işlemi başlatılırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Banka transferi işlemi başlatılırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Banka transferi onaylama endpoint'i (admin için)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Sadece admin kullanıcılar bu endpoint'i kullanabilir
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bu işlem için admin yetkisi gerekmektedir." },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { orderId, status, notes } = data as {
      orderId: string;
      status: "PAID" | "CANCELLED";
      notes?: string;
    };

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Geçersiz istek. Sipariş ID ve durum belirtilmelidir." },
        { status: 400 }
      );
    }

    // Siparişi güncelle
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        notes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "success",
      message: `Sipariş durumu başarıyla '${status}' olarak güncellendi.`,
      order,
    });
  } catch (error) {
    console.error("Banka transferi onaylanırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Banka transferi onaylanırken bir hata oluştu." },
      { status: 500 }
    );
  }
} 