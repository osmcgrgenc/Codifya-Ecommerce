import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ödeme Başarısız | Codifya E-Ticaret',
  description: 'Ödeme işlemi sırasında bir hata oluştu.',
};

export default async function OrderFailedPage({
  searchParams,
}: {
  searchParams: { orderId?: string; error?: string };
}) {
  // Kullanıcı oturumunu kontrol et
  const session = await getServerSession(authOptions);

  // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
  if (!session || !session.user) {
    redirect('/auth/login?callbackUrl=/orders/failed');
  }

  // Hata mesajını belirle
  let errorMessage = 'Ödeme işlemi sırasında bir hata oluştu.';

  if (searchParams.error === 'payment-process-error') {
    errorMessage =
      'Ödeme işlemi sırasında teknik bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
  } else if (searchParams.error === 'payment-rejected') {
    errorMessage =
      'Ödeme işlemi banka tarafından reddedildi. Lütfen kart bilgilerinizi kontrol edin veya başka bir ödeme yöntemi deneyin.';
  } else if (searchParams.error === 'insufficient-funds') {
    errorMessage =
      'Kartınızda yeterli bakiye bulunmamaktadır. Lütfen başka bir kart ile ödeme yapmayı deneyin.';
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-24 w-24 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Ödeme Başarısız</h1>
        <p className="text-gray-600 mb-8">
          {errorMessage}
          {searchParams.orderId && (
            <span>
              {' '}
              Sipariş numaranız: <strong>{searchParams.orderId}</strong>
            </span>
          )}
        </p>
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-2">Ne Yapabilirsiniz?</h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-2 text-left">
            <li>Kart bilgilerinizi kontrol edip tekrar deneyebilirsiniz.</li>
            <li>Farklı bir ödeme yöntemi kullanabilirsiniz.</li>
            <li>
              Bankanızla iletişime geçerek online ödemelerin açık olduğundan emin olabilirsiniz.
            </li>
            <li>Daha sonra tekrar deneyebilirsiniz.</li>
            <li>Sorun devam ederse müşteri hizmetlerimizle iletişime geçebilirsiniz.</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/checkout">Tekrar Dene</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cart">Sepete Dön</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
