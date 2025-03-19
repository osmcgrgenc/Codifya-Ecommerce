import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { CreditCard, Copy, CheckCircle } from 'lucide-react';
import CopyButton from './copy-button';

export const metadata: Metadata = {
  title: 'Banka Transferi Bilgileri | Codifya E-Ticaret',
  description: 'Banka transferi ile ödeme bilgileri.',
};

export default async function BankTransferPage({
  searchParams,
}: {
  searchParams: { orderId?: string; referenceCode?: string };
}) {
  // Kullanıcı oturumunu kontrol et
  const session = await getServerSession(authOptions);

  // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
  if (!session || !session.user) {
    redirect('/auth/login?callbackUrl=/orders/bank-transfer');
  }

  // Sipariş ID'si veya referans kodu yoksa ana sayfaya yönlendir
  if (!searchParams.orderId || !searchParams.referenceCode) {
    redirect('/');
  }

  // Banka bilgileri
  const bankInfo = {
    bankName: 'Türkiye İş Bankası',
    accountName: 'Codifya E-Ticaret A.Ş.',
    iban: 'TR12 3456 7890 1234 5678 9012 34',
    referenceCode: searchParams.referenceCode,
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <CreditCard className="h-24 w-24 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Banka Transferi Bilgileri</h1>
          <p className="text-gray-600">
            Siparişiniz başarıyla oluşturuldu. Lütfen aşağıdaki banka hesabına ödeme yapınız.
          </p>
        </div>

        <div className=" p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-4">Ödeme Bilgileri</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Sipariş Numarası</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">{searchParams.orderId}</p>
                <CopyButton textToCopy={searchParams.orderId} />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Referans Kodu</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">{bankInfo.referenceCode}</p>
                <CopyButton textToCopy={bankInfo.referenceCode} />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Banka</p>
              <p className="font-medium">{bankInfo.bankName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Hesap Sahibi</p>
              <p className="font-medium">{bankInfo.accountName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">IBAN</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">{bankInfo.iban}</p>
                <CopyButton textToCopy={bankInfo.iban} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-8">
          <h3 className="text-lg font-semibold mb-2 text-yellow-800">Önemli Bilgiler</h3>
          <ul className="text-sm text-yellow-700 list-disc list-inside space-y-2">
            <li>Ödeme yaparken açıklama kısmına mutlaka referans kodunu yazınız.</li>
            <li>Ödemeniz onaylandıktan sonra siparişiniz işleme alınacaktır.</li>
            <li>Ödeme onayı genellikle 1-2 iş günü içerisinde gerçekleşmektedir.</li>
            <li>Havale/EFT işlemlerinde, banka işlem saatlerini göz önünde bulundurunuz.</li>
          </ul>
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
