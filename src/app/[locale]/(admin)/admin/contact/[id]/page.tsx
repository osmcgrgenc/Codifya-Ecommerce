import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { contactService } from '@/services/contact-service';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'İletişim Mesajı Detayı - Admin Paneli',
  description: 'İletişim mesajı detaylarını görüntüleyin',
};

interface ContactMessageDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ContactMessageDetailPage({ params }: ContactMessageDetailPageProps) {
  // Oturum kontrolü
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  // İletişim mesajını getir
  const message = await contactService.getContactMessageById(params.id);

  // Mesaj bulunamadıysa 404 sayfasına yönlendir
  if (!message) {
    notFound();
  }

  // Mesajı okundu olarak işaretle
  if (!message.isRead) {
    await contactService.markAsRead(params.id);
  }

  // Mesajı silme işlemi
  async function handleDeleteMessage() {
    'use server';

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Bu işlem için yetkiniz bulunmamaktadır');
    }

    await contactService.deleteContactMessage(params.id);
    redirect('/admin/contact');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/admin/contact" className="text-indigo-600 hover:text-indigo-900">
          &larr; Tüm Mesajlara Dön
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{message.subject}</h1>
          <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${message.isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
          >
            {message.isRead ? 'Okundu' : 'Okunmadı'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Gönderen</h2>
            <p className="text-base">{message.name}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">E-posta</h2>
            <p className="text-base">{message.email}</p>
          </div>
          {message.phone && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Telefon</h2>
              <p className="text-base">{message.phone}</p>
            </div>
          )}
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Tarih</h2>
            <p className="text-base">{formatDate(message.createdAt)}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Mesaj</h2>
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{message.message}</div>
        </div>

        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href={`mailto:${message.email}?subject=RE: ${message.subject}`}>
              E-posta ile Yanıtla
            </Link>
          </Button>

          <form action={handleDeleteMessage}>
            <Button type="submit" variant="destructive">
              Mesajı Sil
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
