import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';

/**
 * GET: Tüm opsiyon tiplerini getir
 */
export async function GET(req: NextRequest) {
  try {
    // Tüm opsiyon tiplerini getir
    const optionTypes = await prisma.optionType.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return createSuccessResponse(optionTypes, 'Opsiyon tipleri başarıyla getirildi');
  } catch (error: any) {
    console.error('Opsiyon tipleri getirilirken hata:', error);
    return createErrorResponse('Opsiyon tipleri getirilirken bir hata oluştu', 500);
  }
} 