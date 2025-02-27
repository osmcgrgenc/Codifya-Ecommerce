import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Paneli | Codifya E-Ticaret",
  description: "Yönetici paneli",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "CUSTOMER_SERVICE")) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Ürünler</h2>
          <p className="text-gray-500 mb-4">
            Ürünleri yönetin, yeni ürünler ekleyin, düzenleyin veya silin.
          </p>
          <a
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Ürünleri Yönet
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Kategoriler</h2>
          <p className="text-gray-500 mb-4">
            Kategorileri yönetin, yeni kategoriler ekleyin, düzenleyin veya silin.
          </p>
          <a
            href="/admin/categories"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Kategorileri Yönet
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Siparişler</h2>
          <p className="text-gray-500 mb-4">
            Siparişleri görüntüleyin ve yönetin.
          </p>
          <a
            href="/admin/orders"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Siparişleri Yönet
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Kullanıcılar</h2>
          <p className="text-gray-500 mb-4">
            Kullanıcıları yönetin ve rolleri düzenleyin.
          </p>
          <a
            href="/admin/users"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Kullanıcıları Yönet
          </a>
        </div>

        {session.user.role === "ADMIN" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium mb-4">Ayarlar</h2>
            <p className="text-gray-500 mb-4">
              Sistem ayarlarını yapılandırın.
            </p>
            <a
              href="/admin/settings"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Ayarları Yönet
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 