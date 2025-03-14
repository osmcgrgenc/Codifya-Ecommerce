import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/product';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createPaginatedResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseQueryParams, parseJsonData } from '@/services/api-service';
import {
  productQuerySchema,
  createProductSchema,
  updateProductSchema,
  ProductQueryParams,
  CreateProductData,
  UpdateProductData,
} from './schemas';
import { slugify } from '@/lib/utils';

/**
 * GET: Ürünleri listele (sayfalama ve filtreleme ile)
 */
async function getProducts(req: NextRequest, context: any, session: any): Promise<NextResponse> {
  // Sorgu parametrelerini doğrula
  const queryResult = parseQueryParams(req, productQuerySchema);
  if (!queryResult.success) {
    return createValidationErrorResponse(queryResult.errors);
  }

  const { page, limit, search, categoryId, sortBy, sortOrder, featured } = queryResult.data;

  // Filtreleri oluştur
  const filters: any = {};

  if (search) {
    filters.name = search;
  }

  if (categoryId && categoryId !== 'ALL') {
    filters.category = categoryId;
  }

  if (featured) {
    filters.featured = featured === 'true';
  }

  // Ürünleri getir
  const result = await productService.getPaginatedProducts(page, limit, filters, sortBy, sortOrder);

  return createPaginatedResponse(
    result.data,
    result.page,
    result.limit,
    result.total,
    'Ürünler başarıyla listelendi'
  );
}

/**
 * POST: Yeni ürün ekle
 */
async function createProduct(req: NextRequest, context: any, session: any): Promise<NextResponse> {
  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, createProductSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  // Slug oluştur
  const slug = data.slug || slugify(data.name);

  // Ürünü oluştur
  const product = await productService.createProduct({
    ...data,
    slug,
    images: [], // Ürün oluşturulduktan sonra resimler ayrı bir endpoint ile eklenecek
  });

  return createSuccessResponse(product, 'Ürün başarıyla oluşturuldu', 201);
}

/**
 * Ürün API endpoint'leri
 */
export const GET = withMiddleware(getProducts, { requiredRole: 'ADMIN' });
export const POST = withMiddleware(createProduct, { requiredRole: 'ADMIN' });
