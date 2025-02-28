import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';

import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Sipariş Detayı | Codifya E-Ticaret',
  description: 'Sipariş detaylarınızı görüntüleyin',
};

// Örnek sipariş detayları
const orderDetails = {
  id: 'ORD-001',
  date: '2023-05-15',
  status: 'Tamamlandı',
  total: 1299.99,
  items: [
    {
      id: '1',
      name: 'Akıllı Telefon',
      price: 999.99,
      quantity: 1,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: '3',
      name: 'Kablosuz Kulaklık',
      price: 299.99,
      quantity: 1,
      image: 'https://via.placeholder.com/100',
    },
  ],
  shipping: {
    address: 'Örnek Mahallesi, Örnek Sokak No:123, 34000 İstanbul',
    method: 'Standart Kargo',
    cost: 0,
  },
  payment: {
    method: 'Kredi Kartı',
    cardLast4: '1234',
  },
};

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Gerçek uygulamada, sipariş ID'sine göre veritabanından sipariş detayları alınacak
  // Şimdilik örnek veri kullanıyoruz
  const order = orderDetails;

  // Sipariş ID'sini loglama (gerçek uygulamada bu ID ile veritabanından sorgu yapılacak)
  // eslint-disable-next-line no-console
  console.log(`Sipariş ID: ${params.id}`);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/profile" className="text-indigo-600 hover:text-indigo-900 mr-4">
          ← Siparişlerime Dön
        </Link>
        <h1 className="text-3xl font-bold">Sipariş #{order.id}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">Sipariş Tarihi: {order.date}</p>
              <p className="text-sm text-gray-500">
                Toplam:{' '}
                {order.total.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  order.status === 'Tamamlandı'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'Kargoda'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium mb-4">Sipariş Öğeleri</h2>
            <div className="flow-root">
              <ul className="-my-6 divide-y divide-gray-200">
                {order.items.map(item => (
                  <li key={item.id} className="py-6 flex">
                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>

                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">
                            {item.price.toLocaleString('tr-TR', {
                              style: 'currency',
                              currency: 'TRY',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <p className="text-gray-500">Adet: {item.quantity}</p>
                        <p className="text-gray-500">
                          Toplam:{' '}
                          {(item.price * item.quantity).toLocaleString('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t border-gray-200 pt-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Teslimat Bilgileri</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Adres:</span> {order.shipping.address}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Kargo Yöntemi:</span> {order.shipping.method}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Kargo Ücreti:</span>{' '}
                {order.shipping.cost === 0
                  ? 'Ücretsiz'
                  : order.shipping.cost.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    })}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Ödeme Bilgileri</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Ödeme Yöntemi:</span> {order.payment.method}
              </p>
              {order.payment.cardLast4 && (
                <p className="text-gray-600">
                  <span className="font-medium">Kart:</span> **** **** ****{' '}
                  {order.payment.cardLast4}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Ara Toplam</p>
              <p>
                {(order.total - order.shipping.cost).toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </p>
            </div>
            <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
              <p>Kargo</p>
              <p>
                {order.shipping.cost === 0
                  ? 'Ücretsiz'
                  : order.shipping.cost.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    })}
              </p>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
              <p>Toplam</p>
              <p>
                {order.total.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-indigo-700">
              Yardım İste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
