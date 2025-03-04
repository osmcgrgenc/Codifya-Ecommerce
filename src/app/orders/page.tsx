import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';

import { authOptions } from '@/lib/auth';
import { orderService } from '@/services';
import { OrderStatus } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Siparişlerim | Codifya E-Ticaret',
  description: 'Tüm siparişlerinizi görüntüleyin ve takip edin',
};

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

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const orders = await orderService.getUserOrders(session.user.id) as Order[];
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Siparişlerim</h1>
        <Link
          href="/shop"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Alışverişe Devam Et
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz bir sipariş vermediniz</h3>
          <p className="text-gray-500 mb-6">Alışverişe başlamak için aşağıdaki butona tıklayabilirsiniz.</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Sipariş #{order.referenceCode || order.id}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
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

                <div className="flow-root">
                  <ul className="-my-4 divide-y divide-gray-200">
                    {order.items.map(item => (
                      <li key={item.id} className="py-4 flex items-center">
                        <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                          <Image
                            src={item.product?.images?.find(img => img.isMain)?.url || '/images/placeholder.jpg'}
                            alt={item.product?.name || 'Ürün'}
                            className="w-full h-full object-center object-cover"
                            width={64}
                            height={64}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            <Link href={`/products/${item.product.slug}`} className="hover:text-indigo-600">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.quantity} adet x{' '}
                            {item.price.toLocaleString('tr-TR', {
                              style: 'currency',
                              currency: 'TRY',
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    {order.payment && (
                      <p className="text-sm text-gray-500 mr-6">
                        <span className="font-medium">Ödeme:</span> {order.payment.method}
                      </p>
                    )}
                    {order.trackingNumber && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Kargo Takip:</span>{' '}
                        <Link
                          href={`/kargo-takip/${order.trackingNumber}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {order.trackingNumber}
                        </Link>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg font-medium text-gray-900">
                      {order.totalAmount.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                      })}
                    </p>
                    <Link
                      href={`/orders/${order.id}`}
                      className="ml-6 text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Detayları Görüntüle →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 