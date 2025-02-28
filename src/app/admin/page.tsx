import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Admin Paneli | Codifya E-Ticaret',
  description: 'E-ticaret sitesi yönetim paneli',
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Satış</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺24,780.00</div>
            <p className="text-xs text-green-500 mt-1">+12% geçen aya göre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Sipariş</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-green-500 mt-1">+8% geçen aya göre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Müşteri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-green-500 mt-1">+15% geçen aya göre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ortalama Sepet Tutarı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺158.85</div>
            <p className="text-xs text-red-500 mt-1">-3% geçen aya göre</p>
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
              {[1, 2, 3, 4, 5].map(order => (
                <div key={order} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">Sipariş #{order + 1000}</div>
                    <div className="text-sm text-gray-500">
                      {new Date().toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₺{(Math.random() * 1000).toFixed(2)}</div>
                    <div className="text-sm text-green-500">Tamamlandı</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popüler Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                'Akıllı Telefon',
                'Laptop',
                'Kablosuz Kulaklık',
                'Erkek T-Shirt',
                'Kadın Elbise',
              ].map((product, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">{product}</div>
                    <div className="text-sm text-gray-500">
                      {Math.floor(Math.random() * 100)} adet satıldı
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₺{(Math.random() * 1000).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
