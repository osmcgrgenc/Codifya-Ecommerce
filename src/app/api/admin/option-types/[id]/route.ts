import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withMiddleware } from '@/lib/api-middleware';
import {
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  handleValidationResult,
} from '@/lib/api-response';
import { parseJsonData } from '@/services/api-service';
import { updateOptionTypeSchema } from '../schemas';

/**
 * GET: Seçenek tipi detayını getir
 */
async function getOptionTypeById(
  req: NextRequest,
  { params }: { params: { id: string } },
  session: any
) {
  const { id } = params;

  try {
    // Seçenek tipini getir
    const optionType = await prisma.optionType.findUnique({
      where: { id },
      include: {
        VariationOption: true,
      },
    });

    if (!optionType) {
      return createNotFoundResponse('Seçenek tipi');
    }

    return createSuccessResponse(optionType, 'Seçenek tipi başarıyla getirildi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * PATCH: Seçenek tipini güncelle
 */
async function updateOptionType(
  req: NextRequest,
  { params }: { params: { id: string } },
  session: any
) {
  const { id } = params;

  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, updateOptionTypeSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  try {
    // Seçenek tipinin var olduğunu kontrol et
    const optionType = await prisma.optionType.findUnique({
      where: { id },
    });

    if (!optionType) {
      return createNotFoundResponse('Seçenek tipi');
    }

    // İsim değiştiriliyorsa, aynı isimde başka bir seçenek tipi var mı kontrol et
    if (data.name && data.name !== optionType.name) {
      const existingOptionType = await prisma.optionType.findFirst({
        where: {
          name: {
            equals: data.name,
            mode: 'insensitive',
          },
          id: {
            not: id,
          },
        },
      });

      if (existingOptionType) {
        return createValidationErrorResponse([`"${data.name}" isimli seçenek tipi zaten mevcut`]);
      }
    }

    // Seçenek tipini güncelle
    const updatedOptionType = await prisma.optionType.update({
      where: { id },
      data: {
        name: data.name,
      },
      include: {
        VariationOption: true,
      },
    });

    return createSuccessResponse(updatedOptionType, 'Seçenek tipi başarıyla güncellendi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * DELETE: Seçenek tipini sil
 */
async function deleteOptionType(
  req: NextRequest,
  { params }: { params: { id: string } },
  session: any
) {
  const { id } = params;

  try {
    // Seçenek tipinin var olduğunu kontrol et
    const optionType = await prisma.optionType.findUnique({
      where: { id },
      include: {
        VariationOption: true,
      },
    });

    if (!optionType) {
      return createNotFoundResponse('Seçenek tipi');
    }

    // Seçenek tipine bağlı seçenekler varsa uyarı ver
    if (optionType.VariationOption.length > 0) {
      return createValidationErrorResponse([
        'Bu seçenek tipine bağlı seçenekler bulunmaktadır. Önce bu seçenekleri silmelisiniz.',
      ]);
    }

    // Seçenek tipini sil
    await prisma.optionType.delete({
      where: { id },
    });

    return createSuccessResponse(null, 'Seçenek tipi başarıyla silindi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Seçenek tipi detay API endpoint'leri
 */
export const GET = withMiddleware(getOptionTypeById, { requiredRole: 'ADMIN' });
export const PATCH = withMiddleware(updateOptionType, { requiredRole: 'ADMIN' });
export const DELETE = withMiddleware(deleteOptionType, { requiredRole: 'ADMIN' });
