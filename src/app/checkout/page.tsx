import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CheckoutContent from "./checkout-content";

export const metadata: Metadata = {
  title: "Ödeme | Codifya E-Ticaret",
  description: "Siparişinizi tamamlayın ve ödeme yapın.",
};

export default async function CheckoutPage() {
  // Kullanıcı oturumunu kontrol et
  const session = await getServerSession(authOptions);

  // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
  if (!session || !session.user) {
    redirect("/auth/login?callbackUrl=/checkout");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ödeme</h1>
        <CheckoutContent user={session.user} />
      </div>
    </div>
  );
} 