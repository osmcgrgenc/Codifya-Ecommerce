"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserRole } from "@/types";

// Örnek kullanıcı verileri
const initialUsers: User[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    role: "ADMIN",
    createdAt: new Date("2023-01-15").toISOString(),
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Ayşe Demir",
    email: "ayse@example.com",
    role: "USER",
    createdAt: new Date("2023-02-20").toISOString(),
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "3",
    name: "Mehmet Kaya",
    email: "mehmet@example.com",
    role: "USER",
    createdAt: new Date("2023-03-10").toISOString(),
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "4",
    name: "Zeynep Şahin",
    email: "zeynep@example.com",
    role: "CUSTOMER_SERVICE",
    createdAt: new Date("2023-04-05").toISOString(),
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "5",
    name: "Ali Öztürk",
    email: "ali@example.com",
    role: "USER",
    createdAt: new Date("2023-05-12").toISOString(),
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");

  // Kullanıcı arama ve filtreleme
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Kullanıcı rolü güncelleme
  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  // Kullanıcı silme
  const handleDeleteUser = (userId: string) => {
    if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Rol rengini belirleme
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "CUSTOMER_SERVICE":
        return "bg-blue-100 text-blue-800";
      case "USER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Rol Türkçe çevirisi
  const getRoleText = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "Yönetici";
      case "CUSTOMER_SERVICE":
        return "Müşteri Hizmetleri";
      case "USER":
        return "Kullanıcı";
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
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Select
          value={roleFilter}
          onValueChange={(value: string) => setRoleFilter(value as UserRole | "ALL")}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.image || "https://via.placeholder.com/40"}
                        alt={user.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </div>
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
                    onValueChange={(value: string) =>
                      handleUpdateRole(user.id, value as UserRole)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Rol Değiştir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Yönetici</SelectItem>
                      <SelectItem value="CUSTOMER_SERVICE">
                        Müşteri Hizmetleri
                      </SelectItem>
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