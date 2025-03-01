import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import CheckoutContent from './checkout-content';

export const metadata: Metadata = {
  title: 'Ödeme | Codifya E-Ticaret',
  description: 'Siparişinizi tamamlayın ve ödeme yapın.',
};

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/checkout');
  }

  return (
    <div className="container py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Ödeme</h1>
      <CheckoutContent user={session.user} />
    </div>
  );
}
