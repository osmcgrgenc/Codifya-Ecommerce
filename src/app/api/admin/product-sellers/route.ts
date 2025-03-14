import { NextRequest } from 'next/server';
import { productService } from '@/services/product';
import { userService } from '@/services/user-service';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseJsonData, parseQueryParams } from '@/services/api-service';
import { productSellerSchema, productSellerQuerySchema } from './schemas';
import { Product } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Tip tanımlamaları
interface ProductWithRelations extends Product {
  seller: Array<{
    sellerId: string;
    price: number;
    stock: number;
    isActive: boolean;
  }>;
  images: string[];
}

// Servis tarafından dönen UserWithRelations tipini kullan
type UserWithRelations = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string | null;
  [key: string]: any;
};

// Ürün-satıcı ilişkisi tipi
interface ProductSeller {
  sellerId: string;
  price: number;
  stock: number;
  isActive: boolean;
}

/**
 * GET: Ürün-satıcı ilişkilerini listele
 */
async function getProductSellers(req: NextRequest, _: any, session: any) {
  // Query parametrelerini doğrula
  const queryResult = parseQueryParams(req, productSellerQuerySchema);
  const validationResult = handleValidationResult(queryResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const { productId, sellerId } = validationResult.data;

  try {
    let result;

    // Belirli bir ürün için satıcıları getir
    if (productId && !sellerId) {
      const product = await productService.getProductById(productId);
      if (!product) {
        return createNotFoundResponse('Ürün');
      }

      // Satıcı bilgilerini getir
      const sellerIds = product.seller.map(s => s.sellerId);
      // Tek tek satıcıları getir
      const sellers: UserWithRelations[] = [];
      for (const id of sellerIds) {
        const seller = await userService.getUserById(id);
        if (seller) sellers.push(seller);
      }

      // Ürün-satıcı ilişkilerini ve satıcı bilgilerini birleştir
      result = product.seller.map(ps => ({
        ...ps,
        seller: sellers.find(s => s.id === ps.sellerId) || null,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          images: product.images,
        },
      }));
    }
    // Belirli bir satıcı için ürünleri getir
    else if (sellerId && !productId) {
      const seller = await userService.getUserById(sellerId);
      if (!seller) {
        return createNotFoundResponse('Satıcı');
      }

      // Satıcının ürünlerini getir
      const allProducts = await productService.getAllProducts();
      const sellerProducts = allProducts.filter(product =>
        product.seller.some(s => s.sellerId === sellerId)
      );

      // Ürün-satıcı ilişkilerini ve ürün bilgilerini birleştir
      result = sellerProducts.map(product => {
        const productSeller = product.seller.find(s => s.sellerId === sellerId);
        return {
          ...productSeller,
          seller: {
            id: seller.id,
            name: seller.name,
            email: seller.email,
            image: seller.image,
            phone: seller.phone,
          },
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            images: product.images,
          },
        };
      });
    }
    // Tüm ürün-satıcı ilişkilerini getir
    else {
      // Bu kısım daha karmaşık olabilir, şimdilik basit bir şekilde tüm ürünleri getirip
      // satıcı bilgilerini ekleyeceğiz
      const products = await productService.getAllProducts();
      const sellerIdsSet = new Set<string>();
      products.forEach(p => p.seller.forEach(s => sellerIdsSet.add(s.sellerId)));
      const sellerIds = Array.from(sellerIdsSet);

      // Tek tek satıcıları getir
      const sellers: UserWithRelations[] = [];
      for (const id of sellerIds) {
        const seller = await userService.getUserById(id);
        if (seller) sellers.push(seller);
      }

      result = products.flatMap(product =>
        product.seller.map(ps => ({
          ...ps,
          seller: sellers.find(s => s.id === ps.sellerId) || null,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            images: product.images,
          },
        }))
      );
    }

    return createSuccessResponse(result, 'Ürün-satıcı ilişkileri başarıyla getirildi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * POST: Yeni ürün-satıcı ilişkisi oluştur
 */
async function createProductSeller(req: NextRequest, _: any, session: any) {
  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, productSellerSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  try {
    // Ürünün var olduğunu kontrol et
    const product = await productService.getProductById(data.productId);
    if (!product) {
      return createNotFoundResponse('Ürün');
    }

    // Satıcının var olduğunu kontrol et
    const seller = await userService.getUserById(data.sellerId);
    if (!seller) {
      return createNotFoundResponse('Satıcı');
    }

    // Ürün-satıcı ilişkisini oluştur
    // Önce ürünü güncelle
    const existingSeller = product.seller.find(s => s.sellerId === data.sellerId);
    if (existingSeller) {
      return createValidationErrorResponse(['Bu ürün-satıcı ilişkisi zaten mevcut']);
    }

    // Prisma şemasına uygun olarak güncelleme yap
    // Not: Bu kısım product-service içinde uygun bir metot eklenerek daha temiz hale getirilebilir
    const updatedProduct = await prisma.product.update({
      where: { id: data.productId },
      data: {
        seller: {
          create: {
            sellerId: data.sellerId,
            price: data.price,
            stock: data.stock,
          },
        },
      },
      include: {
        seller: true,
      },
    });

    const newProductSeller = updatedProduct.seller.find(
      (s: { sellerId: string }) => s.sellerId === data.sellerId
    );

    return createSuccessResponse(newProductSeller, 'Ürün-satıcı ilişkisi başarıyla oluşturuldu');
  } catch (error: any) {
    if (error.message.includes('zaten var')) {
      return createValidationErrorResponse(['Bu ürün-satıcı ilişkisi zaten mevcut']);
    }
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Ürün-satıcı ilişkisi API endpoint'leri
 */
export const GET = withMiddleware(getProductSellers, { requiredRole: 'ADMIN' });
export const POST = withMiddleware(createProductSeller, { requiredRole: 'ADMIN' });
