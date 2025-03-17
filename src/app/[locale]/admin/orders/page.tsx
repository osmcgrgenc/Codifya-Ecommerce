'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order, OrderStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Sipariş tablosu bileşeni
const OrdersTable = ({
  orders,
  loading,
  onUpdateStatus,
  onViewDetails,
  formatDate,
  getStatusColor,
}: {
  orders: Order[];
  loading: boolean;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (orderId: string) => void;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: OrderStatus) => string;
}) => {
  if (loading) {
    return (
      <tbody className="divide-y divide-gray-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-24" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-20" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-16" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-12" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-4 w-24" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Skeleton className="h-5 w-20 rounded-full" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-8 w-20" />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  if (orders.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
            Arama kriterlerinize uygun sipariş bulunamadı.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-200">
      {orders.map(order => (
        <tr key={order.id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{order.customerName}</div>
            <div className="text-sm text-gray-500">{order.shippingAddress.city}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">
              {order.total.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              })}
            </div>
            <div className="text-xs text-gray-500">{order.items.length} ürün</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
              {order.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' : 'Havale/EFT'}
            </div>
            {order.referenceCode && (
              <div className="text-xs text-gray-500">Ref: {order.referenceCode}</div>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status === 'PENDING' && 'Beklemede'}
              {order.status === 'PROCESSING' && 'İşleniyor'}
              {order.status === 'SHIPPED' && 'Kargoya Verildi'}
              {order.status === 'DELIVERED' && 'Teslim Edildi'}
              {order.status === 'CANCELLED' && 'İptal Edildi'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2">
            <Select
              value={order.status}
              onValueChange={(value: string) => onUpdateStatus(order.id, value as OrderStatus)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Durum Değiştir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Beklemede</SelectItem>
                <SelectItem value="PROCESSING">İşleniyor</SelectItem>
                <SelectItem value="SHIPPED">Kargoya Verildi</SelectItem>
                <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => onViewDetails(order.id)}>
              Detaylar
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

// Filtre bileşeni
const OrderFilters = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: {
  searchTerm: string;
  statusFilter: OrderStatus | 'ALL';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | 'ALL') => void;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        placeholder="Sipariş no veya müşteri adı ara..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="max-w-md"
      />
      <Select
        value={statusFilter}
        onValueChange={(value: string) => onStatusChange(value as OrderStatus | 'ALL')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Durum Filtresi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tümü</SelectItem>
          <SelectItem value="PENDING">Beklemede</SelectItem>
          <SelectItem value="PROCESSING">İşleniyor</SelectItem>
          <SelectItem value="SHIPPED">Kargoya Verildi</SelectItem>
          <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
          <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  // Başarı mesajı gösterme fonksiyonu
  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  // Hata mesajı gösterme fonksiyonu
  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  // Siparişleri API'den çek
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/orders');

        if (!response.ok) {
          throw new Error('Siparişler getirilemedi');
        }

        const data = await response.json();

        // API'den gelen verileri Order tipine dönüştür
        const formattedOrders: Order[] = data.data.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber || `ORD-${order.id.substring(0, 8)}`,
          userId: order.userId,
          date: order.createdAt,
          customerName: order.user?.name || 'Misafir Kullanıcı',
          items: order.items.map((item: any) => ({
            id: item.id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            image: item.product.images?.[0]?.url || 'https://via.placeholder.com/50',
          })),
          shippingAddress: {
            contactName: order.shippingAddress ?? 'Bilgi Yok',
            address: order.shippingAddress ?? 'Bilgi Yok',
            city: order.shippingAddress ?? 'Bilgi Yok',
            country: order.shippingAddress ?? 'Türkiye',
            zipCode: order.shippingAddress ?? 'Bilgi Yok',
          },
          billingAddress: {
            contactName: order.billingAddress ?? 'Bilgi Yok',
            address: order.billingAddress ?? 'Bilgi Yok',
            city: order.billingAddress ?? 'Bilgi Yok',
            country: order.billingAddress ?? 'Türkiye',
            zipCode: order.billingAddress ?? 'Bilgi Yok',
          },
          total: order.totalAmount,
          status: order.status,
          paymentMethod: order.payment?.method || 'CREDIT_CARD',
          referenceCode: order.referenceCode,
        }));

        setOrders(formattedOrders);
      } catch (error) {
        showError('Siparişler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showError]);

  // Sipariş arama ve filtreleme
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sipariş durumu güncelleme
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderIds: [orderId],
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Durum güncellenemedi');
      }

      // Başarılı yanıt alındığında state'i güncelle
      setOrders(
        orders.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
      );

      showSuccess('Sipariş durumu güncellendi');
    } catch (error) {
      showError('Durum güncellenirken bir hata oluştu');
    }
  };

  // Sipariş detaylarına git
  const handleViewDetails = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  // Sipariş durumuna göre renk belirleme
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Siparişler</h1>

      <OrderFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />

      <div className="rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sipariş No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tarih
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Müşteri
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Toplam
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ödeme Yöntemi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Durum
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            <OrdersTable
              orders={filteredOrders}
              loading={loading}
              onUpdateStatus={handleUpdateStatus}
              onViewDetails={handleViewDetails}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
            />
          </table>
        </div>
      </div>
    </div>
  );
}
