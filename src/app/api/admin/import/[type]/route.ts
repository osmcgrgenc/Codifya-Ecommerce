import { NextRequest, NextResponse } from 'next/server';
import { ImportService, ImportResult } from '@/services/import-service';
import { withMiddleware } from '@/lib/api-middleware';
import { 
  createSuccessResponse, 
  createErrorResponse,
  createValidationErrorResponse
} from '@/lib/api-response';
import { z } from 'zod';

// Geçerli içe aktarma tipleri
const VALID_IMPORT_TYPES = ['products', 'categories', 'brands', 'variants'] as const;
type ImportType = (typeof VALID_IMPORT_TYPES)[number];

// Geçerli dosya tipleri
const VALID_FILE_TYPES = ['xlsx', 'xls'];

// İçe aktarma tipi şeması
const importTypeSchema = z.enum(VALID_IMPORT_TYPES);

/**
 * İçe aktarma işlemi için API endpoint'i
 */
async function importData(
  request: NextRequest, 
  { params }: { params: { type: string } },
  session: any
): Promise<NextResponse> {
  // İçe aktarma tipi kontrolü
  const typeResult = importTypeSchema.safeParse(params.type);
  if (!typeResult.success) {
    return createValidationErrorResponse(['Geçersiz içe aktarma tipi']);
  }

  // Dosya kontrolü
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return createErrorResponse('Dosya bulunamadı', 400);
  }

  // Dosya tipi kontrolü
  const fileValidation = validateFileType(file);
  if (!fileValidation.success) {
    return createErrorResponse(fileValidation.message || 'Geçersiz dosya formatı', 400);
  }

  // İçe aktarma işlemini başlat
  const importService = new ImportService();
  const result = await processImport(importService, typeResult.data, file);

  return createSuccessResponse(result, result.success ? 'İçe aktarma başarılı' : 'İçe aktarma başarısız');
}

/**
 * Dosya tipini kontrol eder
 */
function validateFileType(file: File): { success: boolean; message?: string } {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (!fileType || !VALID_FILE_TYPES.includes(fileType)) {
    return {
      success: false,
      message: 'Geçersiz dosya formatı. Lütfen .xlsx veya .xls dosyası yükleyin',
    };
  }

  return { success: true };
}

/**
 * İçe aktarma işlemini gerçekleştirir
 */
async function processImport(
  importService: ImportService,
  type: ImportType,
  file: File
): Promise<ImportResult> {
  switch (type) {
    case 'products':
      return await importService.importProducts(file);
    case 'categories':
      return await importService.importCategories(file);
    case 'brands':
      return await importService.importBrands(file);
    case 'variants':
      return await importService.importVariants(file);
    default:
      // Bu noktaya ulaşılmaması gerekir çünkü tip zaten doğrulanmıştır
      throw new Error('Geçersiz içe aktarma tipi');
  }
}

/**
 * İçe aktarma API endpoint'i
 */
export const POST = withMiddleware(importData, { requiredRole: 'ADMIN' });
