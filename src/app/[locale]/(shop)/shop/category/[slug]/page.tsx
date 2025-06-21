import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Product, Category, Brand } from '@prisma/client';
import ProductCard from '../../product-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Grid2X2,
  List,
  ChevronDown,
} from 'lucide-react';

// Kategori tipi
type CategoryWithRelations = Category & {
  children?: CategoryWithRelations[];
  parent?: CategoryWithRelations | null;
};

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    brands?: string;
  };
}

// Kategori bilgilerini getiren fonksiyon
async function getCategoryBySlug(slug: string): Promise<CategoryWithRelations | null> {
  try {
    const category = await prisma.category.findFirst({
      where: { slug },
      include: {
        children: true,
        parent: true,
      },
    });
    return category as CategoryWithRelations;
  } catch (error) {
    return null;
  }
}

// Tüm kategorileri getiren fonksiyon
async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return categories;
  } catch (error) {
    return [];
  }
}

// Kategoriye ait ürünleri getiren fonksiyon
async function getProductsByCategory(
  slug: string,
  page: number = 1,
  sort: string = 'newest',
  minPrice?: number,
  maxPrice?: number,
  brandIds?: string[]
): Promise<{ products: any[]; total: number; pageSize: number }> {
  try {
    const pageSize = 12;
    const skip = (page - 1) * pageSize;

    // Kategoriyi bul
    const category = await prisma.category.findFirst({
      where: { slug },
      select: { id: true },
    });

    if (!category) return { products: [], total: 0, pageSize };

    // Filtreleme koşullarını oluştur
    const where: any = {
      categoryId: category.id,
    };

    // Fiyat filtresi
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Marka filtresi
    if (brandIds && brandIds.length > 0) {
      where.brandId = { in: brandIds };
    }

    // Sıralama seçenekleri
    let orderBy: any = {};
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Toplam ürün sayısını getir
    const total = await prisma.product.count({ where });

    // Ürünleri getir
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        category: true,
        brand: true,
        images: {
          where: { isMain: true },
          take: 1,
        },
      },
    });

    // Ana görseli olmayan ürünler için ilk görseli getir
    for (const product of products) {
      if (product.images.length === 0) {
        const firstImage = await prisma.productImage.findFirst({
          where: { productId: product.id },
        });
        if (firstImage) {
          product.images = [firstImage];
        }
      }
    }

    return { products, total, pageSize };
  } catch (error) {
    return { products: [], total: 0, pageSize: 12 };
  }
}

// Markaları getiren fonksiyon
async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return brands;
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Kategori Bulunamadı',
    };
  }

  return {
    title: `${category.name} | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: category.description || `${category.name} kategorisindeki ürünleri keşfedin`,
    openGraph: {
      title: `${category.name} | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
      description: category.description || `${category.name} kategorisindeki ürünleri keşfedin`,
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // URL parametrelerini al
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const sort = searchParams.sort || 'newest';
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const brandIds = searchParams.brands ? searchParams.brands.split(',') : undefined;

  // Verileri getir
  const category = await getCategoryBySlug(params.slug);
  if (!category) return notFound();

  const { products, total, pageSize } = await getProductsByCategory(
    params.slug,
    page,
    sort,
    minPrice,
    maxPrice,
    brandIds
  );

  const categories = await getAllCategories();
  const brands = await getBrands();

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(total / pageSize);

  // Fiyat aralığını belirle
  const allPrices = products.map(p => Number(p.price));
  const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const highestPrice = allPrices.length > 0 ? Math.max(...allPrices) : 1000;

  // Sayfalama için URL oluştur
  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    if (sort) params.set('sort', sort);
    if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
    if (brandIds) params.set('brands', brandIds.join(','));
    return `?${params.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Üst Başlık ve Kategori Yolu */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/shop" className="hover:text-indigo-600">
            Ana Sayfa
          </Link>
          <ChevronRight className="w-4 h-4" />

          {category.parent && (
            <>
              <Link
                href={`/shop/category/${category.parent.slug}`}
                className="hover:text-indigo-600"
              >
                {category.parent.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}

          <span className="font-medium text-gray-900">{category.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && <p className="text-gray-600 mt-2">{category.description}</p>}
          </div>

          {/* Kategori Görseli */}
          {category.image && (
            <div className="relative w-full md:w-48 h-24 rounded-lg overflow-hidden">
              <Image src={category.image} alt={category.name} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Alt Kategoriler */}
      {category.children && category.children.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Alt Kategoriler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {category.children.map(subCategory => (
              <Link
                key={subCategory.id}
                href={`/shop/category/${subCategory.slug}`}
                className="group"
              >
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-all hover:border-indigo-300 hover:shadow-md">
                  {subCategory.image ? (
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <Image
                        src={subCategory.image}
                        alt={subCategory.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xl">{subCategory.name.charAt(0)}</span>
                    </div>
                  )}
                  <h3 className="text-sm font-medium group-hover:text-indigo-600">
                    {subCategory.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sol Taraf - Filtreler */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6  p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Filtreler</h2>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <X className="w-4 h-4 mr-1" /> Temizle
              </Button>
            </div>

            <div className="space-y-4">
              {/* Kategoriler */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Kategoriler</h3>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center">
                      <Link
                        href={`/shop/category/${cat.slug}`}
                        className={`text-sm hover:text-indigo-600 ${
                          cat.id === category.id ? 'font-medium text-indigo-600' : 'text-gray-700'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fiyat Aralığı */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Fiyat Aralığı</h3>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="w-[45%]"
                      defaultValue={minPrice?.toString()}
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="w-[45%]"
                      defaultValue={maxPrice?.toString()}
                    />
                  </div>
                  <div className="pt-2">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: '50%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">Uygula</Button>
                  </div>
                </div>
              </div>

              {/* Markalar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Markalar</h3>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {brands.map(brand => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand.id}`}
                        defaultChecked={brandIds?.includes(brand.id)}
                      />
                      <label
                        htmlFor={`brand-${brand.id}`}
                        className="text-sm text-gray-700 cursor-pointer hover:text-indigo-600"
                      >
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Ürün Listesi */}
        <div className="lg:col-span-3">
          {/* Üst Araç Çubuğu */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">
                <strong>{total}</strong> ürün bulundu
              </span>

              {/* Mobil Filtre Butonu */}
              <Button variant="outline" size="sm" className="sm:hidden ml-auto">
                <SlidersHorizontal className="w-4 h-4 mr-1" /> Filtrele
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {/* Görünüm Seçenekleri */}
              <div className="hidden sm:flex items-center border rounded-md">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Grid2X2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sıralama */}
              <Select defaultValue={sort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">En Yeniler</SelectItem>
                  <SelectItem value="price-asc">Fiyat (Artan)</SelectItem>
                  <SelectItem value="price-desc">Fiyat (Azalan)</SelectItem>
                  <SelectItem value="name-asc">İsim (A-Z)</SelectItem>
                  <SelectItem value="name-desc">İsim (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Aktif Filtreler */}
          {(minPrice !== undefined || maxPrice !== undefined || brandIds) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {minPrice !== undefined && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min: {minPrice.toLocaleString('tr-TR')} ₺
                  <X className="w-3 h-3 cursor-pointer" />
                </Badge>
              )}

              {maxPrice !== undefined && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Max: {maxPrice.toLocaleString('tr-TR')} ₺
                  <X className="w-3 h-3 cursor-pointer" />
                </Badge>
              )}

              {brandIds &&
                brands
                  .filter(b => brandIds.includes(b.id))
                  .map(brand => (
                    <Badge key={brand.id} variant="secondary" className="flex items-center gap-1">
                      {brand.name}
                      <X className="w-3 h-3 cursor-pointer" />
                    </Badge>
                  ))}
            </div>
          )}

          {/* Ürün Listesi */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-medium mb-4">Bu kategoride ürün bulunamadı</h2>
              <p className="text-gray-500 mb-8">
                Şu anda bu kategoride ürün bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin
                veya filtreleri değiştirin.
              </p>
              <Link href="/shop">
                <Button>Tüm Ürünleri Görüntüle</Button>
              </Link>
            </div>
          )}

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-1">
                <Link
                  href={page > 1 ? createPageUrl(page - 1) : '#'}
                  className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                    page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                  aria-disabled={page <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <Link
                    key={pageNum}
                    href={createPageUrl(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                      pageNum === page
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}

                <Link
                  href={page < totalPages ? createPageUrl(page + 1) : '#'}
                  className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                    page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                  aria-disabled={page >= totalPages}
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
