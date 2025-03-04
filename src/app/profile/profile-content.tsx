'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OrderStatus } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
interface ProfileContentProps {
  user: User & {
    phone: string | null;
    emailVerified: Date | null;
  };
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    name: string;
    slug: string;
    images: {
      url: string;
      isMain: boolean;
    }[];
  };
}

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  payment: {
    id: string;
    method: string;
    status: string;
    provider?: string;
    transactionId?: string;
  } | null;
  trackingNumber?: string | null;
  estimatedDeliveryDate?: string | null;
  shippingAddress?: string | null;
  billingAddress?: string | null;
  notes?: string | null;
  referenceCode?: string | null;
}

interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  product: {
    name: string;
    slug: string;
    images: {
      url: string;
      isMain: boolean;
    }[];
  };
  likes: number;
  dislikes: number;
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'reviews'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Siparişler alınamadı');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Siparişler yüklenirken hata oluştu',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews');
      if (!response.ok) {
        throw new Error('Değerlendirmeler alınamadı');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Değerlendirmeler yüklenirken hata oluştu',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab, fetchOrders, fetchReviews]);

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
        }),
      });

      if (!response.ok) {
        throw new Error('Profil güncellenemedi');
      }

      toast({
        title: 'Başarılı',
        description: 'Profil bilgileri güncellendi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Profil güncellenirken hata oluştu',
      });
    }
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profil Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Siparişlerim
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Değerlendirmelerim
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'profile' && (
          <div>
            <div className="flex items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-medium">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Üyelik:{' '}
                  {user.role === 'ADMIN'
                    ? 'Yönetici'
                    : user.role === 'CUSTOMER_SERVICE'
                      ? 'Müşteri Temsilcisi'
                      : 'Müşteri'}
                </p>
                {user.emailVerified && (
                  <p className="text-sm text-green-600 mt-1">✓ E-posta Doğrulandı</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Hesap Bilgileri</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={user.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    defaultValue={user.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={user.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <Button type="submit">Bilgileri Güncelle</Button>
                </div>
              </form>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium mb-4">Şifre Değiştir</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <Button>Şifreyi Değiştir</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Siparişlerim</h3>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Siparişler yükleniyor...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Henüz bir sipariş vermediniz.</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Alışverişe Başla
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sipariş No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referans
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ödeme
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kargo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Toplam
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Detay</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.referenceCode || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.payment ? (
                            <span className="text-sm">
                              {order.payment.method} - {order.payment.status}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.trackingNumber ? (
                            <Link
                              href={`/kargo-takip/${order.trackingNumber}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {order.trackingNumber}
                            </Link>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.totalAmount.toLocaleString('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Detay
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Değerlendirmelerim</h3>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Değerlendirmeler yükleniyor...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Henüz bir değerlendirme yapmadınız.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={review.product.images.find(img => img.isMain)?.url || ''}
                          alt={review.product.name}
                          className="w-16 h-16 object-cover rounded"
                          width={16}
                          height={16}
                        />
                        <div className="ml-4">
                          <h4 className="font-medium">{review.product.name}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    {review.comment && <p className="mt-4 text-gray-600">{review.comment}</p>}
                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{review.likes} beğeni</span>
                      <span>{review.dislikes} beğenmeme</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
