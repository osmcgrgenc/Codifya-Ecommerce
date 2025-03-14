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
import { optionTypeSchema, optionTypeQuerySchema } from './schemas';

/**
 * GET: Seçenek tiplerini listele
 */
async function getOptionTypes(req: NextRequest, _: any, session: any) {
  // Query parametrelerini doğrula
  const queryResult = parseQueryParams(req, optionTypeQuerySchema);
  const validationResult = handleValidationResult(queryResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const { name, isActive } = validationResult.data;

  try {
    // Filtreleme koşullarını oluştur
    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Seçenek tiplerini getir
    const optionTypes = await prisma.optionType.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      include: {
        VariationOption: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });

    return createSuccessResponse(optionTypes, 'Seçenek tipleri başarıyla getirildi');
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * POST: Yeni seçenek tipi oluştur
 */
async function createOptionType(req: NextRequest, _: any, session: any) {
  // İstek gövdesini doğrula
  const bodyResult = await parseJsonData(req, optionTypeSchema);
  const validationResult = handleValidationResult(bodyResult);

  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  try {
    // Aynı isimde seçenek tipi var mı kontrol et
    const existingOptionType = await prisma.optionType.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    });

    if (existingOptionType) {
      return createValidationErrorResponse([`"${data.name}" isimli seçenek tipi zaten mevcut`]);
    }

    // Seçenek tipini oluştur
    const optionType = await prisma.optionType.create({
      data: {
        name: data.name,
      },
    });

    return createSuccessResponse(optionType, 'Seçenek tipi başarıyla oluşturuldu', 201);
  } catch (error: any) {
    return createValidationErrorResponse([error.message]);
  }
}

/**
 * Seçenek tipleri API endpoint'leri
 */
export const GET = withMiddleware(getOptionTypes, { requiredRole: 'ADMIN' });
export const POST = withMiddleware(createOptionType, { requiredRole: 'ADMIN' });
