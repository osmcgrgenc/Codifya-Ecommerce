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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@prisma/client';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: Date | null;
  orders: {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: Date;
    referenceCode: string | null;
  }[];
  reviews: {
    id: string;
    productId: string;
    rating: number;
    comment: string;
    createdAt: Date;
    product: {
      name: string;
      slug: string;
    };
  }[];
  addresses: {
    id: string;
    title: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
  }[];
}

// Örnek kullanıcı verisi
const mockUser: User = {
  id: 'user1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  image: 'https://via.placeholder.com/150',
  role: UserRole.CUSTOMER,
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date('2023-05-20'),
  emailVerified: new Date('2023-01-15'),
  orders: [
    {
      id: 'order1',
      status: 'DELIVERED',
      totalAmount: 7299.98,
      createdAt: new Date('2023-05-15'),
      referenceCode: 'REF123456789',
    },
    {
      id: 'order2',
      status: 'PROCESSING',
      totalAmount: 1499.97,
      createdAt: new Date('2023-06-10'),
      referenceCode: 'REF987654321',
    },
  ],
  reviews: [
    {
      id: 'review1',
      productId: 'prod1',
      rating: 5,
      comment: 'Harika bir ürün, çok memnun kaldım!',
      createdAt: new Date('2023-05-20'),
      product: {
        name: 'Akıllı Telefon',
        slug: 'akilli-telefon',
      },
    },
    {
      id: 'review2',
      productId: 'prod2',
      rating: 4,
      comment: 'Güzel ürün, tavsiye ederim.',
      createdAt: new Date('2023-06-15'),
      product: {
        name: 'Kablosuz Kulaklık',
        slug: 'kablosuz-kulaklik',
      },
    },
  ],
  addresses: [
    {
      id: 'addr1',
      title: 'Ev',
      address: 'Atatürk Cad. No:123',
      city: 'İstanbul',
      country: 'Türkiye',
      zipCode: '34000',
      isDefault: true,
    },
    {
      id: 'addr2',
      title: 'İş',
      address: 'İstiklal Cad. No:45',
      city: 'İstanbul',
      country: 'Türkiye',
      zipCode: '34100',
      isDefault: false,
    },
  ],
};

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilecek
    // Şimdilik mock veri kullanıyoruz
    setUser(mockUser);
    setName(mockUser.name);
    setEmail(mockUser.email);
    setRole(mockUser.role);
    setLoading(false);
  }, [params.id]);

  const handleUpdateUser = () => {
    if (!user) return;

    // Gerçek uygulamada API'ye gönderilecek
    const updatedUser = {
      ...user,
      name,
      email,
      role,
    };

    setUser(updatedUser);
    toast.success('Kullanıcı bilgileri başarıyla güncellendi');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı bulunamadı</h3>
        <p className="text-gray-500 mb-6">İstediğiniz kullanıcı bilgilerine ulaşılamadı.</p>
        <Link
          href="/admin/users"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Kullanıcılara Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/admin/users" className="text-indigo-600 hover:text-indigo-900 mr-4">
            ← Kullanıcılara Dön
          </Link>
          <h1 className="text-3xl font-bold">Kullanıcı Detayları</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
          <Button onClick={handleUpdateUser}>Değişiklikleri Kaydet</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className=" rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Image
                    src={user.image || '/images/placeholder-user.jpg'}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                  />
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <span
                  className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    user.role === UserRole.ADMIN
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === UserRole.CUSTOMER
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {user.role === UserRole.ADMIN ? 'Admin' : 'Kullanıcı'}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    İsim
                  </label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <Select value={role} onValueChange={value => setRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.CUSTOMER}>Kullanıcı</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.CUSTOMER_SERVICE}>Müşteri Hizmetleri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-2">Hesap Bilgileri</h3>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-medium">Kayıt Tarihi:</span>{' '}
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-medium">Son Güncelleme:</span>{' '}
                  {new Date(user.updatedAt).toLocaleDateString('tr-TR')}
                </p>
                {user.emailVerified && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">E-posta Doğrulandı:</span>{' '}
                    {new Date(user.emailVerified).toLocaleDateString('tr-TR')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">Siparişler</TabsTrigger>
              <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
              <TabsTrigger value="addresses">Adresler</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              <div className=" rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Siparişler</h3>

                  {user.orders.length === 0 ? (
                    <p className="text-gray-500">Kullanıcının henüz siparişi bulunmuyor.</p>
                  ) : (
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
                              Durum
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Toplam
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              İşlemler
                            </th>
                          </tr>
                        </thead>
                        <tbody className=" divide-y divide-gray-200">
                          {user.orders.map(order => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.referenceCode || order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === 'DELIVERED'
                                      ? 'bg-green-100 text-green-800'
                                      : order.status === 'SHIPPED'
                                        ? 'bg-blue-100 text-blue-800'
                                        : order.status === 'PROCESSING'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : order.status === 'CANCELLED'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.totalAmount.toLocaleString('tr-TR', {
                                  style: 'currency',
                                  currency: 'TRY',
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/admin/orders/${order.id}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Görüntüle
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className=" rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Değerlendirmeler</h3>

                  {user.reviews.length === 0 ? (
                    <p className="text-gray-500">Kullanıcının henüz değerlendirmesi bulunmuyor.</p>
                  ) : (
                    <div className="space-y-6">
                      {user.reviews.map(review => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <Link
                                href={`/products/${review.product.slug}`}
                                className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                              >
                                {review.product.name}
                              </Link>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 15.585l-7.07 3.707 1.35-7.87-5.72-5.573 7.91-1.149L10 0l3.53 7.7 7.91 1.149-5.72 5.573 1.35 7.87L10 15.585z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ))}
                                <span className="ml-2 text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                            </div>
                            <Link
                              href={`/admin/products/${review.productId}`}
                              className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                              Ürünü Görüntüle
                            </Link>
                          </div>
                          <p className="mt-3 text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <div className=" rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Adresler</h3>

                  {user.addresses.length === 0 ? (
                    <p className="text-gray-500">Kullanıcının henüz adresi bulunmuyor.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.addresses.map(address => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 ${
                            address.isDefault ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-md font-medium text-gray-900">{address.title}</h4>
                            {address.isDefault && (
                              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                Varsayılan
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{address.address}</p>
                          <p className="text-gray-600 text-sm">
                            {address.city}, {address.country}, {address.zipCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
