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
import { Order, OrderStatus } from "@/types";

// Örnek sipariş verileri
const initialOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2023-001",
    userId: "user1",
    date: new Date("2023-05-15").toISOString(),
    customerName: "Ahmet Yılmaz",
    items: [
      {
        id: "1",
        name: "Akıllı Telefon",
        price: 5999.99,
        quantity: 1,
        image: "https://via.placeholder.com/50",
      },
      {
        id: "3",
        name: "Kablosuz Kulaklık",
        price: 1299.99,
        quantity: 1,
        image: "https://via.placeholder.com/50",
      },
    ],
    shippingAddress: {
      contactName: "Ahmet Yılmaz",
      address: "Atatürk Cad. No:123",
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34000",
    },
    billingAddress: {
      contactName: "Ahmet Yılmaz",
      address: "Atatürk Cad. No:123",
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34000",
    },
    total: 7299.98,
    status: "DELIVERED",
    paymentMethod: "CREDIT_CARD",
  },
  {
    id: "2",
    orderNumber: "ORD-2023-002",
    userId: "user2",
    date: new Date("2023-05-18").toISOString(),
    customerName: "Ayşe Demir",
    items: [
      {
        id: "2",
        name: "Laptop",
        price: 12999.99,
        quantity: 1,
        image: "https://via.placeholder.com/50",
      },
    ],
    shippingAddress: {
      contactName: "Ayşe Demir",
      address: "Cumhuriyet Mah. 1453 Sok. No:7",
      city: "Ankara",
      country: "Türkiye",
      zipCode: "06000",
    },
    billingAddress: {
      contactName: "Ayşe Demir",
      address: "Cumhuriyet Mah. 1453 Sok. No:7",
      city: "Ankara",
      country: "Türkiye",
      zipCode: "06000",
    },
    total: 12999.99,
    status: "SHIPPED",
    paymentMethod: "CREDIT_CARD",
  },
  {
    id: "3",
    orderNumber: "ORD-2023-003",
    userId: "user3",
    date: new Date("2023-05-20").toISOString(),
    customerName: "Mehmet Kaya",
    items: [
      {
        id: "4",
        name: "Erkek T-Shirt",
        price: 299.99,
        quantity: 2,
        image: "https://via.placeholder.com/50",
      },
      {
        id: "6",
        name: "Spor Ayakkabı",
        price: 899.99,
        quantity: 1,
        image: "https://via.placeholder.com/50",
      },
    ],
    shippingAddress: {
      contactName: "Mehmet Kaya",
      address: "Bağdat Cad. No:42",
      city: "İzmir",
      country: "Türkiye",
      zipCode: "35000",
    },
    billingAddress: {
      contactName: "Mehmet Kaya",
      address: "Bağdat Cad. No:42",
      city: "İzmir",
      country: "Türkiye",
      zipCode: "35000",
    },
    total: 1499.97,
    status: "PROCESSING",
    paymentMethod: "BANK_TRANSFER",
    referenceCode: "REF123456789",
  },
  {
    id: "4",
    orderNumber: "ORD-2023-004",
    userId: "user4",
    date: new Date("2023-05-22").toISOString(),
    customerName: "Zeynep Şahin",
    items: [
      {
        id: "5",
        name: "Kadın Elbise",
        price: 499.99,
        quantity: 1,
        image: "https://via.placeholder.com/50",
      },
    ],
    shippingAddress: {
      contactName: "Zeynep Şahin",
      address: "Gazi Cad. No:56",
      city: "Bursa",
      country: "Türkiye",
      zipCode: "16000",
    },
    billingAddress: {
      contactName: "Zeynep Şahin",
      address: "Gazi Cad. No:56",
      city: "Bursa",
      country: "Türkiye",
      zipCode: "16000",
    },
    total: 499.99,
    status: "PENDING",
    paymentMethod: "CREDIT_CARD",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  // Sipariş arama ve filtreleme
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sipariş durumu güncelleme
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Sipariş durumuna göre renk belirleme
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Siparişler</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Sipariş no veya müşteri adı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Select
          value={statusFilter}
          onValueChange={(value: string) => setStatusFilter(value as OrderStatus | "ALL")}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(order.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.shippingAddress.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.total.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items.length} ürün
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.paymentMethod === "CREDIT_CARD"
                        ? "Kredi Kartı"
                        : "Havale/EFT"}
                    </div>
                    {order.referenceCode && (
                      <div className="text-xs text-gray-500">
                        Ref: {order.referenceCode}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status === "PENDING" && "Beklemede"}
                      {order.status === "PROCESSING" && "İşleniyor"}
                      {order.status === "SHIPPED" && "Kargoya Verildi"}
                      {order.status === "DELIVERED" && "Teslim Edildi"}
                      {order.status === "CANCELLED" && "İptal Edildi"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Select
                      value={order.status}
                      onValueChange={(value: string) =>
                        handleUpdateStatus(order.id, value as OrderStatus)
                      }
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => alert(`Sipariş Detayı: ${order.id}`)}
                    >
                      Detaylar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 