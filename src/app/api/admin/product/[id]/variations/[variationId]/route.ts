import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withMiddleware } from '@/lib/api-middleware';
import { 
  createSuccessResponse, 
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult
} from '@/lib/api-response';
import { parseJsonData } from '@/services/api-service';
import { updateVariationSchema } from '../schemas';
import { productService } from '@/services/product-service';

/**
 * GET: Ürün varyasyonu detayını getir
 */
async function getProductVariationById(
  req: NextRequest, 
  { params }: { params: { id: string, variationId: string } }, 
  session: any
) {
  const { id: productId, variationId } = params;
  
  try {
    // Ürünün var olduğunu kontrol et
    const product = await productService.getProductById(productId);
    if (!product) {
      return createNotFoundResponse('Ürün');
    }
    
    // Varyasyonu getir
    const variation = await prisma.variation.findUnique({
      where: { 
        id: variationId,
        productId
      },
      include: {
        VariationOption: {
          include: {
            optionType: true
          }
        }
      }
    });
    
    if (!variation) {
      return createNotFoundResponse('Ürün varyasyonu');
    }
    
    return createSuccessResponse(variation, 'Ürün varyasyonu başarıyla getirildi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * PATCH: Ürün varyasyonunu güncelle
 */
async function updateProductVariation(
  req: NextRequest, 
  { params }: { params: { id: string, variationId: string } }, 
  session: any
) {
  const { id: productId, variationId } = params;
  
  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, updateVariationSchema);
  const validationResult = handleValidationResult(bodyResult);
  
  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;
  
  try {
    // Ürünün var olduğunu kontrol et
    const product = await productService.getProductById(productId);
    if (!product) {
      return createNotFoundResponse('Ürün');
    }
    
    // Varyasyonun var olduğunu kontrol et
    const variation = await prisma.variation.findUnique({
      where: { 
        id: variationId,
        productId
      }
    });
    
    if (!variation) {
      return createNotFoundResponse('Ürün varyasyonu');
    }
    
    // SKU değiştiriliyorsa, aynı SKU'ya sahip başka bir varyasyon var mı kontrol et
    if (data.sku && data.sku !== variation.sku) {
      const existingVariation = await prisma.variation.findFirst({
        where: {
          sku: {
            equals: data.sku,
            mode: 'insensitive'
          },
          id: {
            not: variationId
          }
        }
      });
      
      if (existingVariation) {
        return createValidationErrorResponse([`"${data.sku}" SKU'lu varyasyon zaten mevcut`]);
      }
    }
    
    // Seçenekler değiştiriliyorsa, seçeneklerin var olduğunu kontrol et
    if (data.options && data.options.length > 0) {
      for (const optionData of data.options) {
        const option = await prisma.variationOption.findUnique({
          where: { id: optionData.optionId },
          include: { optionType: true }
        });
        
        if (!option) {
          return createValidationErrorResponse([`Seçenek bulunamadı: ${optionData.optionId}`]);
        }
        
        if (option.optionType.id !== optionData.optionTypeId) {
          return createValidationErrorResponse([
            `Seçenek (${option.optionType.name}) ve seçenek tipi (${optionData.optionTypeId}) uyuşmuyor`
          ]);
        }
      }
    }
    
    // Güncelleme verilerini hazırla
    const updateData: any = {
      sku: data.sku,
      price: data.price,
      stock: data.stock,
      isActive: data.isActive
    };
    
    if (data.images) {
      updateData.images = data.images;
    }
    
    // Varyasyonu güncelle
    let updatedVariation;
    
    if (data.options) {
      // Seçenekler değiştiriliyorsa, önce mevcut seçenekleri sil
      await prisma.variationOption.deleteMany({
        where: { variationId }
      });
      
      // Varyasyonu ve yeni seçenekleri güncelle
      updatedVariation = await prisma.variation.update({
        where: { id: variationId },
        data: {
          ...updateData,
          VariationOption: {
            create: data.options.map(option => ({
              optionId: option.optionId
            }))
          }
        },
        include: {
          VariationOption: {
            include: {
              optionType: true
            }
          }
        }
      });
    } else {
      // Sadece varyasyon bilgilerini güncelle
      updatedVariation = await prisma.variation.update({
        where: { id: variationId },
        data: updateData,
        include: {
          VariationOption: {
            include: {
              optionType: true
            }
          }
        }
      });
    }
    
    return createSuccessResponse(updatedVariation, 'Ürün varyasyonu başarıyla güncellendi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * DELETE: Ürün varyasyonunu sil
 */
async function deleteProductVariation(
  req: NextRequest, 
  { params }: { params: { id: string, variationId: string } }, 
  session: any
) {
  const { id: productId, variationId } = params;
  
  try {
    // Ürünün var olduğunu kontrol et
    const product = await productService.getProductById(productId);
    if (!product) {
      return createNotFoundResponse('Ürün');
    }
    
    // Varyasyonun var olduğunu kontrol et
    const variation = await prisma.variation.findUnique({
      where: { 
        id: variationId,
        productId
      }
    });
    
    if (!variation) {
      return createNotFoundResponse('Ürün varyasyonu');
    }
    
    // Önce varyasyon seçeneklerini sil
    await prisma.variationOption.deleteMany({
      where: { variationId }
    });
    
    // Varyasyonu sil
    await prisma.variation.delete({
      where: { id: variationId }
    });
    
    return createSuccessResponse(null, 'Ürün varyasyonu başarıyla silindi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Ürün varyasyonu detay API endpoint'leri
 */
export const GET = withMiddleware(getProductVariationById, { requiredRole: 'ADMIN' });
export const PATCH = withMiddleware(updateProductVariation, { requiredRole: 'ADMIN' });
export const DELETE = withMiddleware(deleteProductVariation, { requiredRole: 'ADMIN' }); 