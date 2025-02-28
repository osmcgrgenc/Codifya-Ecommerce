"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import { Textarea } from "@/components/ui/textarea";

// Örnek ürün verileri
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Akıllı Telefon",
    price: 5999.99,
    image: "https://via.placeholder.com/300",
    category: "Elektronik",
    description: "Son teknoloji akıllı telefon, yüksek performans ve uzun pil ömrü.",
    stock: 15
  },
  {
    id: "2",
    name: "Laptop",
    price: 12999.99,
    image: "https://via.placeholder.com/300",
    category: "Elektronik",
    description: "Güçlü işlemci ve yüksek çözünürlüklü ekran ile profesyonel laptop.",
    stock: 8
  },
  {
    id: "3",
    name: "Kablosuz Kulaklık",
    price: 1299.99,
    image: "https://via.placeholder.com/300",
    category: "Elektronik",
    description: "Gürültü önleyici özellikli, uzun pil ömürlü kablosuz kulaklık.",
    stock: 25
  },
  {
    id: "4",
    name: "Erkek T-Shirt",
    price: 299.99,
    image: "https://via.placeholder.com/300",
    category: "Giyim",
    description: "Yüksek kaliteli pamuktan üretilmiş, rahat kesim erkek t-shirt.",
    stock: 50
  },
  {
    id: "5",
    name: "Kadın Elbise",
    price: 499.99,
    image: "https://via.placeholder.com/300",
    category: "Giyim",
    description: "Şık tasarımlı, her mevsim giyilebilen kadın elbisesi.",
    stock: 30
  },
  {
    id: "6",
    name: "Spor Ayakkabı",
    price: 899.99,
    image: "https://via.placeholder.com/300",
    category: "Giyim",
    description: "Hafif ve dayanıklı, her türlü aktivite için uygun spor ayakkabı.",
    stock: 20
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    image: "https://via.placeholder.com/300",
    category: "",
    description: "",
    stock: 0
  });

  // Ürün arama
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Yeni ürün ekleme
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const id = (products.length + 1).toString();
    setProducts([...products, { id, ...newProduct }]);
    setNewProduct({
      name: "",
      price: 0,
      image: "https://via.placeholder.com/300",
      category: "",
      description: "",
      stock: 0
    });
    setShowAddForm(false);
  };

  // Ürün silme
  const handleDeleteProduct = (id: string) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ürünler</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "İptal" : "Yeni Ürün Ekle"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Yeni Ürün Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Ürün Adı</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="price">Fiyat (₺)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="stock">Stok Adedi</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock || 0}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="image">Görsel URL</Label>
                <Input
                  id="image"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Ürün Açıklaması</Label>
                <Textarea
                  id="description"
                  value={newProduct.description || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={handleAddProduct}>
              Ürün Ekle
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <Input
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ürün
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fiyat
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stok
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
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.price.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.stock !== undefined ? product.stock : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => alert(`Düzenle: ${product.id}`)}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
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