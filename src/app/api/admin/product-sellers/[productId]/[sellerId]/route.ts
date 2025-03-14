import { NextRequest } from 'next/server';
import { productService } from '@/services/product-service';
import { userService } from '@/services/user-service';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseJsonData } from '@/services/api-service';
import { updateProductSellerSchema } from '../../../sellers/schemas';

/**
 * GET: Belirli bir ürün-satıcı ilişkisinin detaylarını getir
 */
async function getProductSellerById(
  req: NextRequest,
  { params }: { params: { productId: string; sellerId: string } },
  session: any
) {
  const { productId, sellerId } = params;

  try {
    // Ürünü getir
    const product = await productService.getProductById(productId);
    if (!product) {
      return createNotFoundResponse('Ürün');
    }

    // Ürün-satıcı ilişkisini bul
    const productSeller = product.seller.find(s => s.sellerId === sellerId);
    if (!productSeller) {
      return createNotFoundResponse('Ürün-satıcı ilişkisi');
    }

    // Satıcı bilgilerini getir
    const seller = await userService.getUserById(sellerId);

    // Ürün-satıcı ilişkisi ve satıcı bilgilerini birleştir
    const result = {
      ...productSeller,
      seller: seller
        ? {
            id: seller.id,
            name: seller.name,
            email: seller.email,
            image: seller.image,
            phone: seller.phone,
          }
        : null,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        images: product.images,
      },
    };

    return createSuccessResponse(result, 'Ürün-satıcı ilişkisi başarıyla getirildi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * PATCH: Ürün-satıcı ilişkisini güncelle
 */
async function updateProductSeller(
  req: NextRequest,
  { params }: { params: { productId: string; sellerId: string } },
  session: any
) {
  const { productId, sellerId } = params;

  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, updateProductSellerSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  try {
    // Ürün-satıcı ilişkisini güncelle
    const updatedProductSeller = await productService.updateProductSeller(
      productId,
      sellerId,
      data
    );

    return createSuccessResponse(
      updatedProductSeller,
      'Ürün-satıcı ilişkisi başarıyla güncellendi'
    );
  } catch (error: any) {
    if (error.message.includes('bulunamadı')) {
      return createNotFoundResponse('Ürün-satıcı ilişkisi');
    }
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * DELETE: Ürün-satıcı ilişkisini sil
 */
async function deleteProductSeller(
  req: NextRequest,
  { params }: { params: { productId: string; sellerId: string } },
  session: any
) {
  const { productId, sellerId } = params;

  try {
    // Ürün-satıcı ilişkisini sil
    const deletedProductSeller = await productService.deleteProductSeller(productId, sellerId);

    return createSuccessResponse(deletedProductSeller, 'Ürün-satıcı ilişkisi başarıyla silindi');
  } catch (error: any) {
    if (error.message.includes('bulunamadı')) {
      return createNotFoundResponse('Ürün-satıcı ilişkisi');
    }
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Ürün-satıcı ilişkisi detay API endpoint'leri
 */
export const GET = withMiddleware(getProductSellerById, { requiredRole: 'ADMIN' });
export const PATCH = withMiddleware(updateProductSeller, { requiredRole: 'ADMIN' });
export const DELETE = withMiddleware(deleteProductSeller, { requiredRole: 'ADMIN' });
