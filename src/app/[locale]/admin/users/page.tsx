'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, UserRole } from '@/types';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  const { toast } = useToast();
  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kullanıcılar yüklenirken bir hata oluştu.',
      });
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Kullanıcı arama ve filtreleme
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Kullanıcı rolü güncelleme
  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    setUsers(users.map(user => (user.id === userId ? { ...user, role: newRole } : user)));
  };

  // Kullanıcı silme
  const handleDeleteUser = (userId: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      setUsers(users.filter(user => user.id !== userId));
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

  // Rol rengini belirleme
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'CUSTOMER_SERVICE':
        return 'bg-blue-100 text-blue-800';
      case 'USER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Rol Türkçe çevirisi
  const getRoleText = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'Yönetici';
      case 'CUSTOMER_SERVICE':
        return 'Müşteri Hizmetleri';
      case 'USER':
        return 'Kullanıcı';
      default:
        return role;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kullanıcılar</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="İsim veya e-posta ara..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Select
          value={roleFilter}
          onValueChange={(value: string) => setRoleFilter(value as UserRole | 'ALL')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rol Filtresi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tümü</SelectItem>
            <SelectItem value="ADMIN">Yönetici</SelectItem>
            <SelectItem value="CUSTOMER_SERVICE">Müşteri Hizmetleri</SelectItem>
            <SelectItem value="USER">Kullanıcı</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className=" rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kullanıcı
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                E-posta
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kayıt Tarihi
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rol
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
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={user.image || '/images/placeholder.jpg'}
                        alt={user.name}
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(user.createdAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Select
                    value={user.role}
                    onValueChange={(value: string) => handleUpdateRole(user.id, value as UserRole)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Rol Değiştir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Yönetici</SelectItem>
                      <SelectItem value="CUSTOMER_SERVICE">Müşteri Hizmetleri</SelectItem>
                      <SelectItem value="USER">Kullanıcı</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Sil
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
