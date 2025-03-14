// 'use client' direktifini kaldırıyoruz
// import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Product, Category, ProductImage, Brand } from '@prisma/client';
// import { useToast } from '@/components/ui/use-toast';
import { PaginatedResult, ProductFilter, productService } from '@/services/product';
// import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { categoryService } from '@/services';
import { brandService } from '@/services';

import ProductListClient from './product-list-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ürün Yönetimi | Admin Panel',
  description: 'Ürün yönetimi sayfası',
};

// Sayfa parametrelerini tanımlıyoruz
interface ProductsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
}

// Ana sayfa bileşeni - artık async olarak tanımlıyoruz
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // URL parametrelerinden değerleri alıyoruz
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = Number(searchParams.limit) || 10;
  const searchTerm = searchParams.search || '';
  const categoryFilter = searchParams.category || 'ALL';
  const sortBy = searchParams.sortBy || 'createdAt';
  const sortOrder = (searchParams.sortOrder as 'asc' | 'desc') || 'desc';

  // Filtreleme seçeneklerini oluşturuyoruz
  const filter: ProductFilter = {};

  if (searchTerm) {
    filter.name = searchTerm;
  }

  if (categoryFilter && categoryFilter !== 'ALL') {
    filter.category = categoryFilter;
  }

  // Verileri server-side'da yüklüyoruz
  const [productsResult, categories, brands] = await Promise.all([
    productService.getPaginatedProducts(currentPage, itemsPerPage, filter, sortBy, sortOrder),
    categoryService.getAllCategories(),
    brandService.getAllBrands(),
  ]);

  // API yanıtını işliyoruz
  let products: PaginatedResult<
    Product & {
      category?: { name: string };
      brand?: { name: string };
      images?: ProductImage[];
    }
  > = {
    data: [],
    total: 0,
    page: currentPage,
    limit: itemsPerPage,
    totalPages: 0,
  };

  // API yanıtını doğru formata dönüştürüyoruz
  if (productsResult && productsResult.data && Array.isArray(productsResult.data)) {
    products = {
      data: productsResult.data,
      total: productsResult.total || 0,
      page: productsResult.page || currentPage,
      limit: productsResult.limit || itemsPerPage,
      totalPages: productsResult.totalPages || 1,
    };
  } else if (productsResult && typeof productsResult === 'object' && 'data' in productsResult) {
    // API yanıtı bir üst katmanda olabilir
    const apiResponse = productsResult as any;

    if (apiResponse.data && typeof apiResponse.data === 'object') {
      const paginatedData = apiResponse.data;

      if (Array.isArray(paginatedData.data)) {
        products = {
          data: paginatedData.data,
          total: paginatedData.total || 0,
          page: paginatedData.page || currentPage,
          limit: paginatedData.limit || itemsPerPage,
          totalPages: paginatedData.totalPages || 1,
        };
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ürünler</h1>

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        }
      >
        <ProductListClient
          initialProducts={products}
          initialCategories={categories}
          initialBrands={brands}
          initialPage={currentPage}
          initialLimit={itemsPerPage}
          initialSearch={searchTerm}
          initialCategory={categoryFilter}
          initialSortBy={sortBy}
          initialSortOrder={sortOrder}
        />
      </Suspense>
    </div>
  );
}
