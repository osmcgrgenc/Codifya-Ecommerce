'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatus } from '@prisma/client';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  salesGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  aovGrowth: number;
}

interface RecentOrder {
  id: string;
  createdAt: Date;
  totalAmount: number;
  status: OrderStatus;
}

interface PopularProduct {
  id: string;
  name: string;
  price: number;
  soldCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    aovGrowth: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // İstatistikleri getir
        const statsResponse = await fetch('/api/admin/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
        
        // Son siparişleri getir
        const ordersResponse = await fetch('/api/admin/recent-orders');
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData);
        }
        
        // Popüler ürünleri getir
        const productsResponse = await fetch('/api/admin/popular-products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setPopularProducts(productsData);
        }
      } catch (error) {
        console.error('Dashboard verisi yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Sipariş durumunu Türkçe'ye çeviren yardımcı fonksiyon
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID:
      case OrderStatus.DELIVERED:
        return 'Tamamlandı';
      case OrderStatus.SHIPPED:
        return 'Kargoda';
      case OrderStatus.PENDING:
      case OrderStatus.PENDING_PAYMENT:
      case OrderStatus.PROCESSING:
        return 'İşleniyor';
      case OrderStatus.CANCELLED:
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  // Sipariş durumuna göre renk sınıfı
  const getStatusColorClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAID:
      case OrderStatus.DELIVERED:
        return 'text-green-500';
      case OrderStatus.SHIPPED:
        return 'text-blue-500';
      case OrderStatus.PENDING:
      case OrderStatus.PENDING_PAYMENT:
      case OrderStatus.PROCESSING:
        return 'text-yellow-500';
      case OrderStatus.CANCELLED:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Satış</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSales.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              })}
            </div>
            <p className={`text-xs ${stats.salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
              {stats.salesGrowth >= 0 ? '+' : ''}{stats.salesGrowth}% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Sipariş</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className={`text-xs ${stats.ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
              {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth}% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Müşteri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className={`text-xs ${stats.customersGrowth >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
              {stats.customersGrowth >= 0 ? '+' : ''}{stats.customersGrowth}% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ortalama Sepet Tutarı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageOrderValue.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              })}
            </div>
            <p className={`text-xs ${stats.aovGrowth >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
              {stats.aovGrowth >= 0 ? '+' : ''}{stats.aovGrowth}% geçen aya göre
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Siparişler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Henüz sipariş bulunmuyor.</p>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">Sipariş #{order.id}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {order.totalAmount.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        })}
                      </div>
                      <div className={`text-sm ${getStatusColorClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popüler Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Henüz ürün satışı bulunmuyor.</p>
              ) : (
                popularProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        {product.soldCount} adet satıldı
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {product.price.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
