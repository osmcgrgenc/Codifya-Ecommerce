import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPaymentForm, retrievePaymentResult } from "@/lib/iyzico";
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

// Ödeme formu oluşturma endpoint'i
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
    const { items, totalAmount, shippingAddress, billingAddress } = data as {
      items: CartItem[];
      totalAmount: number;
      shippingAddress: Address;
      billingAddress: Address;
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

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        totalAmount,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // İyzico için ödeme verilerini hazırla
    const paymentData = {
      locale: "tr",
      conversationId: order.id,
      price: totalAmount.toString(),
      paidPrice: totalAmount.toString(),
      currency: "TRY",
      basketId: order.id,
      paymentGroup: "PRODUCT",
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/iyzico/callback`,
      buyer: {
        id: user.id,
        name: user.name?.split(" ")[0] || "",
        surname: user.name?.split(" ").slice(1).join(" ") || "",
        identityNumber: "11111111111", // Gerçek uygulamada kullanıcıdan alınmalı
        email: user.email || "",
        phone: user.phone || "", // İyzico API'si için phone alanı gerekli
        registrationAddress: shippingAddress.address,
        city: shippingAddress.city,
        country: shippingAddress.country,
        ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
      shippingAddress: {
        contactName: shippingAddress.contactName,
        city: shippingAddress.city,
        country: shippingAddress.country,
        address: shippingAddress.address,
        zipCode: shippingAddress.zipCode || "",
      },
      billingAddress: {
        contactName: billingAddress.contactName,
        city: billingAddress.city,
        country: billingAddress.country,
        address: billingAddress.address,
        zipCode: billingAddress.zipCode || "",
      },
      basketItems: items.map((item) => ({
        id: item.id,
        name: item.name,
        category1: item.category,
        itemType: "PHYSICAL",
        price: item.price.toString(),
      })),
    };

    // İyzico ödeme formunu oluştur
    const paymentFormResult = await createPaymentForm(paymentData);

    if (!paymentFormResult || paymentFormResult.status !== "success") {
      throw new Error("Ödeme formu oluşturulamadı");
    }

    return NextResponse.json({
      status: "success",
      paymentPageUrl: paymentFormResult.paymentPageUrl,
      token: paymentFormResult.token,
    });
  } catch (error) {
    console.error("Ödeme işlemi başlatılırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Ödeme işlemi başlatılırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// Ödeme sonucu callback endpoint'i
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Geçersiz ödeme token'ı." },
        { status: 400 }
      );
    }

    // İyzico'dan ödeme sonucunu al
    const paymentResult = await retrievePaymentResult(token);

    if (!paymentResult || typeof paymentResult !== "object") {
      throw new Error("Ödeme sonucu alınamadı");
    }

    // Ödeme başarılıysa siparişi güncelle
    if (paymentResult.status === "success") {
      const orderId = paymentResult.conversationId;
      
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentId: paymentResult.paymentId || "",
          paymentMethod: "IYZICO",
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
          status: "CANCELLED",
          paymentId: paymentResult.paymentId || "",
          paymentMethod: "IYZICO",
        },
      });

      // Kullanıcıyı başarısız ödeme sayfasına yönlendir
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/orders/failed?orderId=${orderId}`
      );
    }
  } catch (error) {
    console.error("Ödeme sonucu işlenirken hata oluştu:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/orders/failed?error=payment-process-error`
    );
  }
} 