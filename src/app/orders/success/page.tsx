import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sipariş Başarılı | Codifya E-Ticaret",
  description: "Siparişiniz başarıyla oluşturuldu.",
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  // Kullanıcı oturumunu kontrol et
  const session = await getServerSession(authOptions);

  // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
  if (!session || !session.user) {
    redirect("/auth/login?callbackUrl=/orders/success");
  }

  // Sipariş ID'si yoksa ana sayfaya yönlendir
  if (!searchParams.orderId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Siparişiniz Alındı!</h1>
        <p className="text-gray-600 mb-8">
          Siparişiniz başarıyla oluşturuldu. Sipariş numaranız: <strong>{searchParams.orderId}</strong>
        </p>
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-2">Sipariş Bilgileri</h2>
          <p className="text-sm text-gray-600 mb-4">
            Siparişinizle ilgili detayları e-posta adresinize gönderdik. Ayrıca hesabınızın "Siparişlerim" 
            bölümünden de siparişinizi takip edebilirsiniz.
          </p>
          <p className="text-sm text-gray-600">
            Siparişiniz onaylandıktan sonra kargoya verilecektir. Kargo takip numarası e-posta ile 
            tarafınıza iletilecektir.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/orders">Siparişlerim</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Alışverişe Devam Et</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 