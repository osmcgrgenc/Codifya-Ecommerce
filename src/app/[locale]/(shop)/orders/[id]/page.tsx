import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';

import { authOptions } from '@/lib/auth';
import { orderService } from '@/services';
import { OrderStatus } from '@prisma/client';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    name: string;
    slug: string;
    description: string;
    images: {
      id: string;
      url: string;
      isMain: boolean;
    }[];
  };
}

interface Order {
  id: string;
  userId: string | null;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string | null;
  billingAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  payment: {
    id: string;
    method: string;
    status: string;
    provider?: string;
    transactionId?: string;
    amount: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  trackingNumber?: string | null;
  estimatedDeliveryDate?: Date | null;
  notes?: string | null;
  referenceCode?: string | null;
}

interface OrderPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  return {
    title: `Sipariş #${params.id} | Codifya E-Ticaret`,
    description: 'Sipariş detaylarınızı görüntüleyin',
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const order = (await orderService.getOrderById(params.id)) as Order | null;

  if (!order) {
    return notFound();
  }

  if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/profile');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/profile" className="text-indigo-600 hover:text-indigo-900 mr-4">
          ← Siparişlerime Dön
        </Link>
        <h1 className="text-3xl font-bold">Sipariş #{order.referenceCode || order.id}</h1>
      </div>

      <div className="rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">
                Sipariş Tarihi: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
              </p>
              <p className="text-sm text-gray-500">
                Toplam:{' '}
                {order.totalAmount.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </p>
              {order.payment && (
                <p className="text-sm text-gray-500">
                  Ödeme: {order.payment.method} - {order.payment.status}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  order.status === OrderStatus.PAID
                    ? 'bg-green-100 text-green-800'
                    : order.status === OrderStatus.SHIPPED
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === OrderStatus.PENDING ||
                          order.status === OrderStatus.PROCESSING
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === OrderStatus.CANCELLED
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status === OrderStatus.PAID
                  ? 'Ödendi'
                  : order.status === OrderStatus.SHIPPED
                    ? 'Kargoda'
                    : order.status === OrderStatus.PENDING
                      ? 'Beklemede'
                      : order.status === OrderStatus.PROCESSING
                        ? 'İşleniyor'
                        : order.status === OrderStatus.CANCELLED
                          ? 'İptal Edildi'
                          : order.status}
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
                        src={
                          item.product.images.find(img => img.isMain)?.url ||
                          '/images/placeholder.jpg'
                        }
                        alt={item.product.name}
                        className="w-full h-full object-center object-cover"
                        width={96}
                        height={96}
                      />
                    </div>

                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="hover:text-indigo-600"
                            >
                              {item.product.name}
                            </Link>
                          </h3>
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
                          {item.subtotal.toLocaleString('tr-TR', {
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
                <span className="font-medium">Adres:</span>{' '}
                {order.shippingAddress || 'Belirtilmemiş'}
              </p>
              {order.trackingNumber && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Kargo Takip:</span>{' '}
                  <Link
                    href={`/kargo-takip/${order.trackingNumber}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {order.trackingNumber}
                  </Link>
                </p>
              )}
              {order.estimatedDeliveryDate && (
                <p className="text-gray-600">
                  <span className="font-medium">Tahmini Teslimat:</span>{' '}
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString('tr-TR')}
                </p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Ödeme Bilgileri</h2>
              {order.payment ? (
                <>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Ödeme Yöntemi:</span> {order.payment.method}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Durum:</span> {order.payment.status}
                  </p>
                  {order.payment.provider && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Sağlayıcı:</span> {order.payment.provider}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-600">Ödeme bilgisi bulunamadı</p>
              )}
              {order.billingAddress && (
                <p className="text-gray-600 mt-4">
                  <span className="font-medium">Fatura Adresi:</span> {order.billingAddress}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Ara Toplam</p>
              <p>
                {order.totalAmount.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </p>
            </div>
            <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
              <p>Kargo</p>
              <p>Ücretsiz</p>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
              <p>Toplam</p>
              <p>
                {order.totalAmount.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </p>
            </div>
          </div>

          {order.notes && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium mb-4">Sipariş Notları</h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}

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
