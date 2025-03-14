import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  createSuccessResponse,
  createErrorResponse,
  createNotFoundResponse,
} from '@/lib/api-response';

/**
 * POST: Ürüne yeni varyasyon ekle
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;

    // Ürünün var olup olmadığını kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return createNotFoundResponse('Ürün bulunamadı');
    }

    // İstek gövdesini al
    const body = await req.json();

    // Varyasyon oluştur
    const variation = await prisma.variation.create({
      data: {
        productId,
        sku: body.sku,
        price: body.price,
        stock: body.stock,
      },
    });

    // Varyasyon seçeneklerini oluştur
    if (body.options && body.options.length > 0) {
      for (const option of body.options) {
        await prisma.variationOption.create({
          data: {
            variationId: variation.id,
            optionTypeId: option.optionType,
            value: option.value,
          },
        });
      }
    }

    // Oluşturulan varyasyonu seçenekleriyle birlikte getir
    const createdVariation = await prisma.variation.findUnique({
      where: { id: variation.id },
      include: {
        VariationOption: {
          include: {
            optionType: true,
          },
        },
      },
    });

    return createSuccessResponse(createdVariation, 'Varyasyon başarıyla eklendi', 201);
  } catch (error: any) {
    return createErrorResponse('Varyasyon eklenirken bir hata oluştu', 500);
  }
}
