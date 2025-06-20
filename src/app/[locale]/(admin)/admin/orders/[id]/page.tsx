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
  estimatedDeliveryDate?: Date | string | null; // Input type="date" için string de olabilir
  notes?: string | null;
  referenceCode?: string | null;
  user?: {
    id: string;
    name: string | null; // User modeline göre null olabilir
    email: string | null; // User modeline göre null olabilir
  } | null;
}

// Örnek sipariş verisi kaldırıldı

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/admin/orders/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: 'Hata',
              description: 'Sipariş bulunamadı.',
              variant: 'destructive',
            });
            router.push('/admin/orders');
          } else {
            throw new Error('Sipariş bilgileri alınamadı');
          }
          return;
        }

        const dataResult = await response.json();
        const data: Order = dataResult.data; // API response'dan 'data' kısmını al

        if (isMounted) {
          setOrder(data);
          setTrackingNumber(data.trackingNumber || '');
          setEstimatedDeliveryDate(
            data.estimatedDeliveryDate
              ? new Date(data.estimatedDeliveryDate).toISOString().split('T')[0]
              : ''
          );
          setNotes(data.notes || '');
          setStatus(data.status);
        }
      } catch (error) {
        if (isMounted) {
          toast({
            title: 'Hata',
            description: 'Sipariş bilgileri yüklenirken bir hata oluştu.',
            variant: 'destructive',
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false; // Cleanup function to prevent setting state on unmounted component
    };
  }, [params.id, router, toast]);

  const handleUpdateOrder = async () => {
    if (!order) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber || null, // Boş string yerine null gönder
          estimatedDeliveryDate: estimatedDeliveryDate || null, // Boş string yerine null gönder
          notes: notes || null, // Boş string yerine null gönder
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sipariş güncellenemedi');
      }

      const updatedOrderResult = await response.json();
      const updatedOrderData: Order = updatedOrderResult.data; // API response'dan 'data' kısmını al

      // State'i güncelle
      setOrder(updatedOrderData);
      setStatus(updatedOrderData.status);
      setTrackingNumber(updatedOrderData.trackingNumber || '');
      setEstimatedDeliveryDate(
          updatedOrderData.estimatedDeliveryDate
              ? new Date(updatedOrderData.estimatedDeliveryDate).toISOString().split('T')[0]
              : ''
      );
      setNotes(updatedOrderData.notes || '');


      toast({
        title: 'Başarılı',
        description: 'Sipariş başarıyla güncellendi.',
      });
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Sipariş güncellenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
          <div className=" rounded-lg shadow-md overflow-hidden mb-8">
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
                    {Number(order.totalAmount).toLocaleString('tr-TR', { // Ensure totalAmount is treated as number
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
                                {item.product ? (
                                  <Link
                                    href={`/admin/products/${item.productId}`}
                                    className="hover:text-indigo-600"
                                  >
                                    {item.product.name}
                                  </Link>
                                ) : (
                                  'Ürün Bilgisi Yok'
                                )}
                              </h3>
                              <p className="ml-4">
                                {Number(item.price).toLocaleString('tr-TR', { // Ensure price is treated as number
                                  style: 'currency',
                                  currency: 'TRY',
                                })}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {item.product?.description || 'Açıklama yok'}
                            </p>
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <p className="text-gray-500">Adet: {item.quantity}</p>
                            <p className="text-gray-500">
                              Toplam:{' '}
                              {Number(item.subtotal).toLocaleString('tr-TR', { // Ensure subtotal is treated as number
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
                    {Number(order.totalAmount).toLocaleString('tr-TR', { // Ensure totalAmount is treated as number
                      style: 'currency',
                      currency: 'TRY',
                    })}
                  </p>
                </div>
                {/* Kargo bilgisi dinamik olarak eklenebilir */}
                {/* <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                  <p>Kargo</p>
                  <p>Ücretsiz</p>
                </div> */}
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
                  <p>Toplam</p>
                  <p>
                    {Number(order.totalAmount).toLocaleString('tr-TR', { // Ensure totalAmount is treated as number
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
          <div className=" rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Müşteri Bilgileri</h2>
              {order.user ? (
                <div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">İsim:</span> {order.user?.name || 'Misafir'}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">E-posta:</span> {order.user?.email || '-'}
                  </p>
                  {order.userId && (
                    <Link
                      href={`/admin/users/${order.userId}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Müşteri Profilini Görüntüle
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Müşteri bilgisi bulunamadı (Misafir Siparişi)</p>
              )}
            </div>
          </div>

          <div className=" rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Teslimat Bilgileri</h2>
              <p className="text-gray-600 mb-4 break-words"> {/* break-words eklendi */}
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

          <div className=" rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Ödeme Bilgileri</h2>
              {order.payment ? (
                <>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Ödeme Yöntemi:</span> {order.payment?.method || 'Bilinmiyor'}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Durum:</span> {order.payment?.status || 'Bilinmiyor'}
                  </p>
                  {order.payment?.provider && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Sağlayıcı:</span> {order.payment.provider}
                    </p>
                  )}
                  {order.payment?.transactionId && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">İşlem ID:</span> {order.payment.transactionId}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-600">Ödeme bilgisi bulunamadı</p>
              )}
              {order.billingAddress && (
                <p className="text-gray-600 mt-4 break-words"> {/* break-words eklendi */}
                  <span className="font-medium">Fatura Adresi:</span> {order.billingAddress}
                </p>
              )}
            </div>
          </div>

          <div className=" rounded-lg shadow-md overflow-hidden">
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
