import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseJsonData, parseQueryParams } from '@/services/api-service';
import { variationSchema, variationQuerySchema } from './schemas';
import { productService } from '@/services/product';

/**
 * GET: Ürün varyasyonlarını listele
 */
async function getProductVariations(
  req: NextRequest,
  { params }: { params: { id: string } },
  session: any
) {
  const { id: productId } = params;

  // Query parametrelerini doğrula
  const queryResult = parseQueryParams(req, variationQuerySchema);
  const validationResult = handleValidationResult(queryResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const { sku, isActive, optionId, optionTypeId } = validationResult.data;

  try {
    // Ürünün var olduğunu kontrol et
    const product = await productService.getProductById(productId);
    if (!product) {
      return createNotFoundResponse('Ürün');
    }

    // Filtreleme koşullarını oluştur
    const where: any = {
      productId,
    };

    if (sku) {
      where.sku = {
        contains: sku,
        mode: 'insensitive',
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Seçenek filtreleri
    if (optionId || optionTypeId) {
      where.options = {
        some: {},
      };

      if (optionId) {
        where.options.some.optionId = optionId;
      }

      if (optionTypeId) {
        where.options.some.option = {
          optionTypeId,
        };
      }
    }

    // Varyasyonları getir
    const variations = await prisma.variation.findMany({
      where,
      include: {
        VariationOption: {
          include: {
            optionType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return createSuccessResponse(variations, 'Ürün varyasyonları başarıyla getirildi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * POST: Yeni ürün varyasyonu oluştur
 */
async function createProductVariation(
  req: NextRequest,
  { params }: { params: { id: string } },
  session: any
) {
  const { id: productId } = params;

  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, variationSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  // URL'deki ürün ID'si ile istek gövdesindeki ürün ID'si aynı olmalı
  if (data.productId !== productId) {
    return createValidationErrorResponse(['Ürün ID uyuşmazlığı']);
  }

  try {
    // Ürünün var olduğunu kontrol et
    const product = await productService.getProductById(productId);
    if (!product) {
      return createNotFoundResponse('Ürün');
    }

    // Aynı SKU'ya sahip başka bir varyasyon var mı kontrol et
    const existingVariation = await prisma.variation.findFirst({
      where: {
        sku: {
          equals: data.sku,
          mode: 'insensitive',
        },
      },
    });

    if (existingVariation) {
      return createValidationErrorResponse([`"${data.sku}" SKU'lu varyasyon zaten mevcut`]);
    }

    // Seçeneklerin var olduğunu kontrol et
    for (const optionData of data.options) {
      const option = await prisma.variationOption.findUnique({
        where: { id: optionData.optionId },
        include: { optionType: true },
      });

      if (!option) {
        return createValidationErrorResponse([`Seçenek bulunamadı: ${optionData.optionId}`]);
      }

      if (option.optionType.id !== optionData.optionTypeId) {
        return createValidationErrorResponse([
          `Seçenek (${option.value}) ve seçenek tipi (${optionData.optionTypeId}) uyuşmuyor`,
        ]);
      }
    }

    // Varyasyonu oluştur
    const variation = await prisma.variation.create({
      data: {
        productId: data.productId,
        sku: data.sku,
        price: data.price,
        stock: data.stock,
      },
      include: {
        VariationOption: {
          include: {
            optionType: true,
          },
        },
      },
    });

    return createSuccessResponse(variation, 'Ürün varyasyonu başarıyla oluşturuldu', 201);
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Ürün varyasyonları API endpoint'leri
 */
export const GET = withMiddleware(getProductVariations, { requiredRole: 'ADMIN' });
export const POST = withMiddleware(createProductVariation, { requiredRole: 'ADMIN' });
