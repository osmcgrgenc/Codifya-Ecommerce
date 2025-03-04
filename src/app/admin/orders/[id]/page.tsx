'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { OrderStatus } from '@prisma/client';
import { toast } from 'sonner';

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
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

// Örnek sipariş verisi
const mockOrder: Order = {
  id: '1',
  userId: 'user1',
  status: OrderStatus.PROCESSING,
  totalAmount: 7299.98,
  shippingAddress: 'Atatürk Cad. No:123, İstanbul, Türkiye, 34000',
  billingAddress: 'Atatürk Cad. No:123, İstanbul, Türkiye, 34000',
  createdAt: new Date('2023-05-15'),
  updatedAt: new Date('2023-05-15'),
  items: [
    {
      id: '1',
      productId: 'prod1',
      quantity: 1,
      price: 5999.99,
      subtotal: 5999.99,
      product: {
        name: 'Akıllı Telefon',
        slug: 'akilli-telefon',
        description: 'Son model akıllı telefon',
        images: [
          {
            id: 'img1',
            url: 'https://via.placeholder.com/150',
            isMain: true,
          },
        ],
      },
    },
    {
      id: '2',
      productId: 'prod2',
      quantity: 1,
      price: 1299.99,
      subtotal: 1299.99,
      product: {
        name: 'Kablosuz Kulaklık',
        slug: 'kablosuz-kulaklik',
        description: 'Yüksek ses kaliteli kablosuz kulaklık',
        images: [
          {
            id: 'img2',
            url: 'https://via.placeholder.com/150',
            isMain: true,
          },
        ],
      },
    },
  ],
  payment: {
    id: 'pay1',
    method: 'Kredi Kartı',
    status: 'Ödendi',
    provider: 'Iyzico',
    transactionId: 'txn123456',
    amount: 7299.98,
    currency: 'TRY',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15'),
  },
  trackingNumber: 'TRK123456789',
  estimatedDeliveryDate: new Date('2023-05-20'),
  notes: 'Lütfen kapıda bırakmayın, zile basın.',
  referenceCode: 'REF123456789',
  user: {
    id: 'user1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@example.com',
  },
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilecek
    // Şimdilik mock veri kullanıyoruz
    setOrder(mockOrder);
    setTrackingNumber(mockOrder.trackingNumber || '');
    setEstimatedDeliveryDate(
      mockOrder.estimatedDeliveryDate
        ? new Date(mockOrder.estimatedDeliveryDate).toISOString().split('T')[0]
        : ''
    );
    setNotes(mockOrder.notes || '');
    setStatus(mockOrder.status);
    setLoading(false);
  }, [params.id]);

  const handleUpdateOrder = () => {
    if (!order) return;

    // Gerçek uygulamada API'ye gönderilecek
    const updatedOrder = {
      ...order,
      status,
      trackingNumber,
      estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null,
      notes,
    };

    setOrder(updatedOrder);
    toast.success('Sipariş başarıyla güncellendi');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sipariş bulunamadı</h3>
        <p className="text-gray-500 mb-6">İstediğiniz sipariş bilgilerine ulaşılamadı.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Siparişlere Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/admin/orders" className="text-indigo-600 hover:text-indigo-900 mr-4">
            ← Siparişlere Dön
          </Link>
          <h1 className="text-3xl font-bold">Sipariş #{order.referenceCode || order.id}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
          <Button onClick={handleUpdateOrder}>Değişiklikleri Kaydet</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Sipariş Tarihi: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Son Güncelleme: {new Date(order.updatedAt).toLocaleDateString('tr-TR')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Toplam:{' '}
                    {order.totalAmount.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    })}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Select value={status} onValueChange={value => setStatus(value as OrderStatus)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sipariş Durumu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OrderStatus.PENDING}>Beklemede</SelectItem>
                      <SelectItem value={OrderStatus.PROCESSING}>İşleniyor</SelectItem>
                      <SelectItem value={OrderStatus.SHIPPED}>Kargoya Verildi</SelectItem>
                      <SelectItem value={OrderStatus.DELIVERED}>Teslim Edildi</SelectItem>
                      <SelectItem value={OrderStatus.CANCELLED}>İptal Edildi</SelectItem>
                      <SelectItem value={OrderStatus.PAID}>Ödendi</SelectItem>
                    </SelectContent>
                  </Select>
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
                                  href={`/admin/products/${item.productId}`}
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
                            <p className="mt-1 text-sm text-gray-500">{item.product.description}</p>
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
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Müşteri Bilgileri</h2>
              {order.user ? (
                <div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">İsim:</span> {order.user.name}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">E-posta:</span> {order.user.email}
                  </p>
                  <Link
                    href={`/admin/users/${order.userId}`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Müşteri Profilini Görüntüle
                  </Link>
                </div>
              ) : (
                <p className="text-gray-600">Müşteri bilgisi bulunamadı</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Teslimat Bilgileri</h2>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Adres:</span>{' '}
                {order.shippingAddress || 'Belirtilmemiş'}
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="trackingNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kargo Takip Numarası
                  </label>
                  <input
                    type="text"
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="estimatedDelivery"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tahmini Teslimat Tarihi
                  </label>
                  <input
                    type="date"
                    id="estimatedDelivery"
                    value={estimatedDeliveryDate}
                    onChange={e => setEstimatedDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
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
                  {order.payment.transactionId && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">İşlem ID:</span> {order.payment.transactionId}
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

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Sipariş Notları</h2>
              <Textarea
                placeholder="Sipariş hakkında notlar ekleyin..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
