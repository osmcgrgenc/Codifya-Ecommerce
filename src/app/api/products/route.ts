import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product';
import { ProductFilter } from '@/services/product/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Sayfalama parametreleri
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Sıralama parametreleri
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Filtre parametreleri
    const filter: ProductFilter = {};

    const name = searchParams.get('name');
    if (name) filter.name = name;

    const category = searchParams.get('category');
    if (category) filter.category = category;

    const brand = searchParams.get('brand');
    if (brand) filter.brand = brand;

    const featured = searchParams.get('featured');
    if (featured) filter.featured = featured === 'true';

    const minPrice = searchParams.get('minPrice');
    if (minPrice) filter.minPrice = parseFloat(minPrice);

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) filter.maxPrice = parseFloat(maxPrice);

    // Ürünleri getir
    const products = await productService.getPaginatedProducts(
      page,
      limit,
      filter,
      sortBy,
      sortOrder
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error('Ürünler getirilirken hata oluştu:', error);
    return NextResponse.json({ error: 'Ürünler getirilirken bir hata oluştu' }, { status: 500 });
  }
}
